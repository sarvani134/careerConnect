import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "../store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Home from "../components/Home";
import LoginCom from "../components/LoginCom";
import RegisterCom from "../components/RegisterCom";
import App from "./App";
import Navbar from "../components/Navbar";
import AllPosts from "../components/AllPosts";
import Connections from "../components/Connections";
import ConnectionsSent from "../components/ConnectionsSent";
import Logout from "../components/Logout";
import Profile from "../components/Profile";
import HomeDirect from "../components/HomeDirect";
import CreatePost from "../components/CreatePost";
import ConnectionPage from "../components/ConnectionPage";
import MessagePage from "../components/MessagePage";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomeDirect />,
            },
            {
                path: "users/login",
                element: <LoginCom />,
            },
            {
                path: "users/register",
                element: <RegisterCom />,
            },
            {
                path:"posts",
                element:<AllPosts/>
            },
            {
                path: "connections",
                element: <Connections />
            },
            {
                path: "connections/sent",
                element: <ConnectionsSent />
            },
            {
                path: "users/displayProfile",
                element: <Profile />
            },
            {
                path:"posts/createPost",
                element:<CreatePost/>
            },
            {
                path:"users/connectionPage",
                element:<ConnectionPage/>
            },
             {
                path:"messages/messagePage",
                element:<MessagePage/>
            }
           
          
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Provider>
    </StrictMode>
);
