    import express from 'express';
    import verifyUser from '../middleware/authMiddleware.js';
    import { addEmployee,upload,getEmployees,getEmployee,updateEmployee,fetchEmployeeByDepId} from '../controllers/employeeController.js';

    const route=express.Router()
    route.get('/',verifyUser,getEmployees);
    route.post('/add',verifyUser,upload.single('image'),addEmployee);
    route.get('/:id',verifyUser,getEmployee);
    route.put('/:id',verifyUser,updateEmployee);
    route.get('/department/:id',verifyUser,fetchEmployeeByDepId);

  

    export default route;