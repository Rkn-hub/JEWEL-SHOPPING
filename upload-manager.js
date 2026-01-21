const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

// R2 Credentials from User
const ACCOUNT_ID = "c6842d7d3541f805f38de53202ff48a0";
const ACCESS_KEY_ID = "c69480c5e1be213db0766c0e5cebbd0c";
const SECRET_ACCESS_KEY = "a31d20a1e5616f7abb66fceeb65af4042e159c61d45525152dce5a49f994a3f8";
const BUCKET_NAME = "product";
const PUBLIC_URL = "https://pub-f797be67514a4a91ab36b6c15ac2196f.r2.dev";

// Initialize S3 Client (R2 is S3 compatible)
const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});

async function uploadFile(filePath) {
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath);
    const contentType = mime.lookup(filePath) || "application/octet-stream";

    console.log(`📤 Uploading ${fileName}...`);

    try {
        await s3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: fileContent,
            ContentType: contentType,
        }));

        const publicUrl = `${PUBLIC_URL}/${fileName}`;
        console.log(`✅ Success! URL: ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        console.error(`❌ Failed to upload ${fileName}:`, error);
        return null;
    }
}

// Ensure @aws-sdk/client-s3 and mime-types are installed
console.log("To run this script, first install dependencies:");
console.log("npm install @aws-sdk/client-s3 mime-types\n");

// Example usage: Upload all images in the 'images' directory
// Uncomment to run:
// const imagesDir = path.join(__dirname, 'images');
// if (fs.existsSync(imagesDir)) {
//     fs.readdirSync(imagesDir).forEach(file => {
//         if (['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())) {
//             uploadFile(path.join(imagesDir, file));
//         }
//     });
// }

// Export to be used by other scripts
module.exports = { uploadFile };
