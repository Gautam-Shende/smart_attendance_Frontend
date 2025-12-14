import { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

const ScanQR = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [attendanceData, setAttendanceData] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const markAttendance = async () => {
    setLoading(true);
    setMessage("");
    setAttendanceData(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first");
        setMessageType("error");
        navigate("/login");
        return;
      }

      const res = await api.post(
        "/api/attendance/mark",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage(res.data.message || "Attendance marked successfully!");
        setMessageType("success");
        setAttendanceData(res.data.data);

        // Add to scan history
        setScanHistory((prev) => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            status: "success",
            message: res.data.message,
          },
          ...prev.slice(0, 4),
        ]); // Keep only last 5 scans

        // Auto clear success message after 5 seconds
        setTimeout(() => {
          setMessage("");
        }, 5000);
      } else {
        setMessage(res.data.message || "Failed to mark attendance");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Attendance marking error:", error);
      setMessage(
        error.response?.data?.message || "Network error. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const viewAttendanceHistory = () => {
    navigate("/attendance");
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Header */}
            <div className="text-center mb-5">
              <div
                className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <i className="bi bi-qr-code-scan text-white fs-1"></i>
              </div>
              <h1 className="fw-bold text-primary">
                <i className="bi bi-qr-code me-2"></i>
                QR Attendance System
              </h1>
              <p className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Scan QR code to mark your daily attendance
              </p>
            </div>

            {/* Status Messages */}
            {message && (
              <div
                className={`alert alert-${
                  messageType === "success" ? "danger" : "success"
                } alert-dismissible fade show mb-4`}
                role="alert"
              >
                <div className="d-flex align-items-center">
                  <i
                    className={`bi ${
                      messageType === "success"
                        ? "bi-check-circle-fill"
                        : "bi-exclamation-triangle-fill"
                    } me-2`}
                  ></i>
                  <span>{message}</span>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMessage("")}
                ></button>
              </div>
            )}

            {/* Main Card */}
            <div className="card border-0 shadow-lg rounded-3 overflow-hidden mb-4">
              <div className="card-header bg-primary text-white py-4">
                <h3 className="text-center mb-0">
                  <i className="bi bi-camera me-2"></i>
                  Scan QR Code
                </h3>
              </div>

              <div className="card-body p-4 p-md-5">
                {/* QR Scanner Simulation */}
                <div className="text-center mb-5">
                  <div className="border border-primary border-2 border-dashed rounded-3 p-5 mb-4 bg-light">
                    <div className="position-relative d-inline-block mb-3">
                      <div className="bg-white p-4 rounded-3 shadow-sm border">
                        <i className="bi bi-qr-code text-primary display-1"></i>
                      </div>
                      <div
                        className="position-absolute top-0 start-0 w-100 bg-primary opacity-25"
                        style={{
                          height: "3px",
                          animation: "scan 2s linear infinite",
                        }}
                      ></div>
                    </div>
                    <h5 className="fw-semibold mb-3">
                      <i className="bi bi-qr-code-scan me-2"></i>
                      Point camera at QR code
                    </h5>
                    <p className="text-muted small">
                      <i className="bi bi-lightbulb me-1"></i>
                      Align QR code within the frame to scan automatically
                    </p>
                  </div>

                  {/* Simulate Scan Button */}
                  <button
                    className={`btn btn-primary btn-lg px-5 py-3 fw-semibold ${
                      loading ? "disabled" : ""
                    }`}
                    onClick={markAttendance}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Processing Scan...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-camera me-2"></i>
                        Simulate QR Scan
                      </>
                    )}
                  </button>
                </div>

                {/* Recent Attendance Info */}
                {attendanceData && (
                  <div className="card bg-success bg-opacity-10 border-success border mb-4">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <div
                            className="bg-success rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "50px", height: "50px" }}
                          >
                            <i className="bi bi-check-lg text-white fs-4"></i>
                          </div>
                        </div>
                        <div className="col">
                          <h5 className="fw-bold text-success mb-1">
                            <i className="bi bi-check-circle me-2"></i>
                            Attendance Recorded!
                          </h5>
                          <p className="mb-0 text-success">
                            <i className="bi bi-clock me-1"></i>
                            Time: {new Date().toLocaleTimeString()} |
                            <i className="bi bi-calendar ms-2 me-1"></i>
                            Date: {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <button
                      className="btn btn-outline-primary w-100 py-3 d-flex align-items-center justify-content-center"
                      onClick={viewAttendanceHistory}
                    >
                      <i className="bi bi-clock-history me-2"></i>
                      View Attendance History
                    </button>
                  </div>
                  <div className="col-md-6">
                    <Link
                      to="/attendance"
                      className="btn btn-outline-success w-100 py-3 d-flex align-items-center justify-content-center"
                    >
                      <i className="bi bi-list-check me-2"></i>
                      My All Attendance
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Scan History */}
            {scanHistory.length > 0 && (
              <div className="card border-0 shadow rounded-3 mb-4">
                <div className="card-header bg-light py-3">
                  <h5 className="mb-0">
                    <i className="bi bi-history me-2"></i>
                    Recent Scan History
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {scanHistory.map((scan, index) => (
                      <div
                        key={scan.id}
                        className="list-group-item border-0 py-3"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="d-flex align-items-center">
                              <div
                                className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                                  scan.status === "success"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                                style={{ width: "35px", height: "35px" }}
                              >
                                <i
                                  className={`bi ${
                                    scan.status === "success"
                                      ? "bi-check"
                                      : "bi-x"
                                  } text-white`}
                                ></i>
                              </div>
                              <div>
                                <h6 className="mb-0 fw-semibold">
                                  <i className="bi bi-qr-code me-1"></i>
                                  Scan {index + 1}
                                </h6>
                                <small className="text-muted">
                                  <i className="bi bi-calendar me-1"></i>
                                  {scan.date} at {scan.time}
                                </small>
                              </div>
                            </div>
                          </div>
                          <span
                            className={`badge ${
                              scan.status === "success"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {scan.status === "success" ? "Success" : "Failed"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="card border-0 shadow rounded-3">
              <div className="card-body">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-info-circle me-2 text-primary"></i>
                  How to Use QR Attendance
                </h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex">
                      <div className="me-3">
                        <span
                          className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "30px", height: "30px" }}
                        >
                          1
                        </span>
                      </div>
                      <div>
                        <h6 className="fw-semibold">
                          <i className="bi bi-qr-code me-1"></i>
                          Position QR Code
                        </h6>
                        <p className="text-muted small mb-0">
                          Hold your device steady and position the QR code
                          within the camera frame
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex">
                      <div className="me-3">
                        <span
                          className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "30px", height: "30px" }}
                        >
                          2
                        </span>
                      </div>
                      <div>
                        <h6 className="fw-semibold">
                          <i className="bi bi-camera me-1"></i>
                          Auto Scan
                        </h6>
                        <p className="text-muted small mb-0">
                          The system will automatically scan and process the QR
                          code
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex">
                      <div className="me-3">
                        <span
                          className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "30px", height: "30px" }}
                        >
                          3
                        </span>
                      </div>
                      <div>
                        <h6 className="fw-semibold">
                          <i className="bi bi-check-circle me-1"></i>
                          Confirm Attendance
                        </h6>
                        <p className="text-muted small mb-0">
                          Wait for confirmation message that attendance has been
                          recorded
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex">
                      <div className="me-3">
                        <span
                          className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "30px", height: "30px" }}
                        >
                          4
                        </span>
                      </div>
                      <div>
                        <h6 className="fw-semibold">
                          <i className="bi bi-clock-history me-1"></i>
                          Check History
                        </h6>
                        <p className="text-muted small mb-0">
                          View your attendance history anytime from your
                          dashboard
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-center mt-4">
              <p className="text-muted small">
                <i className="bi bi-question-circle me-1"></i>
                Need help? Contact your administrator
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap animation */}
      <style>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0;
          }
        }
      `}</style>
    </>
  );
};

export default ScanQR;
