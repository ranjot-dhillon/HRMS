import express from "express";
// import authMiddleware from '../middleware/authMiddleware.js';
import {
  markAllRead,
  notifications,
} from "../controllers/notificationController.js";

const route = express.Router();

// route.post('/login',login)
route.get("/:id", notifications);
route.patch("/:id/read-all", markAllRead);
// route.get('/verify',authMiddleware, verify);

export default route;
