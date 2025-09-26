import cloudinary from "../Db/cloudinary.js";
import Policy from "../models/Policy.js";

// Upload policy file to Cloudinary
export const uploadPolicy = async (req, res) => {
  try {
    const file = req.file.path;

    const result = await cloudinary.uploader.upload(file, {
      folder: "hrms_policies",
      resource_type: "auto", // auto handles pdf/docx etc
    });

    const policy = new Policy({
      title: req.body.title,
      fileUrl: result.secure_url,
    });

    await policy.save();

    res.status(201).json({ message: "Policy uploaded successfully", policy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading policy" });
  }
};
