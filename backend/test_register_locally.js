import axios from "axios";

async function testRegister() {
    try {
        const response = await axios.post("http://localhost:3002/api/auth/register", {
            name: "Test Patient",
            email: "test_patient_" + Date.now() + "@example.com",
            password: "password123",
            role: "patient",
            gender: "Male",
            age: 25,
            phone: "03001234567"
        });
        console.log("Response:", response.data);
    } catch (err) {
        console.error("Error Status:", err.response?.status);
        console.error("Error Data:", err.response?.data);
        console.error("Error Message:", err.message);
    }
}

testRegister();
