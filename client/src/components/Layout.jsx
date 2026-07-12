import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROLE_LABELS, useAuth } from "../context/AuthContext";

export const PAGE_ACCESS = {
  dashboard: Object.keys(ROLE_LABELS),
  vehicles: ["fleet_manager", "driver"],
  drivers: ["fleet_manager", "safety_officer"],
  trips: ["fleet_manager", "driver"],
  maintenance: ["fleet_manager"],
  expenses: ["fleet_manager", "driver", "financial_analyst"],
  reports: ["fleet_manager", "financial_analyst", "safety_officer"],
};

const NAV = [
  { to: "/", label: "Dashboard", page: "dashboard" },
  { to: "/vehicles", label: "Vehicles", page: "vehicles" },
  { to: "/drivers", label: "Drivers", page: "drivers" },
  { to: "/trips", label: "Trips", page: "trips" },
  { to: "/maintenance", label: "Maintenance", page: "maintenance" },
  { to: "/expenses", label: "Fuel & Expenses", page: "expenses" },
  { to: "/reports", label: "Reports", page: "reports" },
];

export default function Layout({ page, children }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role;
  const allowed = !page || (PAGE_ACCESS[page] || Object.keys(ROLE_LABELS)).includes(role);
  const visibleNav = NAV.filter((n) => (PAGE_ACCESS[n.page] || Object.keys(ROLE_LABELS)).includes(role));

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <Link to="/" className="brand">
            <span className="brand-icon">🚚</span>
            <span>
              <span className="brand-title">TransitOps</span>
              <span className="brand-subtitle">Fleet Management</span>
            </span>
          </Link>
          <nav className="app-nav">
            {visibleNav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`nav-link ${location.pathname === n.to ? "nav-link-active" : ""}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="app-header-right">
            <span className="role-pill">{ROLE_LABELS[role]}</span>
            <button className="signout-btn" onClick={handleSignOut}>
              ⎋ Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        {allowed ? (
          children
        ) : (
          <div className="access-restricted">
            <h1>Access restricted</h1>
            <p className="muted">Your role ({ROLE_LABELS[role]}) doesn't have access to this module.</p>
          </div>
        )}
      </main>
    </div>
  );
}
