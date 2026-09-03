import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>Create an account</h2>
      <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--ink-soft)" }}>
        Set up access to the stockroom.
      </p>

      <Input label="Full name" icon={User} value={form.name} onChange={(e) => set("name", e.target.value)} required />
      <Input label="Email" type="email" icon={Mail} value={form.email} onChange={(e) => set("email", e.target.value)} required />
      <Input label="Password" type="password" icon={Lock} value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={6} />

      {error && <div style={{ fontSize: 12.5, color: "var(--red)", marginBottom: 12 }}>{error}</div>}

      <Button type="submit" variant="accent" disabled={busy} style={{ width: "100%", justifyContent: "center", padding: "10px 0" }}>
        {busy ? "Creating account..." : "Create account"}
      </Button>

      <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 16, textAlign: "center" }}>
        Already have an account?{" "}
        <Link to="/auth/login" style={{ color: "var(--teal)", fontWeight: 600 }}>Sign in</Link>
      </div>
    </form>
  );
}
