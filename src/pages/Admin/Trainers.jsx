import React, { useState, useEffect, useRef } from "react";
import { useAdmin } from "../../context/AdminContext";
import { gsap } from "gsap";
import { FaUserEdit, FaTrashAlt, FaDumbbell, FaUserPlus } from "react-icons/fa";
import trainerImg from "../../assets/images/1.jpg"; // ضع صورة رمزية مناسبة
import "bootstrap/dist/css/bootstrap.min.css";
import "./Trainers.css";

const Trainers = () => {
  const { trainers, addTrainer, updateTrainer, deleteTrainer } = useAdmin();

  const [formData, setFormData] = useState({
    name: "",
    activeClients: "",
    status: "active",
  });
  const [editingTrainer, setEditingTrainer] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTrainer) {
      updateTrainer({ ...editingTrainer, ...formData });
      setEditingTrainer(null);
    } else {
      addTrainer(formData);
    }
    setFormData({ name: "", activeClients: "", status: "active" });
  };

  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      activeClients: trainer.activeClients,
      status: trainer.status,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this trainer?")) {
      deleteTrainer(id);
    }
  };

  return (
    <div className="trainers-page container py-5" ref={containerRef}>
      <h2 className="text-center mb-4 fw-bold text-uppercase trainers-title">
        <FaDumbbell className="me-2" /> Trainers Management
      </h2>

      {/* ================== Form Section ================== */}
      <div className="card p-4 mb-5 trainer-form shadow-sm">
        <h5 className="mb-3 text-secondary">
          {editingTrainer ? "Edit Trainer" : "Add New Trainer"}
        </h5>
        <form
          onSubmit={handleSubmit}
          className="row g-3 align-items-center justify-content-center"
        >
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Trainer Name"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              name="activeClients"
              value={formData.activeClients}
              onChange={handleChange}
              placeholder="Active Clients"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="col-md-2 text-center">
            <button type="submit" className="btn add-btn w-100">
              <FaUserPlus className="me-1" />
              {editingTrainer ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>

      {/* ================== Trainers List ================== */}
      <div className="table-responsive">
        <table className="table table-dark table-striped align-middle text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Trainer</th>
              <th>Active Clients</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers && trainers.length > 0 ? (
              trainers.map((trainer, index) => (
                <tr key={trainer.id} className="trainer-row">
                  <td>{index + 1}</td>
                  <td className="d-flex align-items-center justify-content-center gap-2">
                    <img
                      src={trainerImg}
                      alt="Trainer Avatar"
                      className="trainer-avatar"
                    />
                    <span>{trainer.name}</span>
                  </td>
                  <td>{trainer.activeClients}</td>
                  <td
                    className={
                      trainer.status === "active"
                        ? "text-success fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {trainer.status}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm edit-btn me-2"
                      onClick={() => handleEdit(trainer)}
                    >
                      <FaUserEdit />
                    </button>
                    <button
                      className="btn btn-sm delete-btn"
                      onClick={() => handleDelete(trainer.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No trainers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trainers;
