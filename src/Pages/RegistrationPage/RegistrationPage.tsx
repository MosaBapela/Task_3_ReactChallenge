import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrationPage.css";
import { useAuth } from "../../Context/AuthContext";

const RegistrationPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = auth.register(username, password);
    if (success) {
      navigate("/home");
    } else {
      setError("Username already exists. Please choose another one.");
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h2 className="registration-title">Register</h2>
        <form onSubmit={handleRegister} className="registration-form">
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-register">
            Register
          </button>
          <p className="registration-footer-text">
            Already have an account?{" "}
            <span
              className="link-login"
              onClick={() => navigate("/login")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate("/login");
              }}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
