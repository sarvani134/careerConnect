import React, { useEffect, useState } from "react";
import "../public/login.css";
import { loginUser } from "../actions/postAction";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function LoginCom() {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const isLoading = useSelector((state) => state.authReducer.isLoading);
    const [formData, setFormData] = useState({
        email: "demo@businessconnect.app",
        password: "Demo@123",
    });
    const [flashMessage, setFlashMessage] = useState("");

    useEffect(() => {
        if (!flashMessage) return;

        const timer = setTimeout(() => setFlashMessage(""), 4000);
        return () => clearTimeout(timer);
    }, [flashMessage]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit =async (e) => {
        e.preventDefault();

        const result=await dispatch(loginUser(formData));
        if(loginUser.fulfilled.match(result)){
            navigate("/posts")
        } else {
            setFlashMessage(
                result.payload?.message || "Invalid email or password"
            );
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Business Connect</h1>

                {flashMessage && (
                    <div className="login-flash" role="alert">
                        {flashMessage}
                    </div>
                )}

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
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginCom;
