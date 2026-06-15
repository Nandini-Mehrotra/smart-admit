import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // If there is no user in our global memory, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user exists, render whatever page they were trying to go to
  return children;
}