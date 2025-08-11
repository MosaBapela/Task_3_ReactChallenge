import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1 className="landing-title">Welcome</h1>
      <p className="landing-description">
        Please log in or register to track your job applications.
      </p>
      <div className="landing-buttons">
        <button
          className="btn btn-login"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="btn btn-register"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
