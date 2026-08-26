import { useState } from "react";
import api from "../services/api";

function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isRegister) {
        await api.post("/auth/register", {
          username,
          email,
          password,
        });

        setMessage("Account created successfully. You can now log in.");

        setIsRegister(false);
        setUsername("");
        setPassword("");
      } else {
        const response = await api.post("/auth/login", {
          email,
          password,
        });

        localStorage.setItem(
          "token",
          response.data.access_token
        );

        window.location.reload();
      }
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          (isRegister ? "Registration failed" : "Login failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>JobTracker</h1>

        <h2>{isRegister ? "Create Account" : "Login"}</h2>

        {error && <p className="error">{error}</p>}

        {message && <p className="success">{message}</p>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label>Username</label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
          )}

          {isRegister && <br />}

          <div>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <br />

          <div>
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? isRegister
                ? "Creating account..."
                : "Logging in..."
              : isRegister
                ? "Register"
                : "Login"}
          </button>
        </form>

        <button
          type="button"
          className="switch-button"
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setMessage("");
            setUsername("");
            setEmail("");
            setPassword("");
          }}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}

export default Login;
