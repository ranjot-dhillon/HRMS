import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import MonthlySalary from "../models/MonthlySalarySchema.js";
import axios from "axios";
import Query from "../models/Query.js";
import moment from "moment"; 
import Poll from "../models/Poll.js";
import { useParams } from "react-router-dom";

const createPoll=async(req,res)=>{
  try {
     const { question, options } = req.body;

  const newPoll = new Poll({
    question,
    options: options.map(o => ({ text: o }))
  });

  await newPoll.save();
  res.json({ success: true, poll: newPoll });
    
  } catch (error) {
     res.status(500).json({ success: false, error: error.message });

    
  }


}
const latestPoll=async(req,res)=>{
  const polls = await Poll.find();
  console.log("pole",polls)
 return res.status(200).json(polls);
}

const submitPoll=async(req,res)=>{
  try {
   const { pollId } = req.params;
    const { optionId} = req.body; // voterId is optional if you want unique votes

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: "Poll not found" });


    // Find option & increase vote
    const option = poll.options.id(optionId);
    if (!option) return res.status(404).json({ error: "Option not found" });

    option.votes += 1;

    // if (voterId) poll.voters.push(voterId);

    await poll.save();

    res.json({ message: "Vote submitted successfully", poll });

    
  } catch (error) {
     res.status(500).json({ error: "Failed to submit vote" });
    
  }
}

const deletePoll=async(req,res)=>{
    const {pollId}=req.params
    await Poll.findByIdAndDelete({_id:pollId})
    const polls = await Poll.find();
//   console.log("pole",polls)
     return res.status(200).json(polls);
   

}

export {createPoll,latestPoll,submitPoll,deletePoll}
