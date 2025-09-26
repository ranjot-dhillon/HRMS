// Salaries.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // import the plugin as a function
import { Link } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa";

const Salaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [newQueryCount, setNewQueryCount] = useState(0);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/Salary", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) setSalaries(response.data.salaries || []);
    } catch (err) {
      console.error("fetchSalaries error:", err);
    }
  };

  const fetchQueryCount = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/query/newCount", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) setNewQueryCount(res.data.count || 0);
    } catch (err) {
      console.error("fetchQueryCount error:", err);
    }
  };

  useEffect(() => {
    fetchSalaries();
    fetchQueryCount();
  }, []);

  // helper to convert an image url to base64 (for doc.addImage)
  const getBase64ImageFromUrl = async (imageUrl) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Could not load image:", err);
      return null;
    }
  };

  const runPayroll = async () => {
    try {
      await axios.post("http://localhost:3000/api/salary/runPayroll", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Payroll processed successfully!");
      fetchSalaries();
    } catch (err) {
      console.error("runPayroll error:", err);
      alert("Failed to run payroll");
    }
  };

  const downloadPDF = async () => {
    try {
      // Check that autoTable is available
      if (typeof autoTable !== "function") {
        console.error("autoTable is not a function", autoTable);
        alert("PDF plugin not loaded correctly. Check console.");
        return;
      }

      const doc = new jsPDF("p", "pt", "a4"); // points, portrait, A4

      // Try to include logo (put logo file in public folder, e.g. /logo.png)
      const logoData = await getBase64ImageFromUrl("/logo.png").catch(() => null);
      if (logoData) {
        // doc.addImage(logoData, "PNG", 40, 20, 60, 60); // x, y, w, h
      }

      // header text
      doc.setFontSize(16);
      doc.text("Company Name", 120, 40);
      doc.setFontSize(12);
      doc.text(`Salary Details Report`, 120, 60);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 120, 76);

      // table columns
      const tableColumn = [
        "Sno",
        "EmployeeId",
        "Month",
        "Total",
        "Status",
        "Paid On",
        "Bank Acc",
        "IFSC",
        "Bank Name",
      ];

      // table body
      const tableRows = salaries.map((salary, index) => [
        index + 1,
        salary.employeeId?.employeeId || salary.employeeId?._id || "N/A",
        salary.month || "N/A",
        salary.total ?? "N/A",
        salary.status || "N/A",
        salary.paidOn ? new Date(salary.paidOn).toLocaleDateString() : (salary.paidDate ? new Date(salary.paidDate).toLocaleDateString() : "N/A"),
        salary.employeeId?.bankDetails?.accountNumber || "N/A",
        salary.employeeId?.bankDetails?.ifscCode || "N/A",
        salary.employeeId?.bankDetails?.bankName || "N/A",
      ]);

      // call the plugin function with doc first (safe for ESM/CJS)
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 110,
        theme: "grid",
        headStyles: { fillColor: [33, 150, 243], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 4 },
        // color the Status column based on value
        didParseCell: (data) => {
          // status is at column index 4 (see tableColumn)
          if (data.column.index === 4 && data.cell && data.cell.raw) {
            const raw = String(data.cell.raw).toLowerCase();
            if (raw === "paid") {
              data.cell.styles.textColor = [0, 128, 0]; // green
            } else if (raw === "unpaid" || raw === "pending") {
              data.cell.styles.textColor = [200, 0, 0]; // red
            }
          }
        },
      });

      doc.save("Salary_Report.pdf");
    } catch (err) {
      console.error("downloadPDF error:", err);
      alert("Failed to generate PDF — check console for details.");
    }
  };

  return (
    <div className="bg-white rounded shadow p-5 m-8">
      <h3 className="text-3xl text-center font-semibold mb-4">Salaries</h3>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Filter By status"
          className="px-4 py-1 border rounded"
        />
        <div className="flex gap-3">
          <button
            onClick={runPayroll}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Run Payroll
          </button>
          <button
            onClick={downloadPDF}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Download PDF
          </button>
          <Link
            to="/admin-dashboard/viewQuery"
            className="relative flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-full"
          >
            <FaQuestionCircle />
            Queries
            {newQueryCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full text-xs px-2">
                {newQueryCount}
              </span>
            )}
          </Link>
          <Link
            to="/admin-dashboard/salary/add"
            className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Add Salary Details
          </Link>
        </div>
      </div>

      <table className="w-full table-auto text-sm mt-2 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Sno</th>
            <th className="p-2">EmployeeId</th>
            <th className="p-2">Month</th>
            <th className="p-2">Total</th>
            <th className="p-2">PaidOn</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((salary, index) => (
            <tr key={index} className="text-center border-t">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{salary.employeeId?.employeeId || "N/A"}</td>
              <td className="p-2">{salary.month}</td>
              <td className="p-2">{salary.total}</td>
              <td className="p-2">{salary.paidOn ? new Date(salary.paidOn).toLocaleDateString() : "N/A"}</td>
              <td className={`p-2 font-medium ${salary.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                {salary.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Salaries;
