import express from 'express'
import {getStats,getHolidays,getCounts} from '../controllers/adminController.js'
import { createPoll,latestPoll,submitPoll,deletePoll } from '../controllers/pollController.js'
import { addAnnouncement, getAnnouncements } from '../controllers/announcementController.js'
const router=express.Router()

router.get("/stats",getStats)
router.get("/holidays",getHolidays)
router.get("/counts",getCounts)
router.get("/poll/latest",latestPoll)
router.delete("/deletePoll/:pollId",deletePoll)
router.put("/submitPoll/:pollId",submitPoll)
router.post("/poll",createPoll)
router.post("/postAnnouncements",addAnnouncement)
router.get("/getAnnouncements",getAnnouncements)


export default router