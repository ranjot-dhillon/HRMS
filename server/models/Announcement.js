import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
     createdAt: { type: Date, default: Date.now, expires: 86400 } ,
  updateAt: { type: Date, degault: Date.now },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
