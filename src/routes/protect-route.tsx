import { AppLayout } from "@/layouts/layout";
import { useGetMe } from "@/services/me";

import { Outlet, Navigate } from "react-router-dom";

export function ProtectedRoute() {
  const token = localStorage.getItem("token"); // Retrieve token from local storage
  const { data, isError, isFetched } = useGetMe();

  if (!token) {
    return <Navigate to={"/login"} />; // If no token, redirect to login page
  }

  if (isFetched) {
    if (isError) return <Navigate to={"/login"} />; // If error fetching user data, redirect to login page

    // Now use the `data` object if you need to access user information
    console.log("User data:", data); // For debugging or displaying user information

    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    );
  }


}
