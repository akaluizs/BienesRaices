import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'

/**
 * Cliente de Cloudflare R2
 */
export const s3Client = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
})

/**
 * Subir archivo a R2
 */
export async function uploadToR2(fileBuffer, fileName, mimeType = 'image/webp') {
  try {
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `propiedades/${Date.now()}-${fileName}`,
      Body: fileBuffer,
      ContentType: mimeType,
      // Cacheable por 30 días
      CacheControl: 'public, max-age=2592000',
    }

    const command = new PutObjectCommand(params)
    await s3Client.send(command)

    // Retornar URL pública
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${params.Key}`
    
    return {
      success: true,
      url: publicUrl,
      key: params.Key,
      message: 'Archivo subido exitosamente',
    }
  } catch (error) {
    console.error('Error uploading to R2:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Listar archivos en R2
 */
export async function listR2Files(prefix = 'propiedades/') {
  try {
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 100,
    }

    const command = new ListObjectsV2Command(params)
    const response = await s3Client.send(command)

    return {
      success: true,
      files: response.Contents || [],
      count: response.Contents?.length || 0,
    }
  } catch (error) {
    console.error('Error listing R2 files:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Eliminar archivo de R2
 */
export async function deleteFromR2(key) {
  try {
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }

    const command = new DeleteObjectCommand(params)
    await s3Client.send(command)

    return {
      success: true,
      message: 'Archivo eliminado exitosamente',
    }
  } catch (error) {
    console.error('Error deleting from R2:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}