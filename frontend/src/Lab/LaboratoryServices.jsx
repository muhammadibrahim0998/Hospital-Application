import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Form, Table, Button, Badge, Modal } from "react-bootstrap";
import { Search, Plus, Trash2, Printer, FlaskConical, User, Calendar, Clipboard, CheckCircle, Microscope, Clock, Phone, Mail, Info } from "lucide-react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { useLab } from "../context/LabContext";

const TEST_CATALOG = [
    { id: 1, name: "RBS (Random Blood Sugar)", fee: 100 },
    { id: 2, name: "HBsAg (Hepatitis B)", fee: 350 },
    { id: 3, name: "Anti-HCV (Hepatitis C)", fee: 350 },
    { id: 4, name: "ALT (SGPT) - Liver", fee: 300 },
    { id: 5, name: "CBC (Complete Blood Count)", fee: 400 },
    { id: 6, name: "Lipid Profile (Cholesterol)", fee: 1200 },
    { id: 7, name: "LFT (Liver Function Test)", fee: 800 },
    { id: 8, name: "Urea / Creatinine (Kidney)", fee: 500 },
    { id: 9, name: "Blood Group & RH", fee: 200 },
    { id: 10, name: "HBA1C (Diabetes 3 Months)", fee: 800 },
    { id: 11, name: "TSH (Thyroid)", fee: 600 },
    { id: 12, name: "Vitamin D", fee: 2500 },
    { id: 13, name: "Vitamin B12", fee: 1500 },
    { id: 14, name: "Uric Acid", fee: 300 },
    { id: 15, name: "Calcium", fee: 400 },
    { id: 16, name: "Serum Electrolytes", fee: 700 },
];

