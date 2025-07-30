    import express from 'express';
    import verifyUser from '../middleware/authMiddleware.js';
import { addSalary,getSalary,getSalaries} from '../controllers/salaryController.js';

    const route=express.Router()
   
    route.post('/add',verifyUser,addSalary);
    route.get('/:id',verifyUser,getSalary);
    route.get("/",verifyUser,getSalaries);
    

    export default route;