import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   createdAt: { type: Date, default: Date.now, expires: 86400 } ,
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // track who voted
});

const Poll = mongoose.model("Poll", pollSchema);
export default Poll
