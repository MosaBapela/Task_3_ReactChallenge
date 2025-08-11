import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../Context/AuthContext";

const Header: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-logo">Job Tracker</div>
        <nav>
          {auth.user ? (
            <button
              onClick={auth.logout}
              className="btn-logout"
            >
              Logout
            </button>
          ) : (
            <div className="header-buttons">
              <button
                onClick={() => navigate("/login")}
                className="btn-login"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn-register"
              >
                Register
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
