import express from "express";
import {
  addQuery,
  getAllQueries,
  resolveQuery,
  getResolvedQueries,
  deleteQuery,
  deletePendingQuery,
  getQueryCount,
} from "../controllers/queryController.js";
import verifyUser from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", verifyUser, addQuery); // Employee submits query
router.get("/", verifyUser, getAllQueries); // Admin views all queries
router.get("/newCount", verifyUser, getQueryCount); // Admin views all queries
router.get("/resolvedQuery/:id", verifyUser, getResolvedQueries); // Admin views all queries
router.put("/:id", verifyUser, resolveQuery); // Admin responds
router.delete("/deleteQuery/:id", verifyUser, deleteQuery); // Admin responds
router.delete("/deletePendingQuery/:id", verifyUser, deletePendingQuery); // Admin responds

export default router;
