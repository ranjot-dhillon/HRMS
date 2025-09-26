import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
