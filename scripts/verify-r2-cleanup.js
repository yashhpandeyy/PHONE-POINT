
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

async function listR2Objects() {
    const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
    });

    try {
        const data = await s3Client.send(command);
        console.log('--- R2 Bucket Contents ---');
        if (!data.Contents || data.Contents.length === 0) {
            console.log('Bucket is empty.');
        } else {
            data.Contents.forEach((obj) => {
                console.log(`- ${obj.Key} (${obj.Size} bytes)`);
            });
        }
        console.log('-------------------------');
        return data.Contents || [];
    } catch (error) {
        console.error('Failed to list R2 objects:', error);
    }
}

listR2Objects();
