import express from "express";
import verifyUser from "../middleware/authMiddleware.js";
import {
  addSalary,
  getSalary,
  getSalaries,
} from "../controllers/salaryController.js";
import { addSalaryDetail,runPayRoll,updateBankDetail } from "../controllers/SalaryHelper.js";

const route = express.Router();

route.post("/add", verifyUser, addSalary);
route.get("/:id", verifyUser, getSalary);
route.get("/", verifyUser, getSalaries);
route.put("/addBankDetail/:id",addSalaryDetail);
route.post("/runPayroll",verifyUser,runPayRoll);
route.put("/updatesalarydetail/:id",updateBankDetail);


export default route;
