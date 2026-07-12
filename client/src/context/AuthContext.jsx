import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

export const ROLE_LABELS = {
  fleet_manager: "Fleet Manager",
  driver: "Driver",
  safety_officer: "Safety Officer",
  financial_analyst: "Financial Analyst",
};

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("transitops_token"));
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    api
      .get("/auth/me", token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("transitops_token");
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const login = async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem("transitops_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (fullName, email, password, role) => {
    const data = await api.post("/auth/register", { fullName, email, password, role });
    localStorage.setItem("transitops_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const signOut = () => {
    localStorage.removeItem("transitops_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
