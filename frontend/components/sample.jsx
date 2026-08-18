import React, { useState } from "react";
import "../public/login.css";

function LoginCom() {
   let [formData,setFormData]=useState({
    password:"",
    email:""
   })
   const handleSubmit=(evt)=>{
    evt.preventDefault()

   }
   const handleChange=()=>{
    
   }

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Business Connect</h1>
                

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        className="login-btn"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginCom;