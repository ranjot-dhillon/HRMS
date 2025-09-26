import mongoose from "mongoose";

const PolicySchema = new mongoose.Schema({
  name: { type: String },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Policy", PolicySchema);
