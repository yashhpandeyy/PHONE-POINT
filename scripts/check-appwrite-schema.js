const sdk = require('node-appwrite');
require('dotenv').config();

async function checkSchema() {
    const client = new sdk.Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new sdk.Databases(client);
    const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_PHONES;

    const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
    console.log("Current Attributes in 'products' collection:");
    collection.attributes.forEach(attr => {
        console.log(`- ${attr.key} (${attr.type}) [Status: ${attr.status}]`);
    });
}

checkSchema().catch(console.error);
