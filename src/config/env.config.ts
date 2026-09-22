export const envConfig = {
  mongodbUri: process.env.MONGODB_URI || '',
  adminUsername: process.env.ADMIN_USERNAME || 'sanmanhum26@gmail.com,sanmanhub26@gmail.com',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  adminSessionSecret: process.env.ADMIN_SESSION_SECRET || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  emailFrom: (process.env.EMAIL_FROM || 'Pfundit <no-info@send.pfundit.com>').replace(/"/g, ''),
  cloudinaryUrl: process.env.CLOUDINARY_URL || '',
};
