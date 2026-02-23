
'use server';

// --- Main Setup Function ---
export async function setupDatabase() {
    const logs: string[] = [];
    try {
        const nodeAppwrite = require('node-appwrite');
        logs.push("--- DEBUG INFO ---");
        logs.push(`1. Type of imported 'node-Appwrite' module: ${typeof nodeAppwrite}`);
        logs.push(`2. Keys in 'node-appwrite' module: ${Object.keys(nodeAppwrite).join(', ')}`);

        if (nodeAppwrite.Client) {
            logs.push("3. 'nodeAppwrite.Client' exists.");
            try {
                const testClient = new nodeAppwrite.Client();
                logs.push("4. Successfully created a 'new nodeAppwrite.Client()' instance.");
                logs.push(`5. Keys in client instance: ${Object.keys(testClient).join(', ')}`);
                logs.push(`6. Does instance have 'setKey' method? -> ${'setKey' in testClient}`);
                logs.push(`7. Does instance have 'setEndpoint' method? -> ${'setEndpoint' in testClient}`);
            } catch (e) {
                logs.push("4. FAILED to create a 'new nodeAppwrite.Client()' instance.");
            }
        } else {
            logs.push("3. 'nodeAppwrite.Client' does NOT exist.");
        }
        logs.push("--- END DEBUG INFO ---");


        // --- Validations ---
        const requiredVars = ['APPWRITE_API_KEY', 'NEXT_PUBLIC_APPWRITE_ENDPOINT', 'NEXT_PUBLIC_APPWRITE_PROJECT', 'NEXT_PUBLIC_APPWRITE_DATABASE_ID', 'NEXT_PUBLIC_APPWRITE_COLLECTION_ID_PHONES', 'NEXT_PUBLIC_APPWRITE_COLLECTION_ID_CONVERSATIONS', 'NEXT_PUBLIC_APPWRITE_COLLECTION_ID_MESSAGES'];
        for (const v of requiredVars) {
            if (!process.env[v] || (process.env[v] as string).includes('YOUR_')) {
                throw new Error(`Environment variable ${v} is not set correctly in your .env file.`);
            }
        }
        logs.push('All environment variables found.');

        // --- Server-side Client Initialization ---
        const client = new nodeAppwrite.Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string)
            .setKey(process.env.APPWRITE_API_KEY as string);

        const databases = new nodeAppwrite.Databases(client);

        // --- Create Database if it doesn't exist ---
        const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
        logs.push(`\nUsing Database ID: ${DATABASE_ID}`);
        try {
            await databases.get(DATABASE_ID);
            logs.push(`Database '${DATABASE_ID}' already exists. Skipping creation.`);
        } catch (e: any) {
            if (e.code === 404) {
                logs.push(`Database '${DATABASE_ID}' not found. Creating...`);
                await databases.create(DATABASE_ID, DATABASE_ID);
                logs.push(` -> Success: Database '${DATABASE_ID}' created.`);
            } else {
                throw e;
            }
        }

        // --- Setup All Collections ---
        await setupCollection(databases, process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_PHONES as string, "products", productsAttributes, productsIndexes, logs);
        await setupCollection(databases, process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_CONVERSATIONS as string, "conversations", conversationsAttributes, conversationsIndexes, logs);
        await setupCollection(databases, process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_MESSAGES as string, "messages", messagesAttributes, messagesIndexes, logs);


        logs.push("\nSetup complete! Your database is ready.");
        return { success: true, logs: logs, message: "Database configuration finished successfully!" };

    } catch (error: any) {
        console.error("Database setup failed:", error);
        // Add the debug logs to the output even if it fails
        const finalLogs = [...logs, `\n❌ An error occurred: ${error.message}`];
        return { success: false, message: error.message, logs: finalLogs };
    }
}


