import express, { json } from 'express';
import cors from 'cors';
import authRoute from './routes/auth.js';
import departmentRoute from './routes/department.js';
import employeeRoute from './routes/employee.js'
import salaryRoute from './routes/salary.js'
import connetToDatabase from "./Db/db.js";
import leaveRoute from './routes/leaves.js'
import queryRoute from './routes/query.js';
connetToDatabase();
const app=express()
app.use(express.json())
app.use(cors());
app.use(express.static('public/uploads'))

app.use('/api/auth',authRoute);
app.use('/api/department',departmentRoute);
app.use('/api/employee',employeeRoute);

app.use('/api/salary',salaryRoute)
app.use('/api/leave',leaveRoute)
app.use('/api/query',queryRoute)

app.listen(process.env.PORT,()=>{
    console.log(`server is running at ${process.env.PORT}`)
})