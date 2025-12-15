import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // Check user login status using token
  const isLoggedIn = !!localStorage.getItem("token");

  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  alert("Logged out");
  navigate("/login", { replace: true });
};


  return (
    <nav className="navbar navbar-dark bg-primary px-4">
      <Link className="navbar-brand text-white fw-bold" to="/">
        Smart Attendance
      </Link>

      <ul className="nav">
        {isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/dashboard">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <button
                className="btn btn-danger btn-sm ms-3"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/login">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white" to="/register">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
