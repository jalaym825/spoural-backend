import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || 'YOUR_CLOUD_NAME',
    api_key: process.env.API_KEY || 'YOUR_API_KEY',
    api_secret: process.env.API_SECRET || 'YOUR_API_SECRET',
});

export const uploadoncloudinary = async (localFilePath: string) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        // Delete local file after upload
        fs.unlinkSync(localFilePath);

        console.log('File uploaded successfully:', response.url);
        return response;
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        fs.unlinkSync(localFilePath); // Remove local file on error
        throw error;
    }
};
