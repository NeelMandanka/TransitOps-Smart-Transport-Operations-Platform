import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ROLE_LABELS } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { Button, Field, Input, Select } from "../components/UI";

export default function Auth() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("fleet_manager");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(fullName, email, password, role);
      }
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card-wrap">
        <div className="brand auth-brand">
          <span className="brand-icon">🚚</span>
          <span>
            <span className="brand-title">TransitOps</span>
            <span className="brand-subtitle">Smart Transport Operations</span>
          </span>
        </div>
        <div className="card auth-card">
          <h1>{mode === "login" ? "Sign in" : "Create your account"}</h1>
          <p className="muted">
            {mode === "login"
              ? "Access your fleet operations console."
              : "Pick your role to get a tailored workspace."}
          </p>
          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && (
              <>
                <Field label="Full name">
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Fernandes"
                    required
                  />
                </Field>
                <Field label="Role">
                  <Select value={role} onChange={(e) => setRole(e.target.value)}>
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </>
            )}
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </Field>
            <Button type="submit" disabled={busy} className="full-width">
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <button className="link-btn" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
