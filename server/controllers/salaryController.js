import MonthlySalary from "../models/MonthlySalarySchema.js";
// import MonthlySalarySchema from "../models/MonthlySalarySchema.js";
import Salary from "../models/Salary.js";
const addSalary = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, effectiveFrom } =
      req.body;
    const netSalary =
      Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

    const newSalary = new Salary({
      employeeId,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      effectiveFrom,
    });
    newSalary.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error: "in adding salary" });
  }
};

const getSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.find({ employeeId: id }).populate(
      "employeeId",
      "employeeId"
    );
    console.log("Salaries:", salary);
    return res.status(200).json({ success: true, salary });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "salary get server error" });
  }
};

const getSalaries = async (req, res) => {
  try {
    const salaries = await MonthlySalary.find().populate(
      "employeeId",
      "employeeId name"
    );
    return res.status(200).json({ success: true, salaries });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get department server error" });
  }
};

export { addSalary, getSalary, getSalaries };
