    import express from 'express';
    import verifyUser from '../middleware/authMiddleware.js';
import { addSalary,getSalary} from '../controllers/salaryController.js';

    const route=express.Router()
   
    route.post('/add',verifyUser,addSalary);
    route.get('/:id',verifyUser,getSalary);
    

    export default route;