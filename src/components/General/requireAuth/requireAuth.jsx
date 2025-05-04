// RequireAuth.jsx
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../database/firebase"; // adjust path to your firebase setup

const RequireAuth = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/" replace />;
    
    return children;
};

export default RequireAuth;
