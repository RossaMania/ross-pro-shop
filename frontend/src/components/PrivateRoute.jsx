import React from 'react'
import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

//This component is for routes or pages that require the user to register for an account, and be logged in. 
//We don't want regular users to be able to access these pages.
const PrivateRoute = () => {

  // We need to get the userInfo from the auth state with useSelector.
  const { userInfo } = useSelector((state) => state.auth);

  // If there is userInfo in localStorage, that means the user is logged in, and we render the Outlet component.
  // If there is no userInfo in localStorage, that means the user is not logged in, and we redirect to the /login page.
  // We use the Navigate component from react-router-dom to redirect to the /login page.
  // We use the replace prop to replace any past history.
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute