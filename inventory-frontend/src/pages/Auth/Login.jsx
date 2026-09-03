import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@stockroom.app");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>Welcome back</h2>
      <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--ink-soft)" }}>
        Sign in to manage your stock.
      </p>

      <Input label="Email" type="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input label="Password" type="password" icon={Lock} value={password} onChange={(e) => setPassword(e.target.value)} required />

      {error && <div style={{ fontSize: 12.5, color: "var(--red)", marginBottom: 12 }}>{error}</div>}

      <Button type="submit" variant="accent" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: "10px 0" }}>
        {busy ? "Signing in..." : "Sign in"}
      </Button>

      <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 16, textAlign: "center" }}>
        Demo credentials are pre-filled. Don't have an account?{" "}
        <Link to="/auth/register" style={{ color: "var(--teal)", fontWeight: 600 }}>Register</Link>
      </div>
    </form>
  );
}
