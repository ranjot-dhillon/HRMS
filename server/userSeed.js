// import User from "./models/User.js";
// import bcrypt from 'bcrypt';
// import axios from 'axios';
// import connetToDatabase from "./Db/db.js";
// const userRegister=async()=>{
//     connetToDatabase();
//     // try {
//     //     const hashPassword=await bcrypt.hash("admin",10);
//     //     const newUser= new User({
//     //         name:"admin",
//     //         email:"admin@123",
//     //         password:hashPassword,
//     //         role:"admin"
//     //     })
//     //     await newUser.save();
//     // } catch (error) {
//     //     console.log(error);
//     // }
//     const email='admin@123';
//     const password='rs';
//     try {
//         const res= await axios.post("http://localhost:3000/api/auth/login",{email,password})
//         console.log(res);
//     } catch (error) {
//         console.log(error)
        
//     }
// }
// userRegister();


// runJulySalary.js
import Salary from './models/Salary.js';
import MonthlySalary from './models/MonthlySalarySchema.js';
import mongoose from 'mongoose';

const MONGO_URI = "mongodb://localhost:27017/yourDB"; // Update with your DB name

const generateJulySalaries = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🟢 Connected to DB');

    const monthKey = "2025-07";

    const employeeSalaries = await Salary.find();

    for (const emp of employeeSalaries) {
      const alreadyExists = await MonthlySalary.findOne({
        employeeId: emp.employeeId,
        month: monthKey,
      });

      if (!alreadyExists) {
        await MonthlySalary.create({
          employeeId: emp.employeeId,
          month: monthKey,
          total: emp.total,
          status: 'Unpaid',
        });

        console.log(`✅ July salary created for ${emp.employeeId}`);
      } else {
        console.log(`⚠️ July salary already exists for ${emp.employeeId}`);
      }
    }

    console.log('🎉 Done generating July salaries!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

generateJulySalaries();

