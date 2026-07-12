import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (user === undefined) {
    return (
      <div className="loading-screen">
        <span className="brand-icon">🚚</span>
        <span>Loading TransitOps…</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return children;
}
