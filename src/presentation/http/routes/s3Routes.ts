// import express from "express";
// import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const s3Router = express.Router();

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// /**
//  * Generate a presigned PUT URL for uploading a file
//  */
// s3Router.get("/presigned-url", async (req, res) => {
//   try {
//     console.log("Entered");
    
//     const { fileName, fileType, folder } = req.query;
//     if (!fileName || !fileType) {
//       return res.status(400).json({ error: "fileName and fileType are required" });
//     }

//     console.log(fileName, fileType, folder);
    

//     const key = `${folder || "uploads"}/${Date.now()}-${fileName}`;

//     console.log("key",key);
    

//     const command = new PutObjectCommand({
//       Bucket: process.env.S3_BUCKET_NAME!,
//       Key: key,
//       ContentType: fileType as string,
//     });

//     const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60 seconds

//     console.log("url",url);

//     res.json({ url, key });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to generate presigned PUT URL" });
//   }
// });

// /**
//  * Generate a presigned GET URL for downloading a file
//  */
// s3Router.get("/download-url", async (req, res) => {
//   try {
//     const { key } = req.query;
//     if (!key) {
//       return res.status(400).json({ error: "key is required" });
//     }

//     const command = new GetObjectCommand({
//       Bucket: process.env.S3_BUCKET_NAME!,
//       Key: key as string,
//     });

//     // URL valid for 5 minutes (300 seconds)
//     const url = await getSignedUrl(s3, command, { expiresIn: 300 });

//     res.json({ url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to generate presigned GET URL" });
//   }
// });

// export default s3Router;


import { s3Controller } from "@setup/container/shared/s3Controller";
import express from "express";

const s3Router = express.Router();

s3Router.get("/presigned-url", (req, res) => s3Controller.getUploadUrl(req, res));
s3Router.get("/download-url", (req, res) => s3Controller.getDownloadUrl(req, res));

export default s3Router;
