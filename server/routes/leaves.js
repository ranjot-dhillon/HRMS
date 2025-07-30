    import express from 'express';
    import verifyUser from '../middleware/authMiddleware.js';
  import { addLeave,getAllLeaves,getLeaves,handleResponse } from '../controllers/leaveController.js';

    const route=express.Router()
   
    route.post('/add',verifyUser,addLeave);
    route.get('/appliedLeaves',verifyUser,getAllLeaves);
    route.get('/:id',verifyUser,getLeaves);
    route.put('/responseLeave/:id',verifyUser,handleResponse);
    
    

    export default route;