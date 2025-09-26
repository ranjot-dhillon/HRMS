import Task from "../models/TaskReminder.js";
const addTask = async (req, res) => {
  try {
    const { name, startDate, deadline } = req.body.newTask;
    const userId = req.user._id;
    if (!name || !startDate || !deadline) {
      return res
        .status(400)
        .json({ error: "name, startDate and deadline are required" });
    }

    const s = new Date(startDate);
    const d = new Date(deadline);
    if (isNaN(s.getTime()) || isNaN(d.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    if (d < s) {
      return res
        .status(400)
        .json({ error: "deadline must be after startDate" });
    }

    const task = new Task({
      userId: userId,
      name: name.trim(),
      startDate: s,
      deadline: d,
    });

    const saved = await task.save();
    // toJSON includes virtual id
    return res.status(201).json(saved.toJSON());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getTask = async (req, res) => {

  try {
    
    const userId = req.body.Id;
    console.log("ID",userId)
    const tasks = await Task.find({userId:userId});
    // console.log(tasks)
    return res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "completed" } // or boolean `completed: true`
    );
    return res.status(200).json({ success: true, task: updatedTask });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export { getTask, addTask, deleteTask, completeTask };
