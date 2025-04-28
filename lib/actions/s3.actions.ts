"use server";

import {
  S3Client,
  PutObjectCommand,
  S3ClientConfig,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const awsRegion = process.env.AWS_REGION;

const s3ClientConfig: S3ClientConfig = {
  region: awsRegion,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

const s3 = new S3Client(s3ClientConfig);

export async function uploadToS3(file: File): Promise<string> {
  try {
    if (file.size === 0) {
      throw new Error("Please select a file.");
    }

    const fileName = `${uuidv4()}-${file.name}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    };

    // Upload the file to S3
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Return the public URL of the uploaded file
    const fileUrl = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}

export async function deleteFromS3(url: string) {
  try {
    const fileName = url.split(".com/")[1];

    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return { success: false, message: "Failed to delete file from S3" };
  }
}
