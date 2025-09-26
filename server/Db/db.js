import mongoose from "mongoose";
import dotenv from "dotenv";
import startSalaryGenerationJob from "../cron/salaryCron.js";
dotenv.config();
const connetToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    startSalaryGenerationJob();
  } catch (error) {
    console.log(error);
  }
};
export default connetToDatabase;
