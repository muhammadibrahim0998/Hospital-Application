import dotenv from "dotenv";
dotenv.config();

const API = process.env.TEST_API || "http://localhost:3002/api";

async function run() {
  try {
    // Login as super admin (seeded)
    const loginRes = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD,
      }),
    });
    const loginJson = await loginRes.json();
    if (!loginRes.ok) {
      console.error("Login failed:", loginRes.status, loginJson);
      return;
    }
    const token = loginJson.token;
    console.log("Got token");

    // Post doctor without image
    const payload = {
      name: "Test Doctor X",
      email: `testdoctor${Date.now()}@example.com`,
      password: "password123",
      specialization: "Cardiology",
      phone: "03001234567",
      fee: "600",
    };

    const res = await fetch(`${API}/admin/doctors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const resJson = await res.json();
    console.log("Add doctor response:", res.status, resJson);
  } catch (err) {
    console.error("Request error:", err);
  }
}

run();
