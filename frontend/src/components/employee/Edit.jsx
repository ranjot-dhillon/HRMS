import React, { useEffect, useState } from 'react'
import { fetchDepartment } from '../../utils/EmployeHelper';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Edit() {
  const [department,setdepartment]=useState([]);
  const [employee,setEmployee]=useState({
    name:'',
    maritalStatus:'',
    designation:'',
    salary:0,
    department:'',

  })
  const {id}=useParams();
    const navigate=useNavigate()
    useEffect(()=>{
    const getDeprtment=async ()=>{
      const department= await fetchDepartment()
    setdepartment(department)
    }
    getDeprtment()
  
    },[])

  
  useEffect(()=>{
  const fetchEmployee = async () => {
       
        try {
          const response = await axios.get(
            `http://localhost:3000/api/employee/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("Fetched departments:", response.data.employee);
          if (response.data.success) {
            const employee=response.data.employee;

            setEmployee((prev)=>({...prev,name:employee.userId.name, maritalStatus:employee.maritalStatus,
    designation:employee.designation,
    salary:employee.salary,
    department:employee.department,}));
          }
        } catch (error) {
          if (error.response) alert(error.response.data.error);
        } 
      };
      fetchEmployee();
    }, []);

  const handlechange=(e)=>{
    const {name,value}=e.target;
 
      setEmployee((prevData)=>({...prevData,[name]:value}))
    
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();
    console.log("Submitting data:", employee);

     try {
      const response = await axios.put(
        `http://localhost:3000/api/employee/${id}`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        navigate("/admin-dashboard/employee");
      }
    } catch (error) {
     

      if (error.response && !error.response.data.error) {
        console.log(error.message)
       
        alert(error.response.data.error);
      }
    }
  }
 

  return (
    <>{department&&employee?(
    <div className='max-w-4xl mx-auto mt-5 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Add Employee</h2>
         <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
            <label className='block text-sm font-medium text-gray-700 '> Name</label>
            <input type='text'name='name'placeholder='Insert Name'value={employee.name}onChange={handlechange}className='mt-1 p-2 block w-full border border-gray-300 rounded-md'/>
            </div>
            
          
             <div>
            <label className='block text-sm font-medium text-gray-700'> Marital Status</label>
            <select name='maritalStatus'value={employee.maritalStatus}placeholder='Marital status'onChange={handlechange}className='mt-1 p-2 block w-full border border-gray-300 rounded-md'>
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
      
              </select>
            </div>
              <div>
            <label className='block text-sm font-medium text-gray-700'>Designation</label>
            <input type='text'name='designation'value={employee.designation}placeholder='Designation'onChange={handlechange}className='mt-1 p-2 block w-full border border-gray-300 rounded-md'/>
            </div>
             

              <div>
            <label className='block text-sm font-medium text-gray-700'>Salary</label>
            <input type='number'name='salary'value={employee.salary}placeholder='Salary'onChange={handlechange}className='mt-1 p-2 block w-full border border-gray-300 rounded-md'/>
            </div>


           
              <div className='col-span-2'>
            <label className='block text-sm font-medium text-gray-700'>Department</label>
            <select name='department'placeholder='Department'onChange={handlechange}className='mt-1 p-2 block w-full border border-gray-300 rounded-md'>
              <option value="">Select Department</option>
              {department.map(dep=>(
                <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
              ))}
              </select>
            </div>
      
            <button type='submit' className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md'>Edit Employee</button>






          </div>
         </form>
    </div>
    ):<div>LoaderFunctionArgs..</div>}
    </>
  )
}

export default Edit