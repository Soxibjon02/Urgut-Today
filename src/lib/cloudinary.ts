import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'urgut-today',
        public_id: `${Date.now()}_${filename.replace(/\.[^/.]+$/, '')}`,
        overwrite: false,
        resource_type: 'image',
        format: 'webp',
        quality: 'auto:good',
        transformation: [{ width: 1200, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result!.secure_url)
      }
    )
    uploadStream.end(buffer)
  })
}

export default cloudinary
