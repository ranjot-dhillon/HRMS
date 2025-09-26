// backend/routes/policyRoutes.js
import express from "express";
import { uploadPolicy, getPolicies ,resetPassword } from "../controllers/PolicyController.js";
const router = express.Router();
import multer from "multer";

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadPolicy);

// router.post("/upload", uploadPolicy);

// GET - Fetch all policies
router.get("/", getPolicies);

router.put("/reset-password", resetPassword);

export default router;
