import express, { json } from 'express';
import cors from 'cors';
import authRoute from './routes/auth.js';
import departmentRoute from './routes/department.js';
import connetToDatabase from "./Db/db.js";
connetToDatabase();
const app=express()
app.use(express.json())
app.use(cors());

app.use('/api/auth',authRoute);
app.use('/api/department',departmentRoute);

app.listen(process.env.PORT,()=>{
    console.log(`server is running at ${process.env.PORT}`)
})