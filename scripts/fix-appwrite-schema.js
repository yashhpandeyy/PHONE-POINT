const sdk = require('node-appwrite');
require('dotenv').config();

async function fixSchema() {
    const client = new sdk.Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new sdk.Databases(client);
    const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_PHONES;

    console.log(`Connecting to Appwrite: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`);
    console.log(`Project: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`);
    console.log(`Database: ${DATABASE_ID}`);
    console.log(`Collection: ${COLLECTION_ID}`);

    const attributesToAdd = [
        { id: 'Battery', type: 'integer' },
        { id: 'Processor', type: 'string', size: 255 },
        { id: 'camera', type: 'string', size: 255 }
    ];

    for (const attr of attributesToAdd) {
        console.log(`Checking attribute '${attr.id}'...`);
        try {
            if (attr.type === 'integer') {
                await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, attr.id, false);
            } else if (attr.type === 'string') {
                await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, attr.id, attr.size, false);
            }
            console.log(` -> Success: Attribute '${attr.id}' created.`);
            // Wait a bit for Appwrite to process
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            if (e.code === 409) {
                console.log(` -> Attribute '${attr.id}' already exists.`);
            } else {
                console.error(` -> FAILED to create '${attr.id}':`, e.message);
            }
        }
    }

    console.log("\nSchema fix attempt complete.");
}

fixSchema().catch(console.error);
