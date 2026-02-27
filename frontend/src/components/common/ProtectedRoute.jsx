import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Loader from "./Loader";

function ProtectedRoute({ redirectTo = "/login", children }) {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) return <Loader text="Checking session..." />;
    if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

    return children || <Outlet />;
}

export default ProtectedRoute;
