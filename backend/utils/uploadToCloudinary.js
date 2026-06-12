import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "shopwear/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });
};
