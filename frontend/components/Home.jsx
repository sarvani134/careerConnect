import React from "react";
import "../public/home.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <>
           
            <section className="hero">

                <div className="hero-left">

                    <p className="hero-tag">
                        PROFESSIONAL NETWORKING PLATFORM
                    </p>

                    <h1>
                        Build Your <span>Professional Network</span>
                    </h1>

                    <p className="hero-description">
                        Connect with professionals, discover career
                        opportunities, showcase your skills, and build
                        meaningful business relationships with BusinessConnect.
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="login-btn"
                            onClick={() => navigate("/users/login")}
                        >
                            Login
                        </button>

                        <button
                            className="register-btn"
                            onClick={() => navigate("/users/register")}
                        >
                            Join Now
                        </button>

                    </div>

                </div>

                <div className="hero-right">
                    <img
                        src="/networking.png"
                        alt="Business Networking"
                    />
                </div>

            </section>
        </>
    );
}

export default Home;