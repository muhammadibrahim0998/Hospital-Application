import React, { useState } from "react";
import { useDoctors } from "../context/DoctorContext";

export default function AddDoctor() {
  const { addDoctor } = useDoctors();

  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    fee: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("specialty", formData.specialty);
    data.append("phone", formData.phone);
    data.append("fee", formData.fee);
    data.append("status", "active");
    data.append("image", formData.image);

    await addDoctor(data);

    setFormData({
      name: "",
      specialty: "",
      phone: "",
      fee: "",
      image: null,
    });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">Add Doctor</h3>
        <form onSubmit={handleSubmit}>
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td>
                  <label className="form-label fw-bold">Name</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label className="form-label fw-bold">Specialty</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="specialty"
                    className="form-control"
                    value={formData.specialty}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label className="form-label fw-bold">Phone</label>
                </td>
                <td>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label className="form-label fw-bold">Fee</label>
                </td>
                <td>
                  <input
                    type="number"
                    name="fee"
                    className="form-control"
                    value={formData.fee}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label className="form-label fw-bold">Choose Image</label>
                </td>
                <td>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <button className="btn btn-primary w-100">Add Doctor</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}
