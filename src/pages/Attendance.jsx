import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Attendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getData = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/attendance/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError("Failed to load data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Cannot connect to server");
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let lastMonth = currentMonth - 1;
    let lastMonthYear = currentYear;
    if (lastMonth < 0) {
      lastMonth = 11;
      lastMonthYear = currentYear - 1;
    }

    return {
      total: data.length,
      thisMonth: data.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      }).length,
      lastMonth: data.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getMonth() === lastMonth &&
          itemDate.getFullYear() === lastMonthYear
        );
      }).length,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-primary">
                  <i className="bi bi-calendar-check me-2"></i>
                  My Attendance
                </h2>
                <p className="text-muted">View your attendance history</p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-info px-3 py-2">
                  <i className="bi bi-check-circle me-1"></i>
                  {stats.total} Records
                </span>
                <button onClick={getData} className="btn btn-outline-primary">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        {/* Statistics Row */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Total Records</h5>
                    <h2 className="card-text fw-bold">{stats.total}</h2>
                  </div>
                  <div>
                    <i className="bi bi-calendar2-check fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">This Month</h5>
                    <h2 className="card-text fw-bold">{stats.thisMonth}</h2>
                  </div>
                  <div>
                    <i className="bi bi-graph-up fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Last Month</h5>
                    <h2 className="card-text fw-bold">{stats.lastMonth}</h2>
                  </div>
                  <div>
                    <i className="bi bi-graph-down fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="bi bi-list-check me-2"></i>
              Attendance History
            </h5>
          </div>

          <div className="card-body p-0">
            {data.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-calendar-x text-muted display-4"></i>
                <h4 className="mt-3 text-muted">No Attendance Records</h4>
                <p className="text-muted">
                  Your attendance records will appear here
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">#</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Username</th>
                      <th>Branch</th>
                      <th className="pe-4">Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => {
                      const date = new Date(item.createdAt);
                      const dayOfWeek = date.toLocaleDateString("en-US", {
                        weekday: "short",
                      });

                      return (
                        <tr key={index}>
                          <td className="ps-4 fw-bold">{index + 1}</td>
                          <td>
                            <div className="fw-bold">
                              {date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              <i className="bi bi-clock me-1"></i>
                              {date.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                                style={{ width: "35px", height: "35px" }}
                              >
                                {item.username?.charAt(0).toUpperCase()}
                              </div>
                              {item.username}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info">{item.branch}</span>
                          </td>
                          <td className="pe-4">
                            <span
                              className={`badge ${
                                dayOfWeek === "Sun" || dayOfWeek === "Sat"
                                  ? "bg-warning"
                                  : "bg-success"
                              }`}
                            >
                              {dayOfWeek}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card-footer bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small">
                  Showing {data.length} records
                </span>
              </div>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2">
                  <i className="bi bi-download me-1"></i>
                  Export
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-printer me-1"></i>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendance;
