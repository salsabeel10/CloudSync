'use server'

import { ID, Query } from 'node-appwrite'
import { createAdminClient } from '../appwrite'
import { appwriteConfig } from '../appwrite/config'
import { parseStringify } from '../utils'

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

const sendEmailOTP = async ({ email }: { email: string }) => {
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
        avatar:
          'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
        accountID,
      },
    );
  }
  return parseStringify({accountID})
}
