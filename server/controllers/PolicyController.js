import cloudinary from "../config/cloudinary.js";
import Policy from "../models/Policy.js"; // Mongoose model
import User from "../models/User.js";

// Upload a new policy (PDF/Docx)
export const uploadPolicy = async (req, res) => {
  try {
     console.log("Files received:", req.files || req.file);

    let file;
    if (req.files?.file) {
      file = req.files.file; // express-fileupload
    } else if (req.file) {
      file = req.file; // multer
    } else {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Uploading file:", file.originalname)
    // const file = req.files.file; // Using express-fileupload or multer
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "policies",
      resource_type: "auto",
    });

    const newPolicy = new Policy({
      name:file.originalname,
      url: result.secure_url,
    });

    await newPolicy.save();
    res.status(201).json(newPolicy);
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
};

// Get all policies
export const getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find();
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch policies", error });
  }
};


export const resetPassword=async(req,res)=>{
try {
    const {password}=req.body;
  const {id}=req.body
  console.log("password",password)
  const pass=await User.findByIdAndUpdate({_id:id},{password:password},{new:true})
  res.status(200).json(pass)
  
} catch (error) {
   res.status(500).json({ message: "Failed to update password", error });
  
}
}
