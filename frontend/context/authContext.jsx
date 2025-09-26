import axios from 'axios';
import React,{Children, createContext,useContext, useEffect, useState} from 'react'
import { BsEar } from 'react-icons/bs';

const userContext = createContext();
export const AuthContextProvider = ({children}) => {
    const [user,setUser]=useState("");
    const [loading,setloading]=useState(true)
  
    useEffect(()=>{
      const verifyUser=async()=>{
       
        try {
        const token = localStorage.getItem('token');
        console.log("Verifying token:", token);
        
      


           if(token){
          const response=await axios.get('http://localhost:3000/api/auth/verify',{ headers:{
            "Authorization": `Bearer ${token}`
          }})
          console.log(response.data.user)
          if(response.data.success)
          {
            setUser(response.data.user)
          }
           }
            else{
          setUser(null)
          setloading(false)
        }
        } 
       
        catch (error) {
          console.log(error)
          if(error.response&&!error.response.data.error){
            setUser(null)
          }
        }
        finally{
          setloading(false)
        }
      }
      verifyUser()
    },[])
    const login =(userdata)=>{
          setUser(userdata)

    }
    const logout=()=>{
      setUser(null)
      localStorage.removeItem("token")
    }
  return (
    <userContext.Provider value={{user,login,logout,loading}}>
        {children}
    </userContext.Provider>
  )
}
export const useAuth=()=>useContext(userContext);
// export default AuthContext;