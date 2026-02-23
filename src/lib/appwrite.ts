import { Client, Account, Databases } from "appwrite";

export const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("6907bb5c002501dba174");

export const account = new Account(client);
export const databases = new Databases(client);