// --- Helper Function for a single collection ---
async function setupCollection(databases: any, collectionId: string, collectionName: string, attributes: any[], indexes: any[], logs: string[]) {
    const nodeAppwrite = require('node-appwrite');
    const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
    logs.push(`\n--- Starting setup for collection: ${collectionName} (${collectionId}) ---`);

    // 1. Create Collection if it doesn't exist
    try {
        await databases.getCollection(DATABASE_ID, collectionId);
        logs.push(`Collection '${collectionName}' already exists. Skipping creation.`);
    } catch (e: any) {
        if (e.code === 404) {
            logs.push(`Collection '${collectionName}' not found. Creating...`);
            const permissions = [
                nodeAppwrite.Permission.read(nodeAppwrite.Role.any()),
                nodeAppwrite.Permission.create(nodeAppwrite.Role.users()),
                nodeAppwrite.Permission.update(nodeAppwrite.Role.users()),
                nodeAppwrite.Permission.delete(nodeAppwrite.Role.users()),
            ];
            await databases.createCollection(DATABASE_ID, collectionId, collectionName, permissions);
            logs.push(` -> Success: Collection '${collectionName}' created.`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
            throw e;
        }
    }

    const collection = await databases.getCollection(DATABASE_ID, collectionId);
    const existingAttributes = new Set(collection.attributes.map((attr: any) => attr.key));

    // 2. Create Missing Attributes
    for (const attr of attributes) {
        if (existingAttributes.has(attr.id)) {
            logs.push(`Attribute '${attr.id}' already exists. Skipping.`);
            continue;
        }
        logs.push(`Creating attribute '${attr.id}'...`);
        try {
            switch (attr.type) {
                case 'string':
                    await databases.createStringAttribute(DATABASE_ID, collectionId, attr.id, attr.size, attr.required, undefined, attr.array);
                    break;
                case 'integer':
                    await databases.createIntegerAttribute(DATABASE_ID, collectionId, attr.id, attr.required, undefined, undefined, attr.array);
                    break;
            }
            logs.push(` -> Success. Waiting for processing...`);
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (e: any) {
            if (e.code === 409) {
                logs.push(` -> Attribute '${attr.id}' already exists (conflict). Skipping.`);
            } else {
                logs.push(` -> FAILED: ${e.message}`);
                throw e;
            }
        }
    }

    // 3. Create Missing Indexes
    logs.push("Waiting for attributes to be fully processed before creating indexes...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    for (const index of indexes) {
        const currentCollection = await databases.getCollection(DATABASE_ID, collectionId);
        const currentIndex = currentCollection.indexes.find((idx: any) => idx.key === index.id);

        if (currentIndex && currentIndex.status === 'available') {
            logs.push(`Index '${index.id}' already exists and is available. Skipping.`);
            continue;
        }
        if (currentIndex && (currentIndex.status === 'processing' || currentIndex.status === 'deleting')) {
            logs.push(`Index '${index.id}' is currently processing. Skipping creation to avoid conflicts.`);
            continue;
        }

        logs.push(`Creating index '${index.id}' on: ${index.attributes.join(', ')}...`);
        try {
            await databases.createIndex(DATABASE_ID, collectionId, index.id, index.type, index.attributes, index.orders);
            logs.push(` -> Success.`);
            await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (e: any) {
            if (e.code === 409) {
                logs.push(` -> Index '${index.id}' already exists (conflict). Skipping.`);
            } else {
                logs.push(` -> FAILED: ${e.message}`);
                throw e;
            }
        }
    }
}


// --- Schema Definitions ---
const productsAttributes = [
    { id: 'name', type: 'string', size: 255, required: true, array: false },
    { id: 'price', type: 'integer', required: true, array: false },
    { id: 'description', type: 'string', size: 10000, required: true, array: false },
    { id: 'image', type: 'string', size: 2048, required: false, array: true },
    { id: 'type', type: 'string', size: 255, required: true, array: false },
    { id: 'brand', type: 'string', size: 255, required: false, array: false },
    { id: 'Condition', type: 'string', size: 255, required: false, array: false },
    { id: 'storage', type: 'string', size: 255, required: false, array: false },
    { id: 'Colour', type: 'string', size: 255, required: false, array: false },
    { id: 'camera', type: 'string', size: 255, required: false, array: false },
    { id: 'Battery', type: 'integer', required: false, array: false },
    { id: 'Processor', type: 'string', size: 255, required: false, array: false },
];
const productsIndexes = [
    { id: 'type_index', type: 'key', attributes: ['type'], orders: [] },
    { id: 'brand_index', type: 'key', attributes: ['brand'], orders: [] },
];

const conversationsAttributes = [
    { id: 'participants', type: 'string', size: 512, required: true, array: true },
    { id: 'lastMessage', type: 'string', size: 1000, required: false, array: false },
    { id: 'lastUpdatedAt', type: 'string', size: 255, required: true, array: false },
    { id: 'userName', type: 'string', size: 255, required: true, array: false },
    { id: 'userId', type: 'string', size: 255, required: true, array: false },
    { id: 'userEmail', type: 'string', size: 255, required: true, array: false },
    { id: 'lastRepliedBy', type: 'string', size: 255, required: false, array: false },
];
const conversationsIndexes = [
    { id: 'userId_index', type: 'key', attributes: ['userId'], orders: [] },
];

const messagesAttributes = [
    { id: 'conversationId', type: 'string', size: 255, required: true, array: false },
    { id: 'senderId', type: 'string', size: 255, required: true, array: false },
    { id: 'text', type: 'string', size: 10000, required: true, array: false },
];
const messagesIndexes = [
    { id: 'conversationId_index', type: 'key', attributes: ['conversationId'], orders: [] }
];
