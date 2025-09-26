import Announcement from "../models/Announcement.js"

const addAnnouncement=async(req,res)=>{
    try {
    const {text } = req.body;

    const newAnnouncement = new Announcement({ message:text });
    await newAnnouncement.save();

    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {addAnnouncement,getAnnouncements}