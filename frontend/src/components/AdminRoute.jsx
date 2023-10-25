import React from 'react'
import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

//This component is for routes or pages that require the user to be logged in and be an admin.
//We don't want regular users to be able to access these pages.
const AdminRoute = () => {
  // We need to get the userInfo from the auth state with useSelector.
  const { userInfo } = useSelector((state) => state.auth);

  // If there is userInfo in localStorage, and the isAdmin key is set to the value of "true", that means the user is logged in and an admin user.
  // We render the Outlet component for the admin user.
  // If there is no userInfo in localStorage, that means the user is not logged in.
  // We redirect to the /login page using the Navigate component from react-router-dom
  // We use the replace prop to replace any past history.
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default AdminRoute