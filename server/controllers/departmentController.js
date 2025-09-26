import Department from "../models/Department.js";

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get department server error" });
  }
};

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const newDep = new Department({
      dep_name,
      description,
    });
    await newDep.save();
    return res.status(200).json({ success: true, department: newDep });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "add department error" });
  }
};
export { addDepartment };
export const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById({ _id: id });
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get department server error" });
  }
};
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const updepartment = await Department.findByIdAndUpdate(
      { _id: id },
      {
        dep_name,
        description,
      },
      { new: true }
    );
    return res.status(200).json({ success: true, updepartment });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "update department server error" });
  }
};
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedepartment = await Department.findByIdAndDelete({ _id: id });
    return res.status(200).json({ success: true, deletedepartment });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "update department server error" });
  }
};
