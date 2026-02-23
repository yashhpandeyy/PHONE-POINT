import { Client, Account, Databases } from "appwrite";

export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "6907bb5c002501dba174";
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "691408f10005429ff0e5";
export const COLLECTION_ID_PHONES = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_PHONES || "products";
export const COLLECTION_ID_PRODUCTS = COLLECTION_ID_PHONES; // Alias for convenience
export const COLLECTION_ID_CONVERSATIONS = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_CONVERSATIONS || "conversations";
export const COLLECTION_ID_MESSAGES = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_MESSAGES || "messages";

export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
