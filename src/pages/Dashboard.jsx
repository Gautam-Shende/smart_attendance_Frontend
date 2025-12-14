import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card p-4 shadow">
          <h2 className="text-center text-primary mb-3">Dashboard</h2>
          <p className="text-center">Welcome to the Smart Attendance System</p>

          <div className="text-center">
            <Link to="/scan" className="btn btn-warning mt-3">
              Go to QR Scanner
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
