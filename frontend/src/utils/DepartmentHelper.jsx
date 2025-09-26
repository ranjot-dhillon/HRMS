import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
export const columns = [
  {
    name: "S No.",
    selector: (row) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
  },
  {
    name: "Action",
    cell: (row) => <DepartmentButtons _id={row._id} />,
    ignoreRowClick: true,
  },
];

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate();
  const handleDelete = async (id) => {
    const confirm = window.confirm("Do you really want to delete");
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // console.log("Fetched departments:", response.data.department);
        if (response.data.success) {
          onDepartmentDelete(id);
        }
      } catch (error) {
        if (error.response) alert(error.response.data.error);
      }
    }
  };
  return (
    <div>
      <button onClick={() => navigate(`/admin-dashboard/department/${_id}`)}>
        Edit
      </button>
      <button onClick={() => handleDelete(_id)}>Delete</button>
    </div>
  );
};
