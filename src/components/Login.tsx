import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🏦 CConnect</h1>
        <p>Bank Officer Daily Tracker</p>
        {error && <div className="error-msg">{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary" onClick={handleSubmit}>
          {isRegister ? "Create Account" : "Login"}
        </button>
        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem", color: "#718096" }}>
          {isRegister ? "Already have an account?" : "First time? Create account"}
          <span style={{ color: "#2b6cb0", cursor: "pointer", marginLeft: "0.5rem", fontWeight: 600 }} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}