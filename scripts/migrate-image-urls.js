const sdk = require('node-appwrite');
require('dotenv').config();

const unquote = (str) => str?.replace(/(^"|"$)/g, '');

async function migrateImages() {
    const client = new sdk.Client()
        .setEndpoint(unquote(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT))
        .setProject(unquote(process.env.NEXT_PUBLIC_APPWRITE_PROJECT))
        .setKey(unquote(process.env.APPWRITE_API_KEY));

    const databases = new sdk.Databases(client);
    const DATABASE_ID = unquote(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID);
    const COLLECTION_ID = unquote(process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_PHONES);

    const OLD_HOST = "167fa204f37576a8b5d3e3288f66fd11.r2.cloudflarestorage.com";
    const NEW_HOST = "pub-642b64eb0f14404c91d93ae3ac99c05d.r2.dev";

    console.log(`Starting migration for collection: ${COLLECTION_ID}...`);

    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            sdk.Query.limit(100)
        ]);

        console.log(`Found ${response.documents.length} documents.`);

        for (const doc of response.documents) {
            let updated = false;
            if (doc.image && Array.isArray(doc.image)) {
                const newImages = doc.image.map(url => {
                    if (url.includes(OLD_HOST)) {
                        updated = true;
                        return url.replace(OLD_HOST, NEW_HOST);
                    }
                    return url;
                });

                if (updated) {
                    console.log(`Updating document ${doc.$id} (${doc.name})...`);
                    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                        image: newImages
                    });
                    console.log(` -> Success.`);
                }
            }
        }

        console.log("\nMigration complete!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

migrateImages().catch(console.error);
