
import "../public/Navbar.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../actions/postAction";

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.authReducer.token);

   const handleLogout = async () => {
        await dispatch(logoutUser(token));
        navigate("/users/login", { replace: true });
    };

    return (
        <nav className="navbar">
            <div
                className="navbar-logo"
                onClick={() => navigate("/")}
            >
                <div className="logo-box">BC</div>

                <h2 className="logo-text">
                    Business<span>Connect</span>
                </h2>
            </div>

            <ul className="navbar-links">
                <li onClick={() => navigate("/")}>
                    Home
                </li>

                {token==null && (<li onClick={() => navigate("/users/login")}>
                    Login
                </li>)}
                {token!=null &&(<li onClick={()=>handleLogout()}>
                    Logout
                </li>)}

               {token==null &&( <li onClick={() => navigate("/users/register")}>
                    Register
                </li>)}

                <li onClick={() => navigate("/users/connectionPage")}>
                    Connections
                </li>

               
                 <li onClick={() => navigate("/users/displayProfile")}>
                    Profile
                </li>
                
            </ul>
        </nav>
    );
}

export default Navbar;
