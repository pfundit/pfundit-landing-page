import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from '@/config/env.config';

if (envConfig.cloudinaryUrl) {
  cloudinary.config({
    cloudinary_url: envConfig.cloudinaryUrl,
  });
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  bytes?: number;
}

function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  if (parts.length < 2) return '';
  return parts[parts.length - 1].toLowerCase();
}

export async function uploadResumeToCloudinary(
  fileBuffer: Buffer,
  originalFileName: string
): Promise<CloudinaryUploadResult> {
  const sanitized = sanitizeFileName(originalFileName);
  const timestamp = Date.now();
  const publicId = `pfundit/resumes/${timestamp}-${sanitized}`;
  const extension = getFileExtension(originalFileName) || 'pdf';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id: publicId,
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary resume upload error:', error);
          reject(error || new Error('Upload to Cloudinary failed'));
        } else {
          let directDownloadUrl = '';
          try {
            directDownloadUrl = cloudinary.utils.private_download_url(
              result.public_id,
              extension,
              {
                resource_type: 'raw',
                type: 'upload',
                expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 365, // 1 year
              }
            );
          } catch (e) {
            console.warn('Could not generate private download url:', e);
          }

          const finalUrl = directDownloadUrl || result.secure_url || result.url;

          resolve({
            url: finalUrl,
            secureUrl: finalUrl,
            publicId: result.public_id,
            bytes: result.bytes,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}
