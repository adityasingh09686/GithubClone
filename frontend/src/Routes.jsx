import { useEffect } from "react";
import {useNavigate,useRoutes} from 'react-router-dom';
import { useAuth } from "./authContext";

// Pages List
import Dashboard from "./components/dashboard/Dashboard"
import Overview from "./components/dashboard/Overview";
import Profile from "./components/user/Profile";
import Repositories from "./components/dashboard/Repositories";
import Issues from "./components/dashboard/Issues";
import Settings from "./components/dashboard/Settings";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

const ProjectRoute = () =>{
    const {currentUser,setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdfromStorage = localStorage.getItem("userId")
        if(userIdfromStorage && !currentUser){
            setCurrentUser(userIdfromStorage);
        }
        
        if(!userIdfromStorage && !["/auth", "/signup"].includes(window.location.pathname)){
            navigate("/auth");
        }

        if(userIdfromStorage && ["/auth", "/signup"].includes(window.location.pathname)){
            navigate("/");
        }
    },[currentUser,setCurrentUser,navigate])

    const element = useRoutes([
        {
            path: "/auth",
            element: currentUser ? <Dashboard /> : <Login />
        },
        {
            path: "/signup",
            element: currentUser ? <Dashboard /> : <Signup />
        },
        {
            path: "/",
            element: currentUser ? <Dashboard /> : <Login />,
            children: [
                {
                    path: "/",
                    element: <Overview />
                },
                {
                    path: "profile",
                    element: <Profile />
                },
                {
                    path: "repositories",
                    element: <Repositories />
                },
                {
                    path: "issues",
                    element: <Issues />
                },
                {
                    path: "settings",
                    element: <Settings />
                },
                {
                    path: "*",
                    element: <Overview />
                }
            ]
        }
    ])

    return element;
}

export default ProjectRoute;










