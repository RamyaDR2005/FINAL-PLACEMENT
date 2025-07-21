import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

// Cloudflare R2 configuration
const r2Client = new S3Client({
  region: "auto", // R2 uses "auto" for region
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!, // https://<account-id>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!
const PUBLIC_DOMAIN = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN! // Your custom domain for R2 bucket

/**
 * Generate a proper filename with user ID, type, and timestamp
 */
export function generateFilename(userId: string, type: string, originalFilename: string): string {
  const timestamp = Date.now()
  const fileExtension = originalFilename.split(".").pop()?.toLowerCase()
  
  // Clean and format the filename
  const sanitizedType = type.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
  
  return `users/${userId}/${sanitizedType}/${sanitizedType}-${timestamp}.${fileExtension}`
}

/**
 * Upload file to Cloudflare R2
 */
export async function uploadToR2(
  buffer: Buffer,
  filename: string,
  contentType: string,
  userId: string
): Promise<{ url: string; key: string }> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        userId: userId,
        uploadedAt: new Date().toISOString(),
      },
    })

    await r2Client.send(command)

    // Return the public URL
    const publicUrl = `${PUBLIC_DOMAIN}/${filename}`

    return {
      url: publicUrl,
      key: filename,
    }
  } catch (error) {
    console.error("Error uploading to R2:", error)
    throw new Error("Failed to upload file to storage")
  }
}

/**
 * Delete file from Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await r2Client.send(command)
  } catch (error) {
    console.error("Error deleting from R2:", error)
    throw new Error("Failed to delete file from storage")
  }
}

/**
 * Get file type category based on upload type
 */
export function getFileTypeCategory(type: string): "image" | "document" {
  const imageTypes = ["profile-photo"]
  return imageTypes.includes(type) ? "image" : "document"
}
