import { createContext, useState, useEffect } from "react";

// 1. Create the Context
export const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if a user is already logged in when the app first loads
  useEffect(() => {
    const storedUser = localStorage.getItem("smartAdmitUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function: Saves user data and token to local storage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("smartAdmitUser", JSON.stringify(userData));
  };

  // Logout function: Clears the state and local storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartAdmitUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};