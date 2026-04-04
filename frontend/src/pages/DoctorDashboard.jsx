import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../css/DoctorDashboard.css";
import {
    User,
    Settings,
    Calendar,
    MessageSquare,
    FlaskConical,
    ShieldCheck,
    ClipboardCheck,
    UserX,
    Plus,
    CheckCircle,
    Clock,
    FileText,
    Eye,
    Edit,
    Trash2,
    Phone,
    Camera,
    Activity,
    Zap,
    ExternalLink,
    Filter,
    Search,
    Pill
} from "lucide-react";
import { Modal, Form, Row, Col, Badge, Card, Button as BootstrapButton, Table, InputGroup } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [labReports, setLabReports] = useState([]);
    const [profile, setProfile] = useState({});
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingProfile, setEditingProfile] = useState({
        specialization: "",
        contact_info: "",
        departmentId: "",
        fieldId: "",
        phone: "",
        fee: "",
        whatsappNumber: "",
        imageFile: null
    });

    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [editFormData, setEditFormData] = useState({
        Date: "",
        Time: "",
        status: ""
    });
    const [showMedicationModal, setShowMedicationModal] = useState(false);
    const [medicationData, setMedicationData] = useState({
        reportId: "",
        medication: ""
    });
    const [submittingMedication, setSubmittingMedication] = useState(false);

    const { token, user } = useContext(AuthContext);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const fetchData = async () => {
        try {
            const [appRes, profileRes, labRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/doctor/appointments`, { headers }),
                axios.get(`${API_BASE_URL}/api/doctor/profile`, { headers }),
                axios.get(`${API_BASE_URL}/api/lab/reports`, { headers }).catch(err => ({ data: [] }))
            ]);

            setAppointments(appRes.data || []);
            setProfile(profileRes.data || {});
            setLabReports(labRes.data || []);

            setEditingProfile({
                specialization: profileRes.data?.specialization || "",
                contact_info: profileRes.data?.contact_info || "",
                departmentId: profileRes.data?.department_id || "",
                fieldId: profileRes.data?.field_id || "",
                phone: profileRes.data?.phone || "",
                fee: profileRes.data?.fee || "",
                whatsappNumber: profileRes.data?.whatsapp_number || "",
                imageFile: null
            });
        } catch (err) {
            console.error("Error fetching doctor data", err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`${API_BASE_URL}/api/doctor/appointments/${id}/status`, { status }, { headers });
            fetchData();
        } catch (err) {
            alert("Error updating status");
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("specialization", editingProfile.specialization);
        formData.append("contact_info", editingProfile.contact_info);
        formData.append("departmentId", editingProfile.departmentId);
        formData.append("fieldId", editingProfile.fieldId);
        formData.append("phone", editingProfile.phone);
        formData.append("fee", editingProfile.fee);
        formData.append("whatsappNumber", editingProfile.whatsappNumber);
        if (editingProfile.imageFile) {
            formData.append("image", editingProfile.imageFile);
        }

        try {
            await axios.put(`${API_BASE_URL}/api/doctor/profile`, formData, {
                headers: { ...headers, "Content-Type": "multipart/form-data" }
            });
            setShowProfileModal(false);
            fetchData();
        } catch (err) {
            alert("Error updating profile");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this appointment?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/appointments/${id}`, { headers });
            fetchData();
        } catch (err) {
            alert("Error deleting appointment");
        }
    };

    const handleEditClick = (app) => {
        if (!app) return;
        setSelectedApp(app);
        const appDate = app.Date || app.appointment_date || new Date().toISOString();
        setEditFormData({
            Date: appDate.split('T')[0],
            Time: app.Time || "10:00",
            status: app.status || "scheduled"
        });
        setShowEditModal(true);
    };

    const handleUpdateAppointment = async (e) => {
        if (e) e.preventDefault();
        if (!selectedApp || !selectedApp.id) {
            alert("No appointment selected");
            return;
        }
        try {
            await axios.put(`${API_BASE_URL}/api/appointments/${selectedApp.id}`, editFormData, { headers });
            setShowEditModal(false);
            fetchData();
        } catch (err) {
            console.error("Update error:", err);
            alert("Error updating appointment");
        }
    };

    const handleViewClick = (app) => {
        setSelectedApp(app);
        setShowViewModal(true);
    };

    const handlePrescriptionClick = (report) => {
        setMedicationData({
            reportId: report.id,
            medication: report.medication_given || ""
        });
        setShowMedicationModal(true);
    };

    const handleSaveMedication = async (e) => {
        e.preventDefault();
        setSubmittingMedication(true);
        try {
            await axios.put(`${API_BASE_URL}/api/lab/medication/${medicationData.reportId}`, {
                medication: medicationData.medication
            }, { headers });
            setShowMedicationModal(false);
            fetchData();
        } catch (err) {
            alert("Error saving medication");
        } finally {
            setSubmittingMedication(false);
        }
    };

    const filteredReports = useMemo(() => {
        return labReports.filter(r => 
            (r.patient_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.test_name || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [labReports, searchTerm]);

    return (
        <div className="doctor-dashboard-root min-vh-100 py-4 px-3 px-xl-5 bg-slate-50">
            {/* High-End Welcome Header */}
            <div className="welcome-banner mb-4 p-4 p-md-5 rounded-5 bg-white shadow-2xl position-relative overflow-hidden border border-light">
                <div className="banner-accent"></div>
                <Row className="align-items-center g-4 position-relative">
                    <Col lg={7}>
                        <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-3 mb-md-0 text-center text-md-start">
                            <div className="profile-img-container rounded-circle bg-white" style={{ 
                                width: "90px", height: "90px", padding: "3px",
                                marginTop: "10px", marginBottom: "5px",
                                boxShadow: "0 0 0 3px #198754, 0 0 0 6px #0d6efd, 0 0 0 9px #212529" 
                            }}>
                                <img
                                    src={profile.image ? `${API_BASE_URL}${profile.image}` : "https://img.icons8.com/color/96/doctor-male.png"}
                                    alt="Doctor"
                                    className="rounded-circle w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div>
                                <h1 className="fw-black text-dark fst-italic tracking-tight mb-2" style={{ whiteSpace: "nowrap", fontSize: "clamp(1.3rem, 4vw, 2rem)" }}>
                                    Welcome, Dr. {profile.name}
                                </h1>
                                <div className="d-flex flex-wrap justify-content-center justify-content-md-start align-items-center gap-3">
                                    <Badge bg="primary" className="bg-opacity-10 text-primary rounded-pill px-4 py-2 fw-black" style={{ fontSize: '13px' }}>
                                        {profile.specialization || "General Physician"}
                                    </Badge>
                                    <div className="d-flex align-items-center gap-2 text-success fw-bold" style={{ fontSize: '13px' }}>
                                       <Zap size={16} /> ON-DUTY / ACTIVE
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={5} className="text-lg-end mt-4 mt-lg-0">
                        <div className="d-flex flex-wrap gap-3 justify-content-lg-end">
                            <BootstrapButton variant="dark" size="lg" className="rounded-pill px-4 py-2 fw-black border-0 shadow-lg d-flex align-items-center gap-2 hover-lift" style={{ fontSize: '12px' }} onClick={() => navigate("/doctor-lab")}>
                                <FlaskConical size={18} /> ORDER INVESTIGATION
                            </BootstrapButton>
                            <BootstrapButton variant="primary" size="lg" className="rounded-pill px-4 py-2 fw-black border-0 shadow-lg btn-premium-sky d-flex align-items-center gap-2 hover-lift" style={{ fontSize: '12px' }} onClick={() => setShowProfileModal(true)}>
                                <Settings size={18} /> SETTINGS
                            </BootstrapButton>
                        </div>
                    </Col>
                </Row>
            </div>

            <div className="row g-4">
                {/* Main Content Area */}
                <div className="col-xl-9 col-lg-8">
                    {/* Appointments Section */}
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 border border-light">
                        <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center border-bottom border-light">
                            <h5 className="fw-black mb-0 d-flex align-items-center h5 tracking-tight text-dark">
                                <Calendar className="text-primary me-2" size={20} /> PATIENT QUEUE
                            </h5>
                            <Badge bg="dark" className="rounded-pill px-4 py-2 fw-black shadow-sm" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                {(appointments || []).filter(a => a.status === 'scheduled').length} SCHEDULED
                            </Badge>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {/* Desktop Table View */}
                            <div className="table-responsive d-none d-md-block" style={{ maxHeight: "400px" }}>
                                <Table hover borderless className="align-middle mb-0">
                                    <thead>
                                        <tr className="bg-slate-50 text-muted text-uppercase fw-black" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                            <th className="px-4 py-3">Patient Index</th>
                                            <th className="py-3">Slot</th>
                                            <th className="py-3">Status</th>
                                            <th className="py-3 text-end px-4">Intervention</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted fw-bold">Queue is clear.</td>
                                            </tr>
                                        ) : (
                                            appointments.map((app) => (
                                                <tr key={app.id} className="border-bottom border-light transition-all hover-lift-subtle">
                                                    <td className="px-4 py-3">
                                                        <div className="fw-black text-dark" style={{ fontSize: '14px' }}>{app.Patient || app.patient_name}</div>
                                                        <div className="text-muted fw-bold mt-1" style={{ fontSize: '11px' }}>PID: {app.patient_id || `APP-${app.id}`}</div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="d-flex flex-column gap-1">
                                                            <div className="fw-black text-dark" style={{ fontSize: '13px' }}>
                                                                <Clock size={14} className="me-1 text-primary" /> {app.Time || '10:00'}
                                                            </div>
                                                            <div className="text-muted fw-bold" style={{ fontSize: '12px' }}>
                                                                {app.Date ? app.Date.split('T')[0] : 'Today'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge bg={app.status === 'completed' ? 'success' : 'warning'} className="bg-opacity-10 text-success fw-black rounded-pill px-3 py-1 border-0" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                                            {app.status?.toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 text-end px-4">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <BootstrapButton variant="primary" size="sm" className="rounded-3 p-2 btn-premium-sky border-0 shadow-sm" title="Order Lab Test" onClick={() => navigate("/doctor-lab", { state: { ...app, doctor_name: profile.name } })}>
                                                                <FlaskConical size={16} />
                                                            </BootstrapButton>
                                                            <BootstrapButton variant="light" size="sm" className="rounded-3 p-2 border shadow-sm text-dark hover-lift" title="View Patient" onClick={() => handleViewClick(app)}>
                                                                <Eye size={16} />
                                                            </BootstrapButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="d-block d-md-none p-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                {appointments.length === 0 ? (
                                    <div className="text-center py-5 text-muted fw-bold">Queue is clear.</div>
                                ) : (
                                    appointments.map((app) => (
                                        <div key={`mob-${app.id}`} className="bg-white rounded-4 p-3 mb-3 shadow-sm border border-primary position-relative" style={{ borderWidth: '2px !important' }}>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <div className="fw-black text-dark" style={{ fontSize: '16px' }}>{app.Patient || app.patient_name}</div>
                                                    <div className="text-muted fw-bold mt-1" style={{ fontSize: '11px' }}>PID: {app.patient_id || `APP-${app.id}`}</div>
                                                </div>
                                                <Badge bg={app.status === 'completed' ? 'success' : 'warning'} className="bg-opacity-10 text-success fw-black rounded-pill px-3 py-1 border-0" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                                    {app.status?.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <div className="fw-black text-dark" style={{ fontSize: '14px' }}>
                                                    <Clock size={16} className="me-1 text-primary" /> {app.Time || '10:00'}
                                                </div>
                                                <div className="text-muted fw-bold" style={{ fontSize: '12px' }}>
                                                    {app.Date ? app.Date.split('T')[0] : 'Today'}
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2 border-top border-light pt-3">
                                                <BootstrapButton variant="primary" size="sm" className="rounded-3 p-2 btn-premium-sky border-0 shadow-sm" title="Order Lab Test" onClick={() => navigate("/doctor-lab", { state: { ...app, doctor_name: profile.name } })}>
                                                    <FlaskConical size={18} />
                                                </BootstrapButton>
                                                <BootstrapButton variant="light" size="sm" className="rounded-3 p-2 border shadow-sm text-dark hover-lift bg-white" title="View Patient" onClick={() => handleViewClick(app)}>
                                                    <Eye size={18} />
                                                </BootstrapButton>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Lab Results & Reports */}
                    <Card id="lab-reports-section" className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 border border-light">
                        <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center border-bottom border-light">
                            <h5 className="fw-black mb-0 d-flex align-items-center h5 tracking-tight text-dark">
                                <Activity className="text-primary me-2" size={20} /> INVESTIGATION LOG & REPORTS
                            </h5>
                            <InputGroup className="shadow-sm rounded-pill overflow-hidden border border-light" style={{ maxWidth: '220px' }}>
                                <InputGroup.Text className="bg-white border-0 ps-3">
                                    <Search size={14} className="text-muted" />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Filter reports..."
                                    className="border-0 bg-white py-2 fw-bold shadow-none"
                                    style={{ fontSize: '13px' }}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {/* Desktop Table View */}
                            <div className="table-responsive d-none d-md-block" style={{ maxHeight: "450px" }}>
                                <Table hover borderless className="align-middle mb-0">
                                    <thead className="bg-slate-50 text-muted text-uppercase fw-black" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                        <tr>
                                            <th className="px-4 py-3">Clinical Client</th>
                                            <th className="py-3">Investigation Details</th>
                                            <th className="py-3 text-center">Outcome</th>
                                            <th className="py-3 text-center">Rx Status</th>
                                            <th className="py-3 text-end px-4">Intervention</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReports.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-muted fw-bold">Archive empty or no results matching search.</td>
                                            </tr>
                                        ) : (
                                            filteredReports.map((report) => (
                                                <tr key={report.id} className="border-bottom border-light transition-all hover-lift-subtle">
                                                    <td className="px-4 py-3">
                                                        <div className="fw-black text-dark" style={{ fontSize: '14px' }}>{report.patient_name}</div>
                                                        <div className="text-muted fw-bold mt-1" style={{ fontSize: '11px' }}>DATE: {new Date(report.date || report.created_at).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{report.test_name || "General"}</div>
                                                        <Badge bg="primary" className="bg-opacity-10 text-primary fw-black rounded-pill px-3 py-1 mt-1 border-0" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>PATHOLOGY</Badge>
                                                    </td>
                                                    <td className="py-3 text-center">
                                                        <div className={`px-3 py-2 rounded-pill fw-black text-white ${report.status === 'done' ? 'bg-primary shadow-sm' : 'bg-warning text-dark'}`} style={{ fontSize: '12px', minWidth: '80px', display: 'inline-block' }}>
                                                            {report.status === 'done' ? (report.result || "NORMAL") : "PENDING"}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-center">
                                                        {report.medication_given ? (
                                                            <div className="text-success fw-bold d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '12px' }}>
                                                                <CheckCircle size={14} /> PRESCRIBED
                                                            </div>
                                                        ) : (
                                                            <div className="text-muted fw-bold opacity-50" style={{ fontSize: '12px' }}>---</div>
                                                        )}
                                                    </td>
                                                    <td className="py-3 text-end px-4">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            {report.status === 'done' && (
                                                                <BootstrapButton variant="outline-primary" size="sm" className="rounded-3 p-2 bg-white shadow-sm" title="Rx Pad" onClick={() => handlePrescriptionClick(report)}>
                                                                    <ClipboardCheck size={16} />
                                                                </BootstrapButton>
                                                            )}
                                                            {report.appointment_id && (
                                                                <BootstrapButton variant="primary" size="sm" className="rounded-3 p-2 btn-premium-sky border-0 shadow-sm" title="E-Chart" onClick={() => window.open(`/medical-report/${report.appointment_id}`, '_blank')}>
                                                                    <FileText size={16} />
                                                                </BootstrapButton>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="d-block d-md-none p-3" style={{ maxHeight: "450px", overflowY: "auto" }}>
                                {filteredReports.length === 0 ? (
                                    <div className="text-center py-5 text-muted fw-bold">Archive empty or no results matching search.</div>
                                ) : (
                                    filteredReports.map((report) => (
                                        <div key={`mob-${report.id}`} className="bg-white rounded-4 p-3 mb-3 shadow-sm border border-primary position-relative" style={{ borderWidth: '2px !important' }}>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <div className="fw-black text-dark" style={{ fontSize: '16px' }}>{report.patient_name}</div>
                                                    <div className="text-muted fw-bold mt-1" style={{ fontSize: '11px' }}>DATE: {new Date(report.date || report.created_at).toLocaleDateString()}</div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-pill fw-black text-white ${report.status === 'done' ? 'bg-primary shadow-sm' : 'bg-warning text-dark'}`} style={{ fontSize: '10px' }}>
                                                    {report.status === 'done' ? (report.result || "NORMAL") : "PENDING"}
                                                </div>
                                            </div>
                                            
                                            <div className="mb-3 d-flex align-items-center gap-2">
                                                <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{report.test_name || "General"}</div>
                                                <Badge bg="primary" className="bg-opacity-10 text-primary fw-black rounded-pill px-3 py-1 border-0" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>PATHOLOGY</Badge>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center border-top border-light pt-3 mt-1">
                                                <div>
                                                    {report.medication_given ? (
                                                        <div className="text-success fw-bold d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                                                            <CheckCircle size={14} /> PRESCRIBED
                                                        </div>
                                                    ) : (
                                                        <div className="text-muted fw-bold opacity-50" style={{ fontSize: '12px' }}>---</div>
                                                    )}
                                                </div>
                                                <div className="d-flex gap-2">
                                                    {report.status === 'done' && (
                                                        <BootstrapButton variant="outline-primary" size="sm" className="rounded-3 p-2 bg-white shadow-sm" title="Rx Pad" onClick={() => handlePrescriptionClick(report)}>
                                                            <ClipboardCheck size={18} />
                                                        </BootstrapButton>
                                                    )}
                                                    {report.appointment_id && (
                                                        <BootstrapButton variant="primary" size="sm" className="rounded-3 p-2 btn-premium-sky border-0 shadow-sm" title="E-Chart" onClick={() => window.open(`/medical-report/${report.appointment_id}`, '_blank')}>
                                                            <FileText size={18} />
                                                        </BootstrapButton>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Vertical Profile Segment */}
                <div className="col-xl-3 col-lg-4">
                    <Card className="border-0 shadow-sm rounded-4 mb-4 border border-light">
                        <Card.Body className="p-3 text-center">
                            <h6 className="fw-black mb-3 text-uppercase tracking-tight text-dark" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                <ShieldCheck size={16} className="text-primary me-1" /> Clinical Profile
                            </h6>
                            <div className="p-3 bg-slate-50 rounded-4 border border-light mb-3">
                                <span className="text-muted fw-black text-uppercase d-block mb-1" style={{ fontSize: '9px', letterSpacing: '1px' }}>Credentials</span>
                                <div className="fw-black text-dark h6 mb-0">{profile.specialization || "CONSULTANT"}</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-4 border border-light mb-3">
                                <span className="text-muted fw-black text-uppercase d-block mb-1" style={{ fontSize: '9px', letterSpacing: '1px' }}>Contact</span>
                                <div className="fw-black text-dark" style={{ fontSize: '13px' }}>{profile.phone || "---"}</div>
                            </div>
                            <div className="p-3 bg-primary bg-opacity-10 rounded-4 border border-primary border-opacity-25 mb-3">
                                <span className="text-primary fw-black text-uppercase d-block mb-1" style={{ fontSize: '9px', letterSpacing: '1px' }}>Consultation Fee</span>
                                <div className="fw-black text-primary tracking-tight h4 mb-0">Rs. {profile.fee || "500"}</div>
                            </div>
                            <BootstrapButton variant="dark" className="w-100 rounded-pill fw-black shadow-sm py-2 hover-lift d-flex justify-content-center align-items-center gap-2" style={{ fontSize: '11px' }} onClick={() => setShowProfileModal(true)}>
                                <Edit size={14} /> EDIT PROFILE
                            </BootstrapButton>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden border border-primary bg-primary bg-opacity-10 position-relative">
                       <Card.Body className="p-3 text-center">
                          <Activity size={24} className="text-primary mb-2 opacity-75 mx-auto" />
                          <h6 className="fw-black text-dark mb-1 h6">Smart Hub</h6>
                          <p className="text-muted fw-bold mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>All reports are end-to-end encrypted.</p>
                       </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Keeping Modals for compact redesign */}
            
            {/* View Patient Details Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton className="border-0 bg-dark text-white p-3">
                    <Modal.Title className="fw-black h6 mb-0 text-uppercase letter-spacing-1">
                        <User size={18} className="me-2 text-primary" /> Patient Record Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    {selectedApp && (
                        <div className="d-flex flex-column gap-3">
                            <div className="p-3 bg-white rounded-4 shadow-sm border border-light text-center">
                                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-2">
                                    <User size={30} />
                                </div>
                                <h4 className="fw-black text-dark mb-0 h5 text-uppercase">{selectedApp.Patient || selectedApp.patient_name || 'UNKNOWN'}</h4>
                                <Badge bg="dark" className="mt-2 text-uppercase" style={{ fontSize: '10px' }}>
                                    PID: {selectedApp.patient_id || `APP-${selectedApp.id}`}
                                </Badge>
                            </div>
                            <Row className="g-3">
                                <Col xs={6}>
                                    <div className="p-3 bg-white rounded-3 shadow-sm border border-light h-100">
                                        <div className="text-muted fw-bold text-uppercase" style={{ fontSize: '9px' }}>Contact Details</div>
                                        <div className="fw-black text-dark small mt-1">{selectedApp.patient_contact || selectedApp.Phone || selectedApp.phone || 'N/A'}</div>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="p-3 bg-white rounded-3 shadow-sm border border-light h-100">
                                        <div className="text-muted fw-bold text-uppercase" style={{ fontSize: '9px' }}>Demographics</div>
                                        <div className="fw-black text-dark small mt-1">Age: {selectedApp.patient_age || selectedApp.age || 'N/A'}, {selectedApp.patient_gender || selectedApp.gender || 'N/A'}</div>
                                    </div>
                                </Col>
                                <Col xs={12}>
                                    <div className="p-3 bg-white rounded-3 shadow-sm border border-light">
                                        <div className="text-muted fw-bold text-uppercase" style={{ fontSize: '9px' }}>Appointment Configuration</div>
                                        <div className="fw-black text-primary small mt-1">
                                            {selectedApp.Date ? selectedApp.Date.split('T')[0] : 'N/A'} @ {selectedApp.Time || '10:00'} (System #{selectedApp.id})
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Profile Edit Modal */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered size="sm">
                <Modal.Header closeButton className="border-0 bg-dark text-white p-3">
                    <Modal.Title className="fw-black h6 mb-0 text-uppercase"><Settings size={16} className="me-2" /> Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3 bg-light">
                    <Form onSubmit={handleProfileUpdate}>
                        <Form.Group className="mb-2">
                            <Form.Label className="small fw-black text-muted text-uppercase mb-1" style={{ fontSize: '8px' }}>Registration Fee</Form.Label>
                            <Form.Control type="number" className="border-0 shadow-sm py-2 px-3 fw-bold" style={{ fontSize: '12px' }} value={editingProfile.fee} onChange={(e) => setEditingProfile({ ...editingProfile, fee: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-black text-muted text-uppercase mb-1" style={{ fontSize: '8px' }}>Specialization</Form.Label>
                            <Form.Control className="border-0 shadow-sm py-2 px-3 fw-bold" style={{ fontSize: '12px' }} value={editingProfile.specialization} onChange={(e) => setEditingProfile({ ...editingProfile, specialization: e.target.value })} required />
                        </Form.Group>
                        <BootstrapButton type="submit" variant="primary" className="w-100 py-2 rounded-pill fw-black shadow-lg btn-premium-sky border-0" style={{ fontSize: '11px' }}>SAVE PROFESSIONAL UPDATES</BootstrapButton>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Prescribe Medication - STYLISH MODAL */}
            <Modal show={showMedicationModal} onHide={() => setShowMedicationModal(false)} centered size="sm">
                <Modal.Header closeButton className="border-0 bg-primary text-white p-3">
                    <Modal.Title className="fw-black h6 mb-0 text-uppercase letter-spacing-1"><ClipboardCheck size={18} className="me-2" /> Clinical Prescription</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3 bg-light">
                    <Form onSubmit={handleSaveMedication}>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-black text-muted text-uppercase mb-1" style={{ fontSize: '8px' }}>Protocol & Instructions</Form.Label>
                            <Form.Control as="textarea" rows={3} className="border-0 shadow-sm p-3 rounded-4 fw-black text-dark" style={{ fontSize: '13px' }} placeholder="e.g. Tab. Panadol (1+1+1) for 5 days post meal..." value={medicationData.medication} onChange={e => setMedicationData({...medicationData, medication: e.target.value})} required />
                        </Form.Group>
                        <BootstrapButton type="submit" variant="primary" className="w-100 py-2 rounded-pill fw-black shadow-lg btn-premium-sky border-0" style={{ fontSize: '11px' }} disabled={submittingMedication}>{submittingMedication ? "SAVING..." : "COMMIT TO E-CHART"}</BootstrapButton>
                    </Form>
                </Modal.Body>
            </Modal>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                
                .doctor-dashboard-root { font-family: 'Inter', sans-serif; background-color: #f1f5f9; }
                .fw-black { font-weight: 900; }
                .tracking-tight { letter-spacing: -0.5px; }
                .bg-slate-50 { background-color: #f8fafc; }
                .shadow-2xl { box-shadow: 0 15px 35px -12px rgba(0, 0, 0, 0.08); }
                
                .banner-accent {
                    position: absolute; top: -40px; right: -40px;
                    width: 120px; height: 120px;
                    background: radial-gradient(circle, rgba(13,110,253,0.05) 0%, transparent 70%);
                }

                .slim-table thead th { border: none !important; }
                .slim-table tbody tr:hover { background-color: rgba(13,110,253,0.01) !important; }
                .hover-lift-subtle:hover { transform: translateY(-1px); }
                
                .btn-premium-sky {
                    background: linear-gradient(135deg, #0d6efd 0%, #0d5be1 100%);
                    letter-spacing: 0.3px;
                }
            `}</style>
        </div>
    );
};

export default DoctorDashboard;
