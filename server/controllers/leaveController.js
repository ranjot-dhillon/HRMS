import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const addLeave=async(req,res)=>{
    

    try{
        console.log("Received request body:", req.body);
   
       const {userId,leaveType,startDate,endDate,reason}=req.body;
       const employee=await Employee.findOne({userId});
       if(!employee){
        return res.status(400).json({success:false,error:"employee not found in applying Leave"})
       }
      
   
       const newLeave=new Leave({
          employeeId:employee._id,leaveType,startDate,endDate,reason,
       })
       newLeave.save();
       return res.status(200).json({success:true})
   }
   catch(error){
    console.log(error)
       return res.status(400).json({success:false,error:"in applying Leave"})
   }
}



const getLeaves=async(req,res)=>{
   try {

     const {id}=req.params;
     const leaves=await Leave.find({employeeId:id})
  if(!leaves)
  {
       const employee=await Employee.findOne({userId:id})
      leaves=await Leave.find({employeeId:employee._id})
  }
    return res.status(200).json({success:true,leaves})
    
   } catch (error) {
    return res.status(400).json({success:false,error:"Leaves get server error"});
    
   }
}

const getAllLeaves=async(req,res)=>{
    try {
   const AppliedLeaves = await Leave.find().populate({
       path: "employeeId",
       populate:[
         {
             path: "userId",          // populate the user from employee
         select: "name",
         },
         {
            path:'department',
            select:'dep_name'
         }

       ] 
     } );
   
         //   console.log("All queries",AppliedLeaves)
           return res.status(200).json({success:true,AppliedLeaves})
           
       } catch (error) {
         console.error("❌ Error fetching leaves:", error);
           return  res.status(500).json({ success: false, message: error.message });
         //   return res.status(500).json({success:false})
           
       }
   


}

const handleResponse=async(req,res)=>{
  try {
    const {id}=req.params;
    const {response,status}=req.body;
    console.log(id)
    console.log(response);
    console.log(status);
    if(response.length==0){
      await Leave.findByIdAndUpdate(id,{
      status:status,
   })
   return res.status(200).json({success:true})
    }
       await Leave.findByIdAndUpdate(id,{
      response:response,
      status:status,
   })
   return res.status(200).json({success:true})
   
  } catch (error) {
   return res.status(400).json({success:false,error})
   
  }
}


const deleteOldLeaves = async (req, res) => {
  try {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const result = await Leave.deleteMany({
      createdAt: { $lt: fiveDaysAgo }
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} old leave(s) deleted.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


export {addLeave,getLeaves,getAllLeaves,handleResponse,deleteOldLeaves}