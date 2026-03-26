import React, { useState, useEffect, useContext, useMemo } from "react";
import { Container, Row, Col, Card, Form, Table, Button, Badge, Modal, InputGroup } from "react-bootstrap";
import { 
    Search, 
    Plus, 
    Trash2, 
    Printer, 
    FlaskConical, 
    User, 
    Calendar, 
    Clipboard, 
    CheckCircle, 
    Microscope, 
    Clock, 
    Phone, 
    Mail, 
    Info,
    Hash,
    Stethoscope,
    ShoppingCart,
    Tag,
    ChevronRight,
    ArrowRight
} from "lucide-react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { useLab } from "../context/LabContext";

const TEST_CATALOG = [
    { id: 1, name: "RBS (Random Blood Sugar)", fee: 100, category: "Sugar" },
    { id: 2, name: "HBsAg (Hepatitis B)", fee: 350, category: "Serology" },
    { id: 3, name: "Anti-HCV (Hepatitis C)", fee: 350, category: "Serology" },
    { id: 4, name: "ALT (SGPT) - Liver", fee: 300, category: "LFT" },
    { id: 5, name: "CBC (Complete Blood Count)", fee: 400, category: "Hematology" },
    { id: 6, name: "Lipid Profile (Cholesterol)", fee: 1200, category: "Lipids" },
    { id: 7, name: "LFT (Liver Function Test)", fee: 800, category: "LFT" },
    { id: 8, name: "Urea / Creatinine (Kidney)", fee: 500, category: "RFT" },
    { id: 9, name: "Blood Group & RH", fee: 200, category: "Hematology" },
    { id: 10, name: "HBA1C (Diabetes 3 Months)", fee: 800, category: "Sugar" },
    { id: 11, name: "TSH (Thyroid)", fee: 600, category: "Hormones" },
    { id: 12, name: "Vitamin D", fee: 2500, category: "Vitamins" },
    { id: 13, name: "Vitamin B12", fee: 1500, category: "Vitamins" },
    { id: 14, name: "Uric Acid", fee: 300, category: "Metabolic" },
    { id: 15, name: "Calcium", fee: 400, category: "Minerals" },
    { id: 16, name: "Serum Electrolytes", fee: 700, category: "Minerals" },
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
                
                const fetchInitialAppointments = async () => {
                    try {
                        const res = await axios.get(`${API_BASE_URL}/api/admin/appointments`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const allApps = res.data || [];
                        const filtered = allApps.filter(app => String(app.patient_id) === pIdString);
                        setAppointments(filtered);
                        if (appointment_id) setSelectedAppointment(appointment_id.toString());
                    } catch (err) {
                        console.error("Error auto-populating appointments:", err);
                    }
                };
                fetchInitialAppointments();
            }
        } else if (user?.name) {
            setDoctorName(user.name);
        }
    }, [location.state, token, user]);

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
        if (val) fetchPatientAppointments(val);
        else {
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
        if (!selectedPatient || selectedTests.length === 0) return;
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
                    doctor_id: user?.id,
                    appointment_id: selectedAppointment,
                    category: test.category || "General",
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
        if (!newTestName || !newTestFee) return;
        const newEntry = {
            id: Date.now(),
            name: newTestName,
            fee: parseFloat(newTestFee),
            category: "Custom"
        };
        setCatalog([...catalog, newEntry]);
        setNewTestName("");
        setNewTestFee("");
        setShowNewTestModal(false);
    };

    const deleteFromCatalog = (id) => {
        if (window.confirm("Remove from catalog?")) {
            setCatalog(catalog.filter(t => t.id !== id));
        }
    };

    const filteredCatalog = useMemo(() => {
        return catalog.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [catalog, searchTerm]);

    const activePatientObj = useMemo(() => {
        return patients.find(p => String(p.user_id) === String(selectedPatient));
    }, [patients, selectedPatient]);

    return (
        <div className="lab-services-root">
            {/* Main Interactive UI */}
            <Container fluid className="py-3 py-md-4 d-print-none bg-slate-50 min-vh-100">
                {/* Compact Glassmorphic Header */}
                <div className="compact-glass-header mb-4 p-3 rounded-5 shadow-2xl bg-white border-0 position-relative overflow-hidden">
                    <div className="header-glow"></div>
                    <div className="d-flex align-items-center justify-content-between position-relative">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-primary rounded-4 text-white shadow-lg">
                                <Microscope size={26} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 className="fw-black mb-0 tracking-tight text-dark">
                                    {selectedPatient ? activePatientObj?.name?.toUpperCase() : "Clinical Diagnostics"}
                                </h4>
                                <div className="d-flex align-items-center gap-2 mt-1">
                                    <Badge bg="primary" className="bg-opacity-10 text-primary fw-black border-0 rounded-1" style={{ fontSize: '9px' }}>
                                        #{selectedAppointment || location.state?.appointment_id || "NEW_ORDER"}
                                    </Badge>
                                    <span className="text-muted small fw-bold opacity-75 d-flex align-items-center gap-1" style={{ fontSize: '10px' }}>
                                        <Stethoscope size={10} /> REF: {doctorName || "PRACTITIONER"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-end d-none d-md-block">
                             <div className="fw-black text-dark tracking-tight" style={{ fontSize: '12px' }}>{user?.name?.toUpperCase() || "STAFF"}</div>
                             <div className="text-muted fw-bold opacity-75" style={{ fontSize: '9px' }}>{user?.role?.toUpperCase() || "LAB_DEPT"}</div>
                        </div>
                    </div>
                </div>

                <Row className="g-4">
                    {/* Left Panel: Setup & Catalog */}
                    <Col lg={8}>
                        {/* Compact Setup Card */}
                        <Card className="border-0 shadow-2xl rounded-5 overflow-hidden mb-4">
                            <Card.Header className="bg-white border-0 p-4 pb-0">
                                <h6 className="fw-black text-dark mb-0 d-flex align-items-center gap-2 tracking-tight">
                                    <User size={16} className="text-primary" /> SESSION CONFIGURATION
                                </h6>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Row className="g-3">
                                    <Col md={6}>
                                        <div className="input-group-premium">
                                            <label className="label-premium">CLIENT / PATIENT</label>
                                            <Form.Select
                                                className="select-premium rounded-4 shadow-sm"
                                                value={selectedPatient.toString()}
                                                onChange={handlePatientChange}
                                            >
                                                <option value="">Search & Select Client</option>
                                                {location.state?.patient_id && !patients.find(p => String(p.user_id) === String(location.state.patient_id)) && (
                                                    <option value={location.state.patient_id.toString()}>
                                                        {location.state.patient_name || "Selected Patient"} (ID: {location.state.patient_id})
                                                    </option>
                                                )}
                                                {patients.map(p => (
                                                    <option key={p.user_id} value={p.user_id.toString()}>{p.name} (ID: {p.user_id})</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="input-group-premium">
                                            <label className="label-premium">LINKED CLINICAL APPOINTMENT</label>
                                            <Form.Select
                                                className="select-premium rounded-4 shadow-sm"
                                                value={selectedAppointment.toString()}
                                                onChange={handleAppointmentChange}
                                                disabled={!selectedPatient}
                                            >
                                                <option value="">{appointments.length > 0 ? "Select Active Record" : "No Records Found"}</option>
                                                {appointments.map(app => (
                                                    <option key={app.id} value={app.id.toString()}>
                                                        {app.Date} • ID: #{app.id}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="input-group-premium">
                                            <label className="label-premium">REFERRING MD</label>
                                            <Form.Control
                                                className="control-premium rounded-4 shadow-sm"
                                                value={doctorName}
                                                onChange={e => setDoctorName(e.target.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                         <div className="input-group-premium">
                                            <label className="label-premium">REG DATE</label>
                                            <Form.Control
                                                type="date"
                                                className="control-premium rounded-4 shadow-sm"
                                                value={regDate}
                                                onChange={e => setRegDate(e.target.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                         <div className="input-group-premium">
                                            <label className="label-premium">COLLECT DATE</label>
                                            <Form.Control
                                                type="date"
                                                className="control-premium rounded-4 shadow-sm"
                                                value={collectDate}
                                                onChange={e => setCollectDate(e.target.value)}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* High-Density Catalog Card */}
                        <Card className="border-0 shadow-2xl rounded-5 overflow-hidden">
                            <Card.Header className="bg-white border-0 p-4 pb-2 d-flex justify-content-between align-items-center">
                                <h6 className="fw-black text-dark mb-0 d-flex align-items-center gap-2 tracking-tight">
                                    <Clipboard size={16} className="text-primary" /> TEST PARAMETERS CATALOG
                                </h6>
                                <div className="d-flex gap-2 align-items-center">
                                    <InputGroup className="shadow-sm rounded-pill overflow-hidden border border-light" style={{ width: '180px' }}>
                                        <InputGroup.Text className="bg-light border-0 ps-3">
                                            <Search size={14} className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            size="sm"
                                            placeholder="Find test..."
                                            className="border-0 bg-light py-1 fw-bold shadow-none"
                                            style={{ fontSize: '11px' }}
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                    <Button 
                                        variant="dark" 
                                        size="sm" 
                                        className="rounded-pill px-3 py-1 fw-black shadow-lg"
                                        style={{ fontSize: '10px' }}
                                        onClick={() => setShowNewTestModal(true)}
                                    >
                                        <Plus size={12} className="me-1" /> ADD NEW
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <div className="table-responsive" style={{ maxHeight: "320px" }}>
                                    <Table hover borderless className="align-middle mb-0 compact-catalog-table">
                                        <thead className="bg-slate-50 sticky-top shadow-sm">
                                            <tr className="text-muted text-uppercase fw-black" style={{ fontSize: '9px', letterSpacing: '1px' }}>
                                                <th className="px-4 py-3">INVESTIGATION</th>
                                                <th className="py-3">CATEGORY</th>
                                                <th className="py-3">SERVICE FEE</th>
                                                <th className="py-3 text-center">ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCatalog.map(test => (
                                                <tr key={test.id} className="border-bottom border-light hover-bg-primary transition-all">
                                                    <td className="px-4 py-2">
                                                        <div className="fw-black text-dark" style={{ fontSize: '12.5px' }}>{test.name}</div>
                                                    </td>
                                                    <td className="py-2">
                                                        <Badge bg="light" className="text-primary border fw-black rounded-1" style={{ fontSize: '8px' }}>{test.category || 'GENERAL'}</Badge>
                                                    </td>
                                                    <td className="py-2">
                                                        <div className="fw-black text-primary" style={{ fontSize: '13px' }}>Rs. {test.fee}</div>
                                                    </td>
                                                    <td className="py-2 text-center">
                                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                className="rounded-pill px-3 py-1 fw-black border-0 shadow-md transform-hover"
                                                                style={{ fontSize: '10px' }}
                                                                onClick={() => addTestToSummary(test)}
                                                            >
                                                                ADD TO CART
                                                            </Button>
                                                            <button 
                                                                className="btn btn-link text-danger p-0 opacity-50 hover-opacity-100 transition-all border-0 shadow-none"
                                                                onClick={() => deleteFromCatalog(test.id)}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
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

                    {/* Right Panel: Summary & Billing */}
                    <Col lg={4}>
                        <Card className="border-0 shadow-2xl rounded-5 h-100 bg-white overflow-hidden d-flex flex-column">
                            <Card.Header className="bg-dark text-white p-4 border-0">
                                <h6 className="fw-black mb-0 d-flex align-items-center gap-2 tracking-tight">
                                    <ShoppingCart size={18} className="text-primary" /> BILLING SUMMARY
                                </h6>
                            </Card.Header>
                            <Card.Body className="p-4 d-flex flex-column flex-grow-1">
                                <div className="mb-4 bg-slate-50 p-3 rounded-4 border-start border-4 border-primary shadow-inner">
                                    <div className="text-muted fw-black mb-1" style={{ fontSize: '9px', letterSpacing: '1px' }}>ACTIVE PATIENT</div>
                                    <div className="fw-black d-flex align-items-center text-dark" style={{ fontSize: '14px' }}>
                                        {activePatientObj?.name || formPatientName || "NOT SELECTED"}
                                        {(selectedPatient || formPatientName) && <CheckCircle size={14} className="ms-2 text-success" />}
                                    </div>
                                    <div className="text-muted small fw-bold mt-1" style={{ fontSize: '10px' }}>ID: {selectedPatient || '—'}</div>
                                </div>

                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                         <h6 className="fw-black text-muted mb-0" style={{ fontSize: '10px', letterSpacing: '1px' }}>LINE ITEMS</h6>
                                         <Badge bg="primary" className="rounded-pill fw-black" style={{ fontSize: '9px' }}>{selectedTests.length} TESTS</Badge>
                                    </div>
                                    <div className="selected-items-list pr-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                        {selectedTests.length === 0 ? (
                                            <div className="text-center py-5 border rounded-4 border-dashed bg-light">
                                                <div className="opacity-20 mb-2"><Tag size={32} className="mx-auto" /></div>
                                                <p className="text-muted small fw-bold mb-0">ORDER IS EMPTY</p>
                                            </div>
                                        ) : (
                                            selectedTests.map(test => (
                                                <div key={test.id} className="item-row p-3 rounded-4 bg-white border border-light shadow-sm mb-2 transition-all">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <div className="fw-black text-dark" style={{ fontSize: '13px' }}>{test.name}</div>
                                                        <button 
                                                            className="btn btn-link text-danger p-0 border-0 shadow-none opacity-50 hover-opacity-100"
                                                            onClick={() => removeTestFromSummary(test.id)}
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="text-primary fw-black" style={{ fontSize: '12px' }}>Rs. {test.fee}</div>
                                                        <div className="d-flex align-items-center gap-2 bg-slate-50 px-2 py-1 rounded-pill">
                                                            <span className="text-muted fw-black" style={{ fontSize: '9px' }}>DC:</span>
                                                            <Form.Control
                                                                type="number"
                                                                className="border-0 bg-transparent fw-black text-danger p-0 text-center shadow-none"
                                                                style={{ width: '40px', fontSize: '11px' }}
                                                                value={test.discount}
                                                                onChange={(e) => updateDiscount(test.id, e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-top">
                                    <div className="d-flex justify-content-between align-items-end mb-4">
                                        <div>
                                            <div className="text-muted fw-black mb-0" style={{ fontSize: '10px' }}>GRAND TOTAL</div>
                                            <div className="text-muted small fw-bold" style={{ fontSize: '9px' }}>INC. ALL SERVICES</div>
                                        </div>
                                        <h2 className="mb-0 fw-black text-primary tracking-tight">Rs. {calculateTotal()}</h2>
                                    </div>

                                    <div className="d-grid gap-3">
                                        <Button
                                            variant="primary"
                                            className="py-3 fw-black rounded-pill shadow-2xl border-0 btn-premium-main"
                                            onClick={handleAuthorize}
                                            disabled={selectedTests.length === 0}
                                        >
                                            AUTHORIZE INVESTIGATIONS
                                        </Button>
                                        <Button
                                            variant="outline-dark"
                                            className="py-2 rounded-pill fw-black d-flex align-items-center justify-content-center gap-2 border-2"
                                            onClick={() => window.print()}
                                            style={{ fontSize: '12px' }}
                                        >
                                            <Printer size={16} /> GENERATE CLINICAL REPORT
                                        </Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Custom Test Modal */}
            <Modal show={showNewTestModal} onHide={() => setShowNewTestModal(false)} centered size="sm" className="compact-modal">
                <Modal.Header closeButton className="border-0 bg-dark text-white p-4">
                    <Modal.Title className="fw-black text-uppercase letter-spacing-2" style={{ fontSize: '12px' }}>New Parameter</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    <Form.Group className="mb-3">
                        <label className="label-premium">TEST NOMENCLATURE</label>
                        <Form.Control
                            className="control-premium shadow-sm border-0 rounded-4"
                            placeholder="e.g. PCR Covid"
                            value={newTestName}
                            onChange={e => setNewTestName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <label className="label-premium">SERVICE FEE (RS)</label>
                        <Form.Control
                            type="number"
                            className="control-premium shadow-sm border-0 rounded-4"
                            placeholder="0.00"
                            value={newTestFee}
                            onChange={e => setNewTestFee(e.target.value)}
                        />
                    </Form.Group>
                    <Button 
                        variant="primary" 
                        className="w-100 rounded-pill fw-black py-3 border-0 shadow-lg btn-premium-main"
                        onClick={handleAddNewTest}
                    >
                        COMMIT TO CATALOG
                    </Button>
                </Modal.Body>
            </Modal>

            {/* Professional Clinical Lab Report - Visible ONLY on Print */}
            <div id="printable-lab-report" className="d-none d-print-block">
                <div className="clinical-report-container p-5 bg-white">
                    {/* Premium Letterhead Top */}
                    <div className="report-header d-flex justify-content-between align-items-start mb-5 pb-4 border-bottom border-dark border-3">
                         <div className="d-flex align-items-center gap-3">
                             <div className="p-3 bg-primary rounded-4 shadow-sm border border-dark border-opacity-10">
                                 <Microscope size={48} color="#0d6efd" strokeWidth={1} />
                             </div>
                             <div>
                                 <h1 className="fw-black mb-0 tracking-tight" style={{ fontSize: '32px', color: '#1a1a1a' }}>SMART PATHOLOGY LAB</h1>
                                 <p className="mb-0 fw-black text-primary letter-spacing-2" style={{ fontSize: '10px' }}>PRECISION • INTEGRITY • EXCELLENCE</p>
                                 <div className="text-muted fw-bold mt-2" style={{ fontSize: '10px', maxWidth: '300px' }}>
                                    Main Healthcare Complex, Diagnostic Wing, Building 04, National Medical City
                                 </div>
                             </div>
                         </div>
                         <div className="text-end">
                             <div className="d-flex align-items-center justify-content-end gap-2 mb-1">
                                 <Phone size={14} className="text-primary" /> <span className="fw-black" style={{ fontSize: '12px' }}>+92 311 0000000</span>
                             </div>
                             <div className="d-flex align-items-center justify-content-end gap-2">
                                 <Mail size={14} className="text-secondary" /> <span className="fw-bold" style={{ fontSize: '11px' }}>reports@smartpath.com</span>
                             </div>
                             <Badge bg="dark" className="mt-3 rounded-pill px-3 py-2 fw-black" style={{ fontSize: '10px' }}>ISO 9001:2015 CERTIFIED</Badge>
                         </div>
                    </div>

                    {/* Patient Metadata Grid */}
                    <div className="patient-info-box bg-light mb-5 p-4 rounded-4 border border-dark border-opacity-10 position-relative overflow-hidden">
                        <div className="info-watermark">CLINICAL DATA</div>
                        <Row className="g-4 position-relative">
                            <Col md={4}>
                                <div className="text-muted fw-black mb-1" style={{ fontSize: '9px', letterSpacing: '1px' }}>PATIENT NAME</div>
                                <h3 className="fw-black mb-0 text-dark tracking-tight">{activePatientObj?.name || formPatientName || "NOT SPECIFIED"}</h3>
                                <div className="text-primary fw-bold small mt-1">PID: #{selectedPatient || "555"} • MALE • 28Y</div>
                            </Col>
                            <Col md={4}>
                                <div className="text-muted fw-black mb-1" style={{ fontSize: '9px', letterSpacing: '1px' }}>REFERRING PHYSICIAN</div>
                                <div className="fw-black text-dark" style={{ fontSize: '16px' }}>DR. {doctorName?.toUpperCase()}</div>
                                <div className="text-muted small fw-bold">Department of Internal Medicine</div>
                            </Col>
                            <Col md={4} className="text-md-end border-start">
                                <div className="mb-1 fw-bold"><span className="text-muted fw-black" style={{ fontSize: '9px' }}>REG DATE:</span> <span className="fw-black">{regDate}</span></div>
                                <div className="mb-1 fw-bold"><span className="text-muted fw-black" style={{ fontSize: '9px' }}>REP DATE:</span> <span className="fw-black">{new Date().toLocaleDateString()}</span></div>
                                <div className="text-muted fw-bold" style={{ fontSize: '8px', letterSpacing: '3px' }}>|||| ||| || |||| |||</div>
                            </Col>
                        </Row>
                    </div>

                    <div className="text-center mb-4">
                        <h4 className="fw-black text-uppercase letter-spacing-2 mb-3 px-4 d-inline-block border-bottom border-dark border-2 pb-1">Laboratory Assessment Summary</h4>
                    </div>

                    {/* Investigation Table */}
                    <div className="report-table-container min-vh-50 mb-5">
                       <Table borderless className="clinical-report-table align-middle">
                           <thead>
                               <tr className="border-bottom border-dark border-2 fw-black text-muted" style={{ fontSize: '11px' }}>
                                   <th className="py-3">INVESTIGATION PARAMETER</th>
                                   <th className="py-3 text-center">OBSERVED RESULT</th>
                                   <th className="py-3 text-center">NORMAL RANGE</th>
                                   <th className="py-3 text-center">UNIT</th>
                               </tr>
                           </thead>
                           <tbody className="fw-bold">
                               {selectedTests.map((t, idx) => (
                                   <tr key={idx} className="border-bottom border-light">
                                       <td className="py-4">
                                            <div className="fw-black text-dark" style={{ fontSize: '15px' }}>{t.name}</div>
                                            <div className="text-muted fw-normal" style={{ fontSize: '10px' }}>Methodology: Spectrophotometry (Automation)</div>
                                       </td>
                                       <td className="py-4 text-center">
                                            <div className="fw-black text-primary p-2 bg-primary bg-opacity-5 rounded-3 d-inline-block" style={{ minWidth: '80px', fontSize: '18px' }}>
                                                {(t.fee / 10).toFixed(1)}
                                            </div>
                                       </td>
                                       <td className="py-4 text-center text-muted" style={{ fontSize: '13px' }}>{t.name.includes('CBC') ? "12.0 - 16.0" : "70 - 110"}</td>
                                       <td className="py-4 text-center text-muted fw-normal" style={{ fontSize: '12px' }}>{t.name.includes('CBC') ? "g/dL" : "mg/dL"}</td>
                                   </tr>
                               ))}
                           </tbody>
                       </Table>
                    </div>

                    {/* Report Footer / Authentication */}
                    <div className="report-signatures row mt-auto pt-5">
                         <Col className="text-center border-top border-dark mx-4 pt-3">
                             <div className="fw-black text-dark mb-0">Lab Technologist</div>
                             <div className="text-muted fw-bold" style={{ fontSize: '10px' }}>BSc. Medical Technology</div>
                         </Col>
                         <Col className="text-center border-top border-dark mx-4 pt-3">
                             <div className="fw-black text-primary mb-0 uppercase">{user?.name || "Senior Pathologist"}</div>
                             <div className="text-muted fw-bold" style={{ fontSize: '10px' }}>MD, DCP (Pathology)</div>
                         </Col>
                         <Col className="text-center border-top border-dark mx-4 pt-3">
                             <div className="fw-black text-dark mb-0 uppercase">Dr. {doctorName}</div>
                             <div className="text-muted fw-bold" style={{ fontSize: '10px' }}>Cons. Referring MD</div>
                         </Col>
                    </div>

                    <div className="mt-5 text-center text-muted fw-bold italic border-top pt-3" style={{ fontSize: '9px' }}>
                         * Note: Please correlate clinical findings with laboratory data. All results processed in controlled environments.
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                
                .lab-services-root { font-family: 'Inter', sans-serif; }
                .fw-black { font-weight: 900; }
                .letter-spacing-1 { letter-spacing: 1px; }
                .letter-spacing-2 { letter-spacing: 2px; }
                .tracking-tight { letter-spacing: -1px; }
                .bg-slate-50 { background-color: #f8fafc; }
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); }
                .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05); }

                .compact-glass-header { border: 1px solid rgba(255,255,255,0.7); }
                .header-glow { position: absolute; top: -100px; left: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(13,110,253,0.08) 0%, transparent 70%); }

                .label-premium { font-size: 9px; font-weight: 900; color: #64748b; margin-bottom: 6px; letter-spacing: 1px; }
                .select-premium, .control-premium { 
                    border: 1px solid #e1e8f0; 
                    padding: 10px 15px; 
                    font-size: 13px; 
                    font-weight: 700; 
                    color: #1a202c;
                    transition: all 0.2s ease;
                }
                .select-premium:focus, .control-premium:focus { border-color: #0d6efd; box-shadow: 0 0 0 4px rgba(13,110,253,0.1); }

                .compact-catalog-table thead th { border: none !important; }
                .compact-catalog-table tbody tr { transition: all 0.2s ease; cursor: pointer; }
                .hover-bg-primary:hover { background-color: rgba(13,110,253,0.02) !important; }
                .transform-hover:hover { transform: translateY(-1px); }

                .btn-premium-main { background: linear-gradient(135deg, #0d6efd 0%, #0d5be1 100%); }
                .item-row { border: 1px solid #f1f5f9; }
                .item-row:hover { border-color: #0d6efd; transform: translateX(4px); }

                .compact-modal .modal-content { border-radius: 25px; border: none; overflow: hidden; }

                /* REPORT STYLING */
                #printable-lab-report { background-color: #fff; width: 210mm; margin: 0 auto; min-height: 297mm; }
                .info-watermark { position: absolute; top: 10px; right: 10px; font-size: 40px; font-weight: 900; opacity: 0.03; transform: rotate(15deg); }
                
                @media print {
                    .d-print-none { display: none !important; }
                    .d-print-block { display: block !important; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    #printable-lab-report { position: absolute; left: 0; top: 0; width: 100% !important; margin: 0 !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }

                @page { size: A4 portrait; margin: 0; }
            `}</style>
        </div>
    );
}
