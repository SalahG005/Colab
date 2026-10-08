const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;

const cloudinaryReady = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryReady) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const cloudinaryUploadFile = async (fileToUpload) => {
  if (!cloudinaryReady) {
    const filename = path.basename(fileToUpload);
    const baseUrl = process.env.SERVER_URL || "http://localhost:5000";
    return {
      secure_url: `${baseUrl}/uploads/${encodeURIComponent(filename)}`,
      public_id: filename,
      resource_type: "image",
      local: true,
    };
  }

  try {
    const result = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Cloudinary upload failed");
  }
};

const cloudinaryRemoveImage = async (publicId) => {
  if (!publicId) return;
  if (!cloudinaryReady) {
    const filePath = path.join(__dirname, "../images", publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return;
  }

  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete from Cloudinary");
  }
};

const cloudinaryRemoveMultipleImage = async (publicIds) => {
  if (!cloudinaryReady) {
    for (const publicId of publicIds || []) {
      await cloudinaryRemoveImage(publicId);
    }
    return;
  }

  try {
    return await cloudinary.api.delete_resources(publicIds);
  } catch (error) {
    console.error("Cloudinary multiple delete error:", error);
    throw new Error("Failed to delete multiple files");
  }
};

module.exports = {
  cloudinaryUploadFile,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
};
