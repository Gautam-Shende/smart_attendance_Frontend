import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await api.post("/api/auth/login", { email, password });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      alert("Login Success");
      nav("/dashboard");
    } else {
      alert(res.data.message);
    }
  };

  return (
    <>
      <div className="container mt-5" style={{ maxWidth: "450px" }}>
        <div className="card shadow p-4">
          <h3 className="text-center text-primary mb-4">Login</h3>

          <input
            className="form-control mb-3"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100" onClick={submit}>
            Login
          </button>

          <p className="mt-3 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-primary">
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
