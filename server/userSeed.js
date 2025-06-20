import User from "./models/User.js";
import bcrypt from 'bcrypt';
import axios from 'axios';
import connetToDatabase from "./Db/db.js";
const userRegister=async()=>{
    connetToDatabase();
    // try {
    //     const hashPassword=await bcrypt.hash("admin",10);
    //     const newUser= new User({
    //         name:"admin",
    //         email:"admin@123",
    //         password:hashPassword,
    //         role:"admin"
    //     })
    //     await newUser.save();
    // } catch (error) {
    //     console.log(error);
    // }
    const email='admin@123';
    const password='rs';
    try {
        const res= await axios.post("http://localhost:3000/api/auth/login",{email,password})
        console.log(res);
    } catch (error) {
        console.log(error)
        
    }
}
userRegister();