export default function LaboratoryServices() {
    const { token, user } = useContext(AuthContext);
    const { addTest } = useLab();
    const location = useLocation();

    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [catalog, setCatalog] = useState(TEST_CATALOG);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState("");
    const [doctorName, setDoctorName] = useState("Dr Mehmood Nooristani");
    const [regDate, setRegDate] = useState(new Date().toISOString().split('T')[0]);
    const [collectDate, setCollectDate] = useState(new Date().toISOString().split('T')[0]);

    const [selectedTests, setSelectedTests] = useState([]);

    // New Test Modal State
    const [showNewTestModal, setShowNewTestModal] = useState(false);
    const [newTestName, setNewTestName] = useState("");
    const [newTestFee, setNewTestFee] = useState("");

    useEffect(() => {
        fetchPatients();
    }, [token]);

    const [formPatientName, setFormPatientName] = useState("");

    // Handle incoming state from Doctor Dashboard
    useEffect(() => {
        if (location.state) {
            const { patient_id, appointment_id, doctor_name, appointment_date, patient_name } = location.state;
            
            if (doctor_name) setDoctorName(doctor_name);
            if (patient_name) setFormPatientName(patient_name);
            if (appointment_date) {
                const datePart = appointment_date.includes('T') ? appointment_date.split('T')[0] : appointment_date;
                setRegDate(datePart);
            }

            if (patient_id) {
                const pIdString = patient_id.toString();
                setSelectedPatient(pIdString);
                
                // Pre-fetch appointments for this patient immediately
                const fetchInitialAppointments = async () => {
                    try {
                        const res = await axios.get(`${API_BASE_URL}/api/admin/appointments`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const allApps = res.data || [];
                        const filtered = allApps.filter(app => String(app.patient_id) === pIdString);
                        setAppointments(filtered);
                        
                        // Explicitly set the appointment ID if it exists in state
                        if (appointment_id) {
                            setSelectedAppointment(appointment_id.toString());
                        }
                    } catch (err) {
                        console.error("Error auto-populating appointments:", err);
                    }
                };
                fetchInitialAppointments();
            }
        } else if (user?.name) {
            setDoctorName(user.name);
        }
    }, [location.state, token, user]); // Run when state or user changes

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
            const res = await axios.get(`${API_BASE_URL}/api/admin/appointments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const filtered = (res.data || []).filter(app => String(app.patient_id) === String(patientId));
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
            setSelectedAppointment("");
        }
    };

    const handleAppointmentChange = (e) => {
        const val = e.target.value;
        setSelectedAppointment(val);
        
        if (val) {
            const app = appointments.find(a => String(a.id) === String(val));
            if (app && app.patient_id && !selectedPatient) {
                setSelectedPatient(app.patient_id.toString());
            }
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

        const patient = patients.find(p => String(p.user_id) === String(selectedPatient));
        const selectedAppointmentData = appointments.find(app => String(app.id) === String(selectedAppointment));

        try {
            for (const test of selectedTests) {
                await addTest({
                    patient_id: selectedPatient,
                    patient_name: formPatientName || (selectedAppointmentData ? selectedAppointmentData.Patient : patient?.name || "Guest Patient"),
                    cnic: patient?.cnic || (selectedAppointmentData ? selectedAppointmentData.CNIC : "N/A"),
                    test_name: test.name,
                    doctor_name: doctorName,
                    doctor_id: user?.id, // Assuming user.id is the doctor_id
                    appointment_id: selectedAppointment,
                    category: "General",
                    price: test.fee - test.discount,
                    description: `Authorized at ${collectDate}`
                });
            }
            alert("Lab tests authorized successfully!");
            setSelectedTests([]);
        } catch (err) {
            alert("Error authorizing tests.");
        }
    };

    const handleAddNewTest = () => {
        if (!newTestName || !newTestFee) {
            alert("Please provide both name and fee.");
            return;
        }
        const newEntry = {
            id: Date.now(), // Unique ID
            name: newTestName,
            fee: parseFloat(newTestFee)
        };
        setCatalog([...catalog, newEntry]);
        setNewTestName("");
        setNewTestFee("");
        setShowNewTestModal(false);
    };

    const deleteFromCatalog = (id) => {
        if (window.confirm("Are you sure you want to remove this test from the catalog?")) {
            setCatalog(catalog.filter(t => t.id !== id));
        }
    };

    const filteredCatalog = catalog.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="lab-services-main">
            {/* Interactive UI - Hidden on Print */}
            <Container fluid className="py-4 d-print-none" style={{ background: "#f0f2f5", minHeight: "100vh" }}>
                <div className="d-flex align-items-center justify-content-between mb-3 bg-white p-3 rounded-4 shadow-sm border-start border-4 border-primary">
                <div className="d-flex align-items-center gap-2">
                    <div className="p-2 bg-primary bg-opacity-10 rounded-circle">
                        <FlaskConical className="text-primary" size={24} />
                    </div>
                    <div>
                        <h5 className="mb-0 fw-bold text-dark">
                            {selectedPatient 
                                ? `${patients.find(p => String(p.user_id) === String(selectedPatient))?.name || formPatientName || "Patient"}` 
                                : "Laboratory Diagnostics"
                            }
                        </h5>
                        {(selectedPatient || formPatientName) ? (
                            <div className="d-flex align-items-center gap-2" style={{ fontSize: '11px' }}>
                                <Badge bg="info" className="bg-opacity-10 text-info fw-normal border-0 py-1">Appt ID: #{selectedAppointment || location.state?.appointment_id || "N/A"}</Badge>
                                <span className="text-muted">|</span>
                                <span className="text-muted fw-bold">Referring Physician: {doctorName || "N/A"}</span>
                                <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="p-0 text-primary fw-bold text-decoration-none ms-2"
                                    style={{ fontSize: '10px' }}
                                    onClick={() => window.open('/lab-results', '_blank')}
                                >
                                    <Info size={12} className="me-1" /> Quick View Results
                                </Button>
                            </div>
                        ) : (
                            <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Authorize investigations and manage billing</p>
                        )}
                    </div>
                </div>
                <div className="text-end d-none d-md-block">
                    <div className="fw-bold small">{user?.name || "Practitioner"}</div>
                    <Badge bg="primary" className="rounded-pill px-2 py-1" style={{ fontSize: '9px' }}>{user?.role?.toUpperCase() || "STAFF"}</Badge>
                </div>
            </div>

            <Row className="g-4 d-print-none">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-3">
                        <Card.Header className="bg-white border-0 pt-3 px-4 pb-0">
                            <h6 className="fw-bold d-flex align-items-center text-primary mb-0">
                                <User className="me-2" size={16} /> Patient & Appointment Setup
                            </h6>
                        </Card.Header>
                        <Card.Body className="p-3 px-4">
                            <Row className="g-2">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold text-muted mb-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Client / Patient</Form.Label>
                                        <Form.Select
                                            size="sm"
                                            className="border-0 bg-light rounded-2 fw-medium"
                                            style={{ height: '38px' }}
                                            value={selectedPatient.toString()}
                                            onChange={handlePatientChange}
                                        >
                                            <option value="">Select Client</option>
                                            {/* Virtual option for state-passed patient if not in the list */}
                                            {location.state?.patient_id && !patients.find(p => String(p.user_id) === String(location.state.patient_id)) && (
                                                <option value={location.state.patient_id.toString()}>
                                                    {location.state.patient_name || "Selected Patient"} (ID: {location.state.patient_id})
                                                </option>
                                            )}
                                            {patients.map(p => (
                                                <option key={p.user_id} value={p.user_id.toString()}>{p.name} (ID: {p.user_id})</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold text-muted mb-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Linked Appointment</Form.Label>
                                        <Form.Select
                                            size="sm"
                                            className="border-0 bg-light rounded-2 fw-medium"
                                            style={{ height: '38px' }}
                                            value={selectedAppointment.toString()}
                                            onChange={handleAppointmentChange}
                                            disabled={!selectedPatient}
                                        >
                                            <option value="">{appointments.length > 0 || location.state?.appointment_id ? "Select Appointment" : "No record found"}</option>
                                            {/* Virtual option for state-passed appointment if not in the list */}
                                            {location.state?.appointment_id && !appointments.find(a => String(a.id) === String(location.state.appointment_id)) && (
                                                <option value={location.state.appointment_id.toString()}>
                                                    {location.state.appointment_date || "Current"} (Appt ID: {location.state.appointment_id})
                                                </option>
                                            )}
                                            {appointments.map(app => (
                                                <option key={app.id} value={app.id.toString()}>
                                                    {app.Date} {app.Time} (Appt ID: {app.id}) (Patient ID: {app.patient_id})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold text-muted mb-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Referring Dr.</Form.Label>
                                        <Form.Control
                                            size="sm"
                                            className="border-0 bg-light rounded-2"
                                            value={doctorName}
                                            onChange={e => setDoctorName(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold text-muted mb-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Reg. Date</Form.Label>
                                        <Form.Control
                                            size="sm"
                                            type="date"
                                            className="border-0 bg-light rounded-2"
                                            value={regDate}
                                            onChange={e => setRegDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-bold text-muted mb-1" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Collect Date</Form.Label>
                                        <Form.Control
                                            size="sm"
                                            type="date"
                                            className="border-0 bg-light rounded-2"
                                            value={collectDate}
                                            onChange={e => setCollectDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <Card.Header className="bg-white border-0 pt-3 px-4 pb-2 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <h6 className="fw-bold d-flex align-items-center mb-0 text-primary">
                                    <Clipboard className="me-2" size={16} /> Investigations Catalog
                                </h6>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    className="rounded-pill px-3 py-0 border-dashed"
                                    style={{ fontSize: '10px', height: '22px', borderStyle: 'dashed' }}
                                    onClick={() => setShowNewTestModal(true)}
                                >
                                    <Plus size={12} className="me-1" /> New Test
                                </Button>
                            </div>
                            <div className="position-relative" style={{ width: "180px" }}>
                                <Search className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" size={12} />
                                <Form.Control
                                    size="sm"
                                    placeholder="Search..."
                                    className="ps-4 border-0 bg-light rounded-pill"
                                    style={{ fontSize: '12px' }}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive" style={{ maxHeight: "280px", overflowY: "auto" }}>
                                <Table hover className="align-middle mb-0 table-sm">
                                    <thead className="bg-light sticky-top">
                                        <tr className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>
                                            <th className="px-4 py-2 border-0">Test Name</th>
                                            <th className="py-2 border-0">Fee</th>
                                            <th className="py-2 border-0 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCatalog.map(test => (
                                            <tr key={test.id} className="border-bottom border-light">
                                                <td className="px-4 py-2 fw-medium" style={{ fontSize: '13px' }}>{test.name}</td>
                                                <td className="py-2 text-primary fw-bold" style={{ fontSize: '13px' }}>Rs. {test.fee}</td>
                                                <td className="py-2 text-center">
                                                    <div className="d-flex align-items-center justify-content-center gap-1">
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            className="rounded-pill px-3 border-0 py-0"
                                                            style={{ fontSize: '11px', height: '24px' }}
                                                            onClick={() => addTestToSummary(test)}
                                                        >
                                                            <Plus size={12} className="me-1" /> Add
                                                        </Button>
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="text-danger p-0"
                                                            onClick={() => deleteFromCatalog(test.id)}
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 h-100 d-flex flex-column overflow-hidden">
                        <Card.Header className="bg-primary text-white p-3 border-0">
                            <h6 className="fw-bold mb-0 d-flex align-items-center">
                                <Clipboard className="me-2" size={16} /> Billings Summary
                            </h6>
                        </Card.Header>
                        <Card.Body className="p-3 d-flex flex-column">
                            <div className="mb-3 bg-light p-2 rounded-3 border-start border-4 border-primary">
                                <div className="text-muted fw-bold" style={{ fontSize: '10px' }}>PATIENT:</div>
                                <div className="fw-bold d-flex align-items-center small">
                                    {patients.find(p => String(p.user_id) === String(selectedPatient))?.name || 
                                     formPatientName || "Not Selected"
                                    }
                                    {(selectedPatient || formPatientName) && <CheckCircle size={12} className="ms-2 text-success" />}
                                </div>
                            </div>

                            <div className="flex-grow-1">
                                <h6 className="fw-bold mb-2 text-uppercase text-muted" style={{ fontSize: '10px' }}>Items Added</h6>
                                <div className="table-responsive">
                                    <Table borderless className="align-middle table-sm">
                                        <tbody style={{ fontSize: '12px' }}>
                                            {selectedTests.length === 0 ? (
                                                <tr>
                                                    <td className="text-center py-5 text-muted small">No tests selected.</td>
                                                </tr>
                                            ) : (
                                                selectedTests.map(test => (
                                                    <tr key={test.id} className="border-bottom border-light">
                                                        <td className="py-1">
                                                            <div className="fw-bold text-dark">{test.name}</div>
                                                            <div className="text-muted" style={{ fontSize: "9px" }}>Fee: {test.fee}</div>
                                                        </td>
                                                        <td className="py-1" style={{ width: "80px" }}>
                                                            <div className="input-group input-group-sm">
                                                                <span className="input-group-text bg-transparent border-0 p-0 me-1" style={{ fontSize: '10px' }}>Disc:</span>
                                                                <Form.Control
                                                                    type="number"
                                                                    size="sm"
                                                                    className="bg-transparent border-0 text-danger fw-bold p-0 text-center"
                                                                    style={{ width: '30px' }}
                                                                    value={test.discount}
                                                                    onChange={(e) => updateDiscount(test.id, e.target.value)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="py-1 text-end">
                                                            <Trash2
                                                                size={14}
                                                                className="text-danger cursor-pointer opacity-50 hover-opacity-100"
                                                                onClick={() => removeTestFromSummary(test.id)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>

                            <div className="mt-auto pt-3 border-top">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted fw-bold small">TOTAL</span>
                                    <h4 className="mb-0 fw-bold text-primary">Rs. {calculateTotal()}</h4>
                                </div>

                                <div className="d-grid gap-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="py-2 fw-bold rounded-pill shadow-sm border-0"
                                        onClick={handleAuthorize}
                                        disabled={selectedTests.length === 0}
                                    >
                                        AUTHORIZE & BILL
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="py-2 fw-bold rounded-pill d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => window.print()}
                                    >
                                        <Printer size={14} /> Print
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

            {/* Print Modal - Hidden on Print */}
            <Modal show={showNewTestModal} onHide={() => setShowNewTestModal(false)} centered size="sm" className="d-print-none">
                <Modal.Header closeButton className="border-0 bg-primary text-white p-3">
                    <Modal.Title className="h6 mb-0">Add New Investigation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">
                    <Form.Group className="mb-2">
                        <Form.Label className="small fw-bold text-muted mb-1">TEST NAME</Form.Label>
                        <Form.Control
                            size="sm"
                            className="bg-light border-0"
                            placeholder="e.g. Blood Sugar"
                            value={newTestName}
                            onChange={e => setNewTestName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-muted mb-1">STANDARD FEE (RS)</Form.Label>
                        <Form.Control
                            type="number"
                            size="sm"
                            className="bg-light border-0"
                            placeholder="0.00"
                            value={newTestFee}
                            onChange={e => setNewTestFee(e.target.value)}
                        />
                    </Form.Group>
                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-100 rounded-pill fw-bold py-2"
                        onClick={handleAddNewTest}
                    >
                        ADD TO CATALOG
                    </Button>
                </Modal.Body>
            </Modal>

            {/* Professional Smart Pathology Lab Report - Visible ONLY on Print */}
            <div id="printable-receipt" className="d-none d-print-block" style={{ fontFamily: '"Inter", sans-serif', color: '#000' }}>
                <div className="receipt-container" style={{ backgroundColor: 'white', position: 'relative', overflow: 'hidden' }}>
                    {/* Top Blue Bar */}
                    <div style={{ height: '4px', backgroundColor: '#0056b3', width: '100%' }}></div>
                    
                    <div className="p-3">
                        {/* Header Section */}
                        <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom border-secondary border-1">
                            <div className="d-flex align-items-center">
                                <div className="me-2 p-1 bg-light rounded-circle shadow-sm border border-primary">
                                    <Microscope size={32} color="#0056b3" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h1 className="fw-bolder mb-0" style={{ fontSize: '24px', color: '#0056b3', letterSpacing: '0.5px' }}>SMART PATHOLOGY LAB</h1>
                                    <div className="d-flex gap-2 fw-bold mt-0 text-uppercase" style={{ fontSize: '9px', letterSpacing: '1px' }}>
                                        <span style={{ color: '#333' }}>Accurate</span>
                                        <span className="text-secondary opacity-50">|</span>
                                        <span style={{ color: '#333' }}>Caring</span>
                                        <span className="text-secondary opacity-50">|</span>
                                        <span style={{ color: '#333' }}>Instant</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-end" style={{ fontSize: '9px' }}>
                                <div className="d-flex align-items-center justify-content-end mb-0">
                                    <Phone size={12} className="me-1 text-success" />
                                    <span className="fw-bold">0300-1234567 / 0311-7654321</span>
                                </div>
                                <div className="d-flex align-items-center justify-content-end mb-0">
                                    <Mail size={12} className="me-1 text-primary" />
                                    <span className="fw-bold">smartpatholab@gmail.com</span>
                                </div>
                                <div className="text-muted mt-1" style={{ maxWidth: '250px', fontSize: '8px' }}>
                                    Plot 12, Sector A, Near Medical Square, City Care Hospital Complex
                                </div>
                            </div>
                        </div>

                        {/* Patient & Lab Metadata Block */}
                        <div className="row g-0 mb-2 border border-secondary shadow-sm" style={{ fontSize: '10px' }}>
                            <div className="col-4 p-2 border-end border-secondary">
                                <h4 className="fw-bolder mb-1 text-uppercase" style={{ fontSize: '14px', color: '#000' }}>{
                                    patients.find(p => String(p.user_id) === String(selectedPatient))?.name || 
                                    (String(selectedPatient) === String(location.state?.patient_id) ? location.state?.patient_name : "GUEST")
                                }</h4>
                                <div className="mb-0 text-muted">Age / Sex : 21 Years / Male</div>
                                <div className="mb-0 text-muted">PID : #{selectedPatient || "555"}</div>
                            </div>
                            <div className="col-4 p-2 border-end border-secondary">
                                <div className="mb-1">
                                    <div className="fw-bold text-dark mb-0">Sample Collected At:</div>
                                    <div className="text-muted" style={{ lineHeight: '1.1', fontSize: '9px' }}>City Care Hospital, Lab Collection Point</div>
                                </div>
                                <div>
                                    <span className="fw-bold text-dark">Ref. By:</span> <span className="text-dark fw-bold">{doctorName}</span>
                                </div>
                            </div>
                            <div className="col-4 p-2 bg-light bg-opacity-10 text-end">
                                <div className="mb-0 d-flex justify-content-end">
                                    <div className="border border-dark px-1 bg-white" style={{ fontFamily: 'monospace', letterSpacing: '1px', fontSize: '8px' }}>
                                        |||| || |||| ||| ||
                                    </div>
                                </div>
                                <div className="mb-0"><span className="fw-bold text-dark">Reg:</span> <span className="text-muted">{new Date().toLocaleDateString()}</span></div>
                                <div className="mb-0"><span className="fw-bold text-dark">Col:</span> <span className="text-muted">{new Date().toLocaleDateString()}</span></div>
                                <div className="mb-0"><span className="fw-bold text-dark">Rep:</span> <span className="text-muted">{new Date().toLocaleDateString()}</span></div>
                            </div>
                        </div>

                        {/* Report Title */}
                        <div className="text-center mb-2">
                            <h2 className="fw-bold mb-0 text-uppercase" style={{ fontSize: '16px', borderBottom: '2px solid #000', display: 'inline-block', padding: '0 10px 2px' }}>
                                LABORATORY INVESTIGATION REPORT
                            </h2>
                        </div>

                        {/* Investigation Table */}
                        <div className="mb-5">
                            <table className="table table-bordered border-dark align-middle mb-4" style={{ fontSize: '13px' }}>
                                <thead className="bg-light">
                                    <tr className="fw-bold text-dark text-center">
                                        <th className="py-2" style={{ width: '35%' }}>Investigation / Test</th>
                                        <th className="py-2" style={{ width: '20%' }}>Result</th>
                                        <th className="py-2" style={{ width: '25%' }}>Reference Value</th>
                                        <th className="py-2" style={{ width: '20%' }}>Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTests.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center py-5 text-muted fst-italic">No tests selected for this report</td></tr>
                                    ) : (
                                        selectedTests.map((test, index) => (
                                            <tr key={index}>
                                                <td className="py-2 px-3 fw-bold text-dark">{test.name}</td>
                                                <td className="py-2 text-center fw-bolder" style={{ fontSize: '15px', color: '#0056b3' }}>
                                                    {(test.fee - test.discount).toFixed(0)}
                                                </td>
                                                <td className="py-2 text-center text-muted">
                                                    {test.name.includes("Vitamin") ? "30 - 100" : "13 - 48"}
                                                </td>
                                                <td className="py-2 text-center text-muted">
                                                    {test.name.includes("Vitamin") ? "ng/mL" : "mg/dL"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                            {/* Advisory Note */}
                        <div className="mt-2 p-2 bg-light rounded-0 border-start border-3 border-dark">
                            <h6 className="fw-bold mb-0 text-uppercase" style={{ fontSize: '10px' }}>Advice / Note:</h6>
                            <p className="mb-0 text-muted" style={{ fontSize: '9px', lineHeight: '1.2' }}>
                                Lab values should be correlated with the clinical picture. Results are valid for the provided sample.
                            </p>
                        </div>

                        {/* Final Signatures Section */}
                        <div className="row mt-3 pt-3 pb-3 gx-4">
                            <div className="col-4 text-center">
                                <div className="border-top border-dark mx-2 pt-1">
                                    <h6 className="fw-bold mb-0" style={{ fontSize: '11px' }}>Lab Technician</h6>
                                    <p className="text-muted mb-0" style={{ fontSize: '9px' }}>DMLT, BMLT</p>
                                </div>
                            </div>
                            <div className="col-4 text-center">
                                <div className="border-top border-dark mx-2 pt-1">
                                    <h6 className="fw-bold mb-0" style={{ fontSize: '11px' }}>{user?.name || "MD. Pathologist"}</h6>
                                    <p className="text-muted mb-0" style={{ fontSize: '9px' }}>MD, Pathology</p>
                                </div>
                            </div>
                            <div className="col-4 text-center">
                                <div className="border-top border-dark mx-2 pt-1">
                                    <h6 className="fw-bold mb-0" style={{ fontSize: '11px' }}>Dr. {doctorName}</h6>
                                    <p className="text-muted mb-0" style={{ fontSize: '9px' }}>MD, Referring</p>
                                </div>
                            </div>
                        </div>

                        {/* Info Strip */}
                        <div className="d-flex justify-content-between align-items-center text-muted mt-2 pt-1 border-top border-light" style={{ fontSize: '9px' }}>
                            <div>Generated: {new Date().toLocaleDateString()}</div>
                            <div className="fw-bold">Page 1 of 1</div>
                        </div>
                    </div>

                    {/* Bottom Accents */}
                    <div className="position-absolute bottom-0 w-100">
                        <div className="bg-primary text-white text-center py-1 d-flex align-items-center justify-content-center gap-3" style={{ height: '30px' }}>
                            <div className="fw-bold" style={{ fontSize: '11px' }}>FOR SAMPLE COLLECTION: +92 300 1234567</div>
                            <div className="fw-bolder" style={{ fontSize: '14px' }}>9123456789</div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #printable-receipt, #printable-receipt * { visibility: visible !important; }
                    #printable-receipt { 
                        display: block !important; 
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        background: white !important;
                        z-index: 99999 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .d-print-none, .modal, .sidebar, .navbar, .btn { display: none !important; }
                    * { 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    @page { margin: 0.5cm; size: portrait; }
                }
                .hover-opacity-100:hover { opacity: 1 !important; }
                .cursor-pointer { cursor: pointer; }
                .bg-light { background-color: #f8f9fa !important; }
            `}</style>
        </div>
    );
}

