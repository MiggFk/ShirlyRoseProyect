import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
