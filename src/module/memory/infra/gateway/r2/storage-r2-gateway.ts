import { StorageGateway } from "../../../application/contract/gateway/storage-gateway";
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../../../common";
import { File } from "../../../domain/entity/file";

export class StorageR2Gateway implements StorageGateway {
  private r2Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = env.R2_STORAGE_BUCKET_NAME;
    this.r2Client = new S3Client({
      region: "auto",
      endpoint: env.R2_STORAGE_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_STORAGE_ACCESS_KEY_ID,
        secretAccessKey: env.R2_STORAGE_SECRET_ACCESS_KEY,
      },
    });
  }

  async delete(filename: string): Promise<void> {
    const uploadParams: DeleteObjectCommandInput = {
      Bucket: this.bucketName,
      Key: filename,
    };
    const command = new DeleteObjectCommand(uploadParams);
    await this.r2Client.send(command);
  }

  async upload(file: File): Promise<void> {
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: file.getName(),
      Body: file.getBuffer(),
      ContentType: file.getMimetype(),
    };
    const command = new PutObjectCommand(uploadParams);
    const response = await this.r2Client.send(command);
  }

  async getSignedUploadUrl(
    filename: string,
    config: { expiresIn: number; contentLength?: number; contentType?: string },
  ): Promise<{ url: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
      ContentLength: config.contentLength,
      ContentType: config.contentType,
    });
    const signedUrl = await getSignedUrl(this.r2Client, command, {
      expiresIn: config.expiresIn,
    });
    return { url: signedUrl };
  }

  async getSignedGetUrl(
    filename: string,
    config: { expiresIn: number },
  ): Promise<{ url: string }> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
    });
    const signedUrl = await getSignedUrl(this.r2Client, command, {
      expiresIn: config.expiresIn,
    });
    return { url: signedUrl };
  }
}
