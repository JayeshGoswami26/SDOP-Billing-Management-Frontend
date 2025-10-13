/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const RedirectRoot = () => {
  const user = useSelector((state: any) => state.auth.user);

  if (user && user.role) {
    const dashboardPath = `/dashboard`;
    return <Navigate to={dashboardPath} replace />;
  }
  // return <Navigate to="/login" replace />;
  return <Navigate to="/dashboard" replace />;
};
