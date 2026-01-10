import React, { useEffect, useState } from "react";
import { getProfile } from "../api/api";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getProfile(token)
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      })
      .catch(() => alert("Failed to fetch profile"));
  }, [token]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (image) formData.append("image", image);

    try {
      const res = await axios.put(
        "http://localhost:3002/api/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile updated successfully");
      setUser(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (!user) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <div className="card shadow p-4 text-center">
        {user.profile_image && (
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : `http://localhost:3002/uploads/profiles/${user.profile_image}`
            }
            alt="profile"
            className="rounded-circle mb-3"
            style={{ width: 120, height: 120, objectFit: "cover" }}
          />
        )}

        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <input
          className="form-control mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form-control mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn btn-primary mt-3" onClick={handleUpdate}>
          Update Profile
        </button>
      </div>
    </div>
  );
}
