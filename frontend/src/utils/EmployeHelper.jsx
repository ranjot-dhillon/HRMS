import axios from "axios";
import { useNavigate } from "react-router-dom";


export const columns = [
  
  {
    name: "S No.",
    selector: (row) => row.sno,
    width:'70px'
  
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width:'90px'
   
  },
  {
    name: "name",
    selector: (row) => row.name,
    sortable:true,
    width:'200px'
    
  },
   {
    name: "Department",
    selector: (row) => row.dep_name,
    width:'120px'
   
  },
   {
    name: "DOB",
    selector: (row) => row.dob,
    width:'130px'
   
  },
  {
    name: "Action",
    selector:(row)=>row.action,
   center:"true"
  },
];

export const fetchDepartment= async ()=>{
    let departments;
 try {
        const response = await axios.get(
          "http://localhost:3000/api/department",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // console.log("Fetched departments:", response.data.departments);
        if (response.data.success) {
            departments=response.data.departments;
         
        }
      } catch (error) {
        if (error.response) alert(error.response.data.error);
      } 
      return departments;   
      
}

// Employee for slary 

export const getEmployees= async (id)=>{
    let employees;
 try {
        const response = await axios.get(
          `http://localhost:3000/api/employee/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetched response:", response);
        if (response.data.success) {
            employees=response.data.employees;
         
        }
      } catch (error) {
        if (error.response) alert(error.response.data.error);
      } 
      return employees;   
      
}




      export const EmployeetButtons = ({Id}) => {
        const navigate = useNavigate();
        return (
          <div className="flex space-x-3">
            <button className='py-2 px-1 bg-yellow-600 text-black'onClick={() => navigate(`/admin-dashboard/employee/${Id}`)}>
              view
            </button>
            <button className='py-2 px-1 bg-green-600 text-black' onClick={() => navigate(`/admin-dashboard/employee/edit/${Id}`)} >Edit</button>
            <button className='py-2 px-1 bg-blue-600 text-black' onClick={() =>  navigate(`/admin-dashboard/employee/salary/${Id}`)} >Salary</button>
            <button className='py-2 px-1 bg-red-600 text-black' onClick={() => handleDelete(_id)} >Leaves</button>
          </div>
        );
      };