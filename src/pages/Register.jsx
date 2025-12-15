import { useState } from "react";
import api from "../api/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await api.post("/api/auth/register", {
      name,
      email,
      branch,
      password,
    });
    alert(res.data.message);
  };

  return (
    <>
      <div className="container mt-5" style={{ maxWidth: "450px" }}>
        <div className="card shadow p-4">
          <h3 className="text-center text-success mb-4">Register</h3>

          <input
            className="form-control mb-3"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-control mb-3"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-control mb-3"
            placeholder="Class"
            onChange={(e) => setBranch(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-success w-100" onClick={submit}>
            Register
          </button>
          <p className="mt-3 text-center">
            If You Registres successfully, Then Please LoginFirst!{" "}
            <a href="/login" className="text-primary">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
