/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(localStorage.getItem("userId") || null);

    const value = {
        currentUser,setCurrentUser
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}








