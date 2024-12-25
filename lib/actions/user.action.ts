'use server'

import { ID, Query } from 'node-appwrite'
import { createAdminClient, createSessionClient } from '../appwrite'
import { appwriteConfig } from '../appwrite/config'
import { parseStringify } from '../utils'
import { cookies } from 'next/headers'
import { avatarPlaceholder } from '@/constansts'

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient()

  const result = await databases.listDocuments(
    appwriteConfig.databaseID,
    appwriteConfig.userCollection,
    [Query.equal('email', [email])]
  )
  return result.total > 0 ? result.documents[0] : null
}

const handleError = (error: unknown, message: string) => {
  console.log(error, message)
  throw error
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient()
  try {
    const session = await account.createEmailToken(ID.unique(), email)
    return session.userId
  } catch (error) {
    handleError(error, 'failed to send email otp')
  }
}

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string
  email: string
}) => {
  const existingUser = await getUserByEmail(email)
  const accountID = await sendEmailOTP({ email })
  if (!accountID) throw new Error('failed to send otp')

  if (!existingUser) {
    const { databases } = await createAdminClient()
    await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.userCollection,
      ID.unique(),
      {
        fullName,
        email,
        avatar:avatarPlaceholder,
        accountID,
      },
    );
  }
  return parseStringify({accountID})
}

export const verifySecret = async ({accountID,password}:{accountID: string;password:string})=>{
  try {
    const {account} =await createAdminClient();
    const session = await account.createSession(accountID,password);
    (await cookies()).set('appwrite-session',session.secret,{
      path:'/',
      httpOnly:true,
      sameSite:'strict',
      secure:true,
    });
    return parseStringify({sessionID:session.$id})
  } catch (error) {
    handleError(error,"Failed to verify OTP")
    
  }
}

export const getCurrentUser= async()=>{
  const {databases,account} = await createSessionClient();
  const result = await account.get();
  const user = await databases.listDocuments(
    appwriteConfig.databaseID,
    appwriteConfig.userCollection,
    [Query.equal("accountID",result.$id)],
  );
  if(user.total <= 0) return null;
  return parseStringify(user.documents[0]);
}