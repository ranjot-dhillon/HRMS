// salaryCron.js
import cron from 'node-cron';
import Salary from '../models/Salary.js';
import MonthlySalary from '../models/MonthlySalarySchema.js';
import mongoose from 'mongoose';
import { deleteOldLeaves } from '../controllers/leaveController.js';
// Get current month in YYYY-MM format
const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};


cron.schedule('0 0 * * *', async () => {
  await deleteOldLeaves({ }, { status: () => ({ json: () => {} }) }); // dummy req/res
});

// Cron Job: Runs at 00:00 on 1st of every month
const startSalaryGenerationJob = () => {
  cron.schedule('0 0 1 * *', async () => {
    console.log('⏳ Generating Monthly Salaries...');

    const monthKey = getCurrentMonthKey();

    try {
      const employeeSalaries = await Salary.find();

      for (const emp of employeeSalaries) {
        const alreadyExists = await MonthlySalary.findOne({
          employeeId: emp.employeeId,
          month: monthKey,
        });

        if (!alreadyExists) {
          await MonthlySalary.create({
            employeeId: emp.employeeId,
            month: monthKey,
            total: emp.netSalary,
            status: 'Unpaid',
          });

          console.log(`✅ Salary record added for ${emp.employeeId} for ${monthKey}`);
        } else {
          console.log(`⚠️ Salary already exists for ${emp.employeeId} for ${monthKey}`);
        }
      }

      console.log('✅ Monthly salary generation complete.');
    } catch (err) {
      console.error('❌ Error generating salaries:', err);
    }
  });
};

export default startSalaryGenerationJob;


// // runJulySalary.js
// import Salary from '../models/Salary.js';
// import MonthlySalary from '../models/MonthlySalarySchema.js';
// import mongoose from 'mongoose';

// const MONGO_URI = "mongodb+srv://Ranjotdhillon:Ranjotdhillon@cluster0.jbo3b.mongodb.net/HRMS";

// const startSalaryGenerationJob = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log('🟢 Connected to DB');

//     const monthKey = "2025-07";

//     const employeeSalaries = await Salary.find();

//     for (const emp of employeeSalaries) {
//       const alreadyExists = await MonthlySalary.findOne({
//         employeeId: emp.employeeId,
//         month: monthKey,
//       });

//       if (!alreadyExists) {
//         await MonthlySalary.create({
//           employeeId: emp.employeeId,
//           month: monthKey,
//           total: emp.netSalary,
//           status: 'Unpaid',
//         });

//         console.log(`✅ July salary created for ${emp.employeeId}`);
//       } else {
//         console.log(`⚠️ July salary already exists for ${emp.employeeId}`);
//       }
//     }

//     console.log('🎉 Done generating July salaries!');
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Error:', err);
//     process.exit(1);
//   }
// };
// startSalaryGenerationJob();

// export default startSalaryGenerationJob


