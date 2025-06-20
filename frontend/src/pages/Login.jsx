import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
const Login = () => {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(null);
  const [email,setemail]=useState("");
  const [password,setpassword]=useState("");
  // const [error,setError]=useState("");
  const navigate=useNavigate()
  const {login}=useAuth()
   
  function generateCaptcha() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
  }

  const handlesubmit = async (e) => {
    e.preventDefault();

    // if (userInput === captcha) {
    //   setError("");
    //   alert("CAPTCHA verification passed! Logging in...");
    // } else {
    //   setError("Invalid CAPTCHA. Please try again.");
    //   setCaptcha(generateCaptcha());
    //   setUserInput("");
    // }
    try {
        const response= await axios.post("http://localhost:3000/api/auth/login",{email,password})
        console.log("Login response:", response.data)

       if (response.data.success && response.data.token) {
             login(response.data.user);
             console.log("Generated token:", response.data.token);  // Make sure this is not 'true' or undefined

             localStorage.setItem("token", response.data.token);
          if(response.data.user.role=="admin"){
            navigate('/admin-dashboard')
          }
          else{
            navigate('/employee-dashboard')
          }

        }
    } catch (error) {
        console.log(error)
        if(error.response&&!error.response.data.success)
        {
          setError(error.response.data.error)
        }
        else{
          setError("server error")
        }
        
    }
  };

  return (
    <div className="login-container">
      
         <h4>Human Resource Management System</h4>
      <h4>Welcome</h4>
      <form onSubmit={handlesubmit}>
        {/* {error&&<p className="text-red-500">{error}</p>} */}
        <div className="input-group">
          <input type="email" placeholder="Email" required  onChange={(e) => setemail(e.target.value)}/>
        </div>
        <div className="input-group">
          <input type="password" placeholder="Password" required  onChange={(e) => setpassword(e.target.value)}/>
        </div>
        <div className="captcha-group">
          <div className="captcha-text">{captcha}</div>
          <input
            type="text"
            placeholder="Enter CAPTCHA"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      <div className="forgot-password">
        <a href="#">Forgot Password?</a>
      </div>
      <div className="register-link">
        <p>
          Don't have an account? <a href="#">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;