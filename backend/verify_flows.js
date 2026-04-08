const API_URL = "http://localhost:3002/api/auth";

const testFlows = async () => {
    try {
        console.log("--- Testing Patient Registration ---");
        const regData = {
            name: "Test Patient " + Date.now(),
            email: `test_${Date.now()}@example.com`,
            password: "password123",
            role: "patient",
            gender: "Male",
            age: 25,
            phone: "03001234567"
        };
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regData)
        });
        const regJson = await regRes.json();
        
        if (regRes.ok) {
            console.log("Registration Success ✅:", regJson.message);
        } else {
            throw { response: { status: regRes.status, data: regJson } };
        }

        console.log("\n--- Testing Doctor Login ---");
        const loginData = {
            email: "Dr_Ahmad1@gmail.com",
            password: "doctor123"
        };
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });
        const loginJson = await loginRes.json();

        if (loginRes.ok) {
            console.log("Login Success ✅:", loginJson.user.name, `(${loginJson.user.role})`);
            console.log("Token received 🔑");
        } else {
            throw { response: { status: loginRes.status, data: loginJson } };
        }

        process.exit(0);
    } catch (error) {
        console.error("Test Failed ❌");
        console.error("Status:", error.response?.status || "Unknown");
        console.error("Message:", error.response?.data?.message || error.message);
        process.exit(1);
    }
};

testFlows();
