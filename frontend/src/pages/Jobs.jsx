import { useEffect, useState } from "react";
import api from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("applied");

  const [editingJobId, setEditingJobId] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    getJobs();
  }, [page, search, filterStatus]);

  const getJobs = async () => {
    try {
      const params = {
        skip: (page - 1) * limit,
        limit: limit,
      };

      if (search) {
        params.search = search;
      }

      if (filterStatus !== "all") {
        params.status = filterStatus;
      }

      const response = await api.get("/jobs/", { params });
      setJobs(response.data);
    } catch (error) {
      if (localStorage.getItem("token")) {
        setError("Failed to load jobs");
      }
    }
  };

  const addJob = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/jobs/", {
        company,
        position,
        description: description || null,
        status,
      });

      setJobs([...jobs, response.data]);
      clearForm();
    } catch (error) {
      setError(
        error.response?.data?.detail || "Failed to add job"
      );
    }
  };

  const startEdit = (job) => {
    setEditingJobId(job.id);
    setCompany(job.company);
    setPosition(job.position);
    setDescription(job.description || "");
    setStatus(job.status);
  };

  const updateJob = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.put(`/jobs/${editingJobId}`, {
        company,
        position,
        description: description || null,
        status,
      });

      setJobs(
        jobs.map((job) =>
          job.id === editingJobId ? response.data : job
        )
      );

      clearForm();
    } catch (error) {
      setError(
        error.response?.data?.detail || "Failed to update job"
      );
    }
  };

  const deleteJob = async (jobId) => {
    setError("");

    try {
      await api.delete(`/jobs/${jobId}`);

      setJobs(jobs.filter((job) => job.id !== jobId));

      if (editingJobId === jobId) {
        clearForm();
      }
    } catch (error) {
      setError(
        error.response?.data?.detail || "Failed to delete job"
      );
    }
  };

  const clearForm = () => {
    setCompany("");
    setPosition("");
    setDescription("");
    setStatus("applied");
    setEditingJobId(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const totalJobs = jobs.length;

  const appliedJobs = jobs.filter(
    (job) => job.status === "applied"
  ).length;

  const interviewJobs = jobs.filter(
    (job) => job.status === "interview"
  ).length;

  const hiredJobs = jobs.filter(
    (job) => job.status === "hired"
  ).length;

  const rejectedJobs = jobs.filter(
    (job) => job.status === "rejected"
  ).length;

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>JobTracker</h1>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </nav>

      <main className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Jobs</h3>
            <p>{totalJobs}</p>
          </div>

          <div className="stat-card">
            <h3>Applied</h3>
            <p>{appliedJobs}</p>
          </div>

          <div className="stat-card">
            <h3>Interviews</h3>
            <p>{interviewJobs}</p>
          </div>

          <div className="stat-card">
            <h3>Hired</h3>
            <p>{hiredJobs}</p>
          </div>

          <div className="stat-card">
            <h3>Rejected</h3>
            <p>{rejectedJobs}</p>
          </div>
        </div>

        <div className="form-card">
          <h2>
            {editingJobId ? "Edit Job" : "Add New Job"}
          </h2>

          {error && <p className="error">{error}</p>}

          <form
            onSubmit={
              editingJobId ? updateJob : addJob
            }
          >
            <div>
              <label>Company</label>

              <input
                type="text"
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value)
                }
                placeholder="Company name"
                required
              />
            </div>

            <br />

            <div>
              <label>Position</label>

              <input
                type="text"
                value={position}
                onChange={(e) =>
                  setPosition(e.target.value)
                }
                placeholder="Job position"
                required
              />
            </div>

            <br />

            <div>
              <label>Description</label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Job description"
              />
            </div>

            <br />

            <div>
              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </div>

            <br />

            <button
              type="submit"
              className="primary-button"
            >
              {editingJobId
                ? "Update Job"
                : "Add Job"}
            </button>

            {editingJobId && (
              <button
                type="button"
                className="cancel-button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="form-card">
          <h2>Search & Filter</h2>

          <input
            type="text"
            placeholder="Search by company or position..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <br />
          <br />

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>

        <h2>My Jobs</h2>

        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div
                className="job-card"
                key={job.id}
              >
                <h3>{job.position}</h3>

                <strong>{job.company}</strong>

                <br />

                <span
                  className={`status status-${job.status}`}
                >
                  {job.status}
                </span>

                <p>
                  {job.description ||
                    "No description provided."}
                </p>

                <small>
                  Applied at:{" "}
                  {formatDate(job.applied_at)}
                </small>

                <div className="job-actions">
                  <button
                    className="edit-button"
                    onClick={() =>
                      startEdit(job)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteJob(job.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            alignItems: "center",
          }}
        >
          <button
            className="cancel-button"
            onClick={() =>
              setPage((current) =>
                Math.max(current - 1, 1)
              )
            }
            disabled={page === 1}
          >
            Previous
          </button>

          <span>Page {page}</span>

          <button
            className="primary-button"
            onClick={() =>
              setPage((current) => current + 1)
            }
            disabled={jobs.length < limit}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default Jobs;
