import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Table, Button, Badge } from "react-bootstrap";
import { Search, Plus, Trash2, Printer, FlaskConical } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { useLab } from "../context/LabContext";

const TEST_CATALOG = [
    { id: 1, name: "RBS", fee: 100 },
    { id: 2, name: "HBS", fee: 350 },
    { id: 3, name: "HCV", fee: 350 },
    { id: 4, name: "AIT (SGPT)", fee: 300 },
    { id: 5, name: "CBC", fee: 400 },
    { id: 6, name: "Lipid Profile", fee: 1200 },
    { id: 7, name: "LFT", fee: 800 },
    { id: 8, name: "Urea / Creatinine", fee: 500 },
];

export default function LaboratoryServices() {
    const { token, user } = useContext(AuthContext);
    const { addTest } = useLab();

    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState("");
    const [doctorName, setDoctorName] = useState("Dr Mehmood Nooristani");
    const [regDate, setRegDate] = useState(new Date().toISOString().split('T')[0]);
    const [collectDate, setCollectDate] = useState(new Date().toISOString().split('T')[0]);

    const [selectedTests, setSelectedTests] = useState([]);

    useEffect(() => {
        fetchPatients();
    }, [token]);

    const fetchPatients = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/admin/patients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(res.data || []);
        } catch (err) {
            console.error("Error fetching patients:", err);
        }
    };

    const fetchPatientAppointments = async (patientId) => {
        try {
            // Assuming endpoint exists or filter existing appointments
            const res = await axios.get(`${API_BASE_URL}/api/admin/appointments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const filtered = (res.data || []).filter(app => app.patient_id === parseInt(patientId));
            setAppointments(filtered);
        } catch (err) {
            console.error("Error fetching patient appointments:", err);
        }
    };

    const handlePatientChange = (e) => {
        const val = e.target.value;
        setSelectedPatient(val);
        if (val) {
            fetchPatientAppointments(val);
        } else {
            setAppointments([]);
        }
    };

    const addTestToSummary = (toy) => {
        if (selectedTests.find(t => t.id === toy.id)) return;
        setSelectedTests([...selectedTests, { ...toy, discount: 0 }]);
    };

    const removeTestFromSummary = (id) => {
        setSelectedTests(selectedTests.filter(t => t.id !== id));
    };

    const updateDiscount = (id, disc) => {
        setSelectedTests(selectedTests.map(t => t.id === id ? { ...t, discount: parseFloat(disc) || 0 } : t));
    };

    const calculateTotal = () => {
        return selectedTests.reduce((acc, current) => acc + (current.fee - current.discount), 0);
    };

    const handleAuthorize = async () => {
        if (!selectedPatient || selectedTests.length === 0) {
            alert("Please select a patient and at least one test.");
            return;
        }

        const patient = patients.find(p => p.user_id === parseInt(selectedPatient));

        try {
            // Adding each test individually to match current backend structure
            for (const test of selectedTests) {
                await addTest({
                    patient_name: patient?.name || "Patient",
                    patient_id: selectedPatient,
                    cnic: patient?.cnic || "",
                    test_name: test.name,
                    doctor_name: doctorName,
                    price: test.fee - test.discount,
                    category: "General",
                    description: `Authorized at ${collectDate}`
                });
            }
            alert("Lab tests authorized successfully!");
            setSelectedTests([]);
        } catch (err) {
            alert("Error authorizing tests.");
        }
    };

    const filteredCatalog = TEST_CATALOG.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="py-4" style={{ background: "#f8f9fc", minHeight: "100vh" }}>
            <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-3 bg-white rounded-circle shadow-sm">
                    <FlaskConical className="text-primary" size={40} />
                </div>
                <div>
                    <h2 className="mb-0 fw-bold text-dark">Welcome, {user?.name || "User"}</h2>
                    <p className="text-muted mb-0">Contact: {user?.phone || "123123123"}</p>
                </div>
            </div>

            <Row className="g-4">
                {/* LEFT COLUMN: ADD TEST FORM */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4">Add Test</h5>

                            <Row className="g-3 mb-4">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted">Client Name</Form.Label>
                                        <Form.Select
                                            className="py-2 bg-light border-0"
                                            value={selectedPatient}
                                            onChange={handlePatientChange}
                                        >
                                            <option value="">Select Client</option>
                                            {patients.map(p => (
                                                <option key={p.user_id} value={p.user_id}>{p.name}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted">Appointment</Form.Label>
                                        <Form.Select
                                            className="py-2 bg-light border-0"
                                            value={selectedAppointment}
                                            onChange={(e) => setSelectedAppointment(e.target.value)}
                                            disabled={!selectedPatient}
                                        >
                                            <option value="">{appointments.length > 0 ? "Select Appointment" : "No appointments available"}</option>
                                            {appointments.map(app => (
                                                <option key={app.id} value={app.id}>{app.Date} - {app.Time}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted">Doctor Name</Form.Label>
                                        <Form.Control
                                            className="py-2 bg-light border-0"
                                            value={doctorName}
                                            onChange={e => setDoctorName(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted">Registration Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            className="py-2 bg-light border-0"
                                            value={regDate}
                                            onChange={e => setRegDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-muted">Collected At</Form.Label>
                                        <Form.Control
                                            type="date"
                                            className="py-2 bg-light border-0"
                                            value={collectDate}
                                            onChange={e => setCollectDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="mb-3 d-flex align-items-center gap-2">
                                <Search size={18} className="text-muted" />
                                <Form.Control
                                    placeholder="Search test type..."
                                    className="py-2 border-0 bg-light"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                <Table hover className="align-middle mb-0">
                                    <thead className="bg-light sticky-top">
                                        <tr className="small text-muted text-uppercase">
                                            <th className="border-0">Test Type</th>
                                            <th className="border-0">Test Fee</th>
                                            <th className="border-0 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCatalog.map(test => (
                                            <tr key={test.id}>
                                                <td>{test.name}</td>
                                                <td className="fw-bold">{test.fee}</td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="rounded-pill px-3"
                                                        onClick={() => addTestToSummary(test)}
                                                    >
                                                        ADD
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* RIGHT COLUMN: SUMMARY */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Body className="p-4 d-flex flex-column">
                            <h5 className="fw-bold mb-4">SUMMARY</h5>

                            <div className="mb-3 pb-3 border-bottom">
                                <div className="small text-muted fw-bold mb-1">Client:</div>
                                <div className="fw-bold">{patients.find(p => p.user_id === parseInt(selectedPatient))?.name || "None"}</div>

                                <div className="small text-muted fw-bold mt-2 mb-1">Appointment:</div>
                                <div className="fw-bold">
                                    {appointments.find(a => a.id === parseInt(selectedAppointment))?.Date || "No appointments available"}
                                </div>
                            </div>

                            <div className="flex-grow-1">
                                <Table borderless className="align-middle">
                                    <thead>
                                        <tr className="small text-muted text-uppercase">
                                            <th>Test Type</th>
                                            <th>Fee</th>
                                            <th>Discount</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedTests.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-muted small">No tests added to summary</td>
                                            </tr>
                                        ) : (
                                            selectedTests.map(test => (
                                                <tr key={test.id} className="small">
                                                    <td className="fw-semibold">{test.name}</td>
                                                    <td>{test.fee}</td>
                                                    <td style={{ width: "80px" }}>
                                                        <Form.Control
                                                            size="sm"
                                                            type="number"
                                                            className="bg-light border-0 p-1 text-center"
                                                            value={test.discount}
                                                            onChange={(e) => updateDiscount(test.id, e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="text-end">
                                                        <Trash2
                                                            size={16}
                                                            className="text-danger cursor-pointer"
                                                            onClick={() => removeTestFromSummary(test.id)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            <div className="mt-4 pt-4 border-top">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="mb-0 fw-bold">TOTAL:</h5>
                                    <h4 className="mb-0 fw-bold text-primary">{calculateTotal()} PKR</h4>
                                </div>

                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        className="py-2 fw-bold rounded-pill"
                                        onClick={handleAuthorize}
                                        disabled={selectedTests.length === 0}
                                    >
                                        AUTHORIZE LAB BILL
                                    </Button>
                                    <Button
                                        variant="light"
                                        className="py-2 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => window.print()}
                                    >
                                        <Printer size={18} /> PRINT BILL
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
