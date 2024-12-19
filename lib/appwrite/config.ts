export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  userCollection: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  fileCollection: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
  bucketID: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secreteKey:process.env.NEXT_APPWRITE_SECRET!
}