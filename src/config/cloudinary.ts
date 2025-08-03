import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import * as streamifier from "streamifier";

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

export const cloudinaryUpload = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result as UploadApiResponse);
      }
    });

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
