import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../actions/postAction'

function RegisterCom() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
});
  const dispatch=useDispatch()
  const navigate=useNavigate()
 const handleSubmit = async (evt) => {
    evt.preventDefault();

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
        navigate("/posts");
    } else {
        alert(result.payload?.message || "Registration failed");
    }
};
  const handleChange=(e)=>{
    setFormData((prevData)=>({
      ...prevData,
      [e.target.name]:e.target.value

    }))

  }
  return (
    <div>
        <h1>Registeration Page </h1>
         <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Business Connect</h1>
                

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>UserName</label>
                         <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                         </div>
                        <div className="input-group">
                          <label>Name</label>
                         <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        </div>
                          
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
                        Register
                    </button>
                </form>
            </div>
        </div>
      
    </div>
  )
}

export default RegisterCom
