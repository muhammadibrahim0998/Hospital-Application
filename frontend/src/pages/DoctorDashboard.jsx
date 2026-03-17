import React, { useState, useEffect, useContext } from "react";
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
    Camera
} from "lucide-react";
import { Modal, Form, Row, Col, Badge, Card, Button as BootstrapButton } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [labReports, setLabReports] = useState([]);
    const [profile, setProfile] = useState({});
    const [showProfileModal, setShowProfileModal] = useState(false);
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

    // Modals
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [editFormData, setEditFormData] = useState({
        Date: "",
        Time: "",
        status: ""
    });

    const { token } = useContext(AuthContext);
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
        // ... (existing code, I'll keep it simple)
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

    return (
        <div className="container-fluid py-4 px-md-5 bg-light min-vh-100">
            {/* Top Bar / Welcome */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3 bg-white p-4 rounded-4 shadow-sm border-0">
                <div className="d-flex align-items-center gap-3">
                    <img
                        src={profile.image ? `${API_BASE_URL}${profile.image}` : "https://img.icons8.com/color/96/doctor-male.png"}
                        alt="Doctor"
                        className="rounded-circle border border-3 border-primary p-1"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Welcome, Dr. {profile.name}</h2>
                        <div className="d-flex align-items-center gap-2">
                            <Badge bg="primary-subtle" className="text-primary px-3 py-2 rounded-pill fw-medium">
                                {profile.specialization || "General Physician"}
                            </Badge>
                            <span className="text-muted small">| Hospital Management System Provider</span>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <BootstrapButton variant="outline-primary" size="sm" className="rounded-pill px-3 fw-bold shadow-sm" onClick={() => navigate("/doctor-lab")}>
                        <FlaskConical size={16} className="me-1" /> Order Lab Tests
                    </BootstrapButton>
                    <BootstrapButton variant="outline-success" size="sm" className="rounded-pill px-3 fw-bold shadow-sm" onClick={() => navigate("/lab-results")}>
                        <FileText size={16} className="me-1" /> Clinical Reports
                    </BootstrapButton>
                    <BootstrapButton variant="outline-secondary" size="sm" className="rounded-pill px-3 fw-bold shadow-sm" onClick={() => setShowProfileModal(true)}>
                        <Settings size={16} className="me-1" /> Profile
                    </BootstrapButton>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-lg-8 d-flex flex-column gap-4">
                    {/* Appointments Section */}
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 d-flex align-items-center">
                                <Calendar className="text-primary me-2" size={20} /> Upcoming Appointments
                            </h5>
                            <Badge bg="light" className="text-muted border rounded-pill px-3 py-2">
                                {(appointments || []).filter(a => a.status === 'scheduled').length} Scheduled
                            </Badge>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive" style={{ maxHeight: "350px", overflowY: "auto" }}>
                                <table className="table table-hover align-middle mb-0 custom-table bg-white table-sm">
                                    <thead className="bg-light border-bottom border-light">
                                        <tr className="text-muted text-uppercase fw-bold tracking-wider" style={{ fontSize: '11px' }}>
                                            <th className="px-4 py-3 border-0">Patient Info</th>
                                            <th className="py-2 border-0">Schedule</th>
                                            <th className="py-2 border-0">Status</th>
                                            <th className="py-2 border-0 text-end px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">No appointments found.</td>
                                            </tr>
                                        ) : (
                                            appointments.map((app) => (
                                                <tr key={app.id} className="border-bottom border-light">
                                                    <td className="px-4 py-2">
                                                        <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{app.Patient || app.patient_name}</div>
                                                        <div className="d-flex align-items-center gap-1 mt-n1">
                                                            <Badge bg="secondary" className="bg-opacity-10 text-secondary border-0 fw-normal" style={{ fontSize: '10px' }}>
                                                                ID: {app.patient_id || 'N/A'}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="py-2">
                                                        <div className="d-flex flex-column" style={{ fontSize: '12px' }}>
                                                            <div className="d-flex align-items-center text-dark fw-medium">
                                                                <Calendar size={12} className="me-2 text-primary" />
                                                                {app.Date ? app.Date.split('T')[0] : 'No Date'}
                                                            </div>
                                                            <div className="d-flex align-items-center text-muted">
                                                                <Clock size={12} className="me-2" />
                                                                {app.Time || 'No Time'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-2">
                                                        <Badge
                                                            bg={app.status === 'completed' ? 'success' : app.status === 'cancelled' ? 'danger' : 'warning'}
                                                            className="rounded-pill px-2 py-1 fw-medium opacity-75"
                                                            style={{ fontSize: '10px' }}
                                                        >
                                                            {app.status?.toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-2 text-end px-4">
                                                        <div className="d-flex justify-content-end gap-1">
                                                            {/* Lab Button */}
                                                            {app.status === 'scheduled' && (
                                                                <BootstrapButton 
                                                                    variant="info" 
                                                                    size="sm" 
                                                                    className="rounded-circle p-1 shadow-sm border-0 text-white action-btn" 
                                                                    title="Open Lab"
                                                                    style={{ width: '28px', height: '28px' }}
                                                                    onClick={() => navigate("/doctor-lab", { 
                                                                        state: { 
                                                                            patient_id: app.patient_id, 
                                                                            patient_name: app.Patient || app.patient_name || "Patient",
                                                                            cnic: app.CNIC || "",
                                                                            appointment_id: app.id,
                                                                            doctor_name: profile.name || user?.name || "Doctor",
                                                                            appointment_date: (app.Date || app.appointment_date || "").split('T')[0]
                                                                        } 
                                                                    })}
                                                                >
                                                                    <FlaskConical size={14} />
                                                                </BootstrapButton>
                                                            )}
                                                            
                                                            {/* WhatsApp Button */}
                                                            {(app.Phone || app.PatientPhone) && (
                                                                <a 
                                                                    href={`https://wa.me/${(app.Phone || app.PatientPhone).replace(/[^0-9]/g, '')}`} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-success btn-sm rounded-circle p-1 shadow-sm border-0 action-btn"
                                                                    title="WhatsApp"
                                                                    style={{ width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                                >
                                                                    <Phone size={14} />
                                                                </a>
                                                            )}

                                                            {/* View Button */}
                                                            <BootstrapButton 
                                                                variant="secondary" 
                                                                size="sm" 
                                                                className="rounded-circle p-1 shadow-sm border-0 text-white action-btn"
                                                                title="View Details"
                                                                style={{ width: '28px', height: '28px' }}
                                                                onClick={() => handleViewClick(app)}
                                                            >
                                                                <Eye size={14} />
                                                            </BootstrapButton>

                                                            {/* Edit Button */}
                                                            <BootstrapButton 
                                                                variant="warning" 
                                                                size="sm" 
                                                                className="rounded-circle p-1 shadow-sm border-0 text-white action-btn"
                                                                title="Edit"
                                                                style={{ width: '28px', height: '28px' }}
                                                                onClick={() => handleEditClick(app)}
                                                            >
                                                                <Edit size={14} />
                                                            </BootstrapButton>

                                                            {/* Delete Button */}
                                                            <BootstrapButton 
                                                                variant="danger" 
                                                                size="sm" 
                                                                className="rounded-circle p-1 shadow-sm border-0 text-white action-btn"
                                                                title="Delete"
                                                                style={{ width: '28px', height: '28px' }}
                                                                onClick={() => handleDelete(app.id)}
                                                            >
                                                                <Trash2 size={14} />
                                                            </BootstrapButton>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Lab Results & Reports Section */}
                    <Card id="lab-reports-section" className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0 d-flex align-items-center">
                                <FileText className="text-primary me-2" size={20} /> Lab Results & Reports
                            </h5>
                            <Badge bg="light" className="text-muted border rounded-pill px-3 py-2">
                                {labReports.length} Total
                            </Badge>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive" style={{ maxHeight: "350px", overflowY: "auto" }}>
                                <table className="table table-hover align-middle mb-0 custom-table">
                                    <thead className="bg-light text-muted small text-uppercase fw-bold" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th className="px-4 py-3">Patient</th>
                                            <th className="py-3">Test/Report Name</th>
                                            <th className="py-3">Status/Result</th>
                                            <th className="py-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {labReports.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">No lab results or reports available for your patients.</td>
                                            </tr>
                                        ) : (
                                            labReports.map((report) => (
                                                <tr key={report.id}>
                                                    <td className="px-4 py-3 fw-bold text-dark">{report.patient_name}</td>
                                                    <td className="py-3">{report.test_name || "General Report"}</td>
                                                    <td className="py-3">
                                                        <Badge bg={report.result ? "success" : "warning"} className="px-3 py-2 rounded-pill">
                                                            {report.result || "Pending/Awaiting"}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 text-muted small">
                                                        {new Date(report.date || report.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Profile Widget Side */}
                <div className="col-lg-4">
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <Card.Body className="p-0">
                            <div className="bg-primary p-4 text-white text-center">
                                <div className="bg-white bg-opacity-25 rounded-circle p-3 d-inline-block mb-3">
                                    <User size={32} />
                                </div>
                                <h5 className="fw-bold mb-0">Professional Summary</h5>
                            </div>
                            <div className="p-4">
                                <div className="mb-4">
                                    <label className="text-muted small mb-1 text-uppercase fw-bold">Email Address</label>
                                    <div className="fw-bold text-dark">{profile.email || "N/A"}</div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-muted small mb-1 text-uppercase fw-bold">Consultation Contact</label>
                                    <div className="fw-bold text-dark">{profile.phone || "N/A"}</div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-muted small mb-1 text-uppercase fw-bold">WhatsApp Number</label>
                                    <div className="fw-bold text-dark">{profile.whatsapp_number || "N/A"}</div>
                                </div>
                                <div className="mb-4">
                                    <label className="text-muted small mb-1 text-uppercase fw-bold">Consultation Fee</label>
                                    <div className="fw-bold text-primary h5 mb-0">Rs. {profile.fee || "500"}</div>
                                </div>
                                <div className="mb-0">
                                    <label className="text-muted small mb-1 text-uppercase fw-bold">Office Details</label>
                                    <div className="fw-bold text-dark">{profile.contact_info || "Hospital OPD"}</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Profile Update Modal */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered className="border-0">
                <Modal.Header closeButton className="border-0 bg-primary text-white p-4">
                    <Modal.Title className="fw-bold"><Settings className="me-2" /> Update Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    <Form onSubmit={handleProfileUpdate}>
                        <Row className="g-3">
                            <Col md={12}>
                                <div className="text-center mb-4 position-relative">
                                    <img
                                        src={profile.image ? `${API_BASE_URL}${profile.image}` : "https://img.icons8.com/color/96/doctor-male.png"}
                                        alt="Current"
                                        className="rounded-circle border border-3 border-white shadow-sm"
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                    />
                                    <label htmlFor="image-upload" className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 start-50 translate-middle-x mb-n2 shadow-sm p-2 border-white border-2">
                                        <Camera size={16} />
                                    </label>
                                    <input id="image-upload" type="file" className="d-none" accept="image/*" onChange={(e) => setEditingProfile({ ...editingProfile, imageFile: e.target.files[0] })} />
                                </div>
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">Specialization</Form.Label>
                                <Form.Control className="border-0 shadow-sm px-3 py-2" value={editingProfile.specialization} onChange={(e) => setEditingProfile({ ...editingProfile, specialization: e.target.value })} required />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">Public Phone</Form.Label>
                                <Form.Control className="border-0 shadow-sm px-3 py-2" value={editingProfile.phone} onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })} required />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">Consultation Fee</Form.Label>
                                <Form.Control type="number" className="border-0 shadow-sm px-3 py-2" value={editingProfile.fee} onChange={(e) => setEditingProfile({ ...editingProfile, fee: e.target.value })} required />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">WhatsApp Number</Form.Label>
                                <Form.Control className="border-0 shadow-sm px-3 py-2" value={editingProfile.whatsappNumber} onChange={(e) => setEditingProfile({ ...editingProfile, whatsappNumber: e.target.value })} />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">Contact / Clinic Info</Form.Label>
                                <Form.Control as="textarea" rows={2} className="border-0 shadow-sm px-3 py-2" value={editingProfile.contact_info} onChange={(e) => setEditingProfile({ ...editingProfile, contact_info: e.target.value })} required />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">Dept ID</Form.Label>
                                <Form.Control type="number" className="border-0 shadow-sm px-3 py-2" value={editingProfile.departmentId} onChange={(e) => setEditingProfile({ ...editingProfile, departmentId: e.target.value })} required />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted mb-1 text-uppercase">Field ID</Form.Label>
                                <Form.Control type="number" className="border-0 shadow-sm px-3 py-2" value={editingProfile.fieldId} onChange={(e) => setEditingProfile({ ...editingProfile, fieldId: e.target.value })} required />
                            </Col>
                        </Row>
                        <BootstrapButton type="submit" variant="primary" className="w-100 py-3 rounded-pill fw-bold shadow-lg mt-4">SAVE CHANGES</BootstrapButton>
                    </Form>
                </Modal.Body>
            </Modal>
 
            {/* View Appointment Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="sm">
                <Modal.Header closeButton className="border-0 bg-secondary text-white p-3">
                    <Modal.Title className="fw-bold h6 mb-0"><Eye className="me-2" size={18} /> Appointment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">
                    {selectedApp && (
                        <div className="d-flex flex-column gap-2">
                            <div className="bg-light p-2 rounded-2">
                                <label className="text-muted fw-bold mb-0" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Patient Name</label>
                                <div className="fw-bold text-dark">{selectedApp.Patient || selectedApp.patient_name}</div>
                            </div>
                            <div className="row g-2">
                                <div className="col-6">
                                    <div className="bg-light p-2 rounded-2">
                                        <label className="text-muted fw-bold mb-0" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Date</label>
                                        <div className="fw-medium text-dark small">{selectedApp.Date ? selectedApp.Date.split('T')[0] : 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bg-light p-2 rounded-2">
                                        <label className="text-muted fw-bold mb-0" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Time</label>
                                        <div className="fw-medium text-dark small">{selectedApp.Time}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-light p-2 rounded-2">
                                <label className="text-muted fw-bold mb-0" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Contact Info</label>
                                <div className="fw-medium text-primary small">{selectedApp.Phone || selectedApp.PatientPhone || "N/A"}</div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded-2">
                                <div>
                                    <label className="text-muted fw-bold mb-0 d-block" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Status</label>
                                    <Badge bg={selectedApp.status === 'completed' ? 'success' : 'warning'} className="rounded-pill px-2 py-1 fw-normal" style={{ fontSize: '9px' }}>
                                        {selectedApp.status?.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="text-end">
                                    <label className="text-muted fw-bold mb-0 d-block" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Fee</label>
                                    <div className="fw-bold text-success h6 mb-0">Rs. {selectedApp.Fee || "0"}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Edit Appointment Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton className="border-0 bg-warning text-dark p-4">
                    <Modal.Title className="fw-bold"><Edit className="me-2" /> Edit Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 bg-light">
                    <Form onSubmit={handleUpdateAppointment}>
                        <div className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase">Appointment Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                className="border-0 shadow-sm" 
                                value={editFormData.Date} 
                                onChange={e => setEditFormData({...editFormData, Date: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <Form.Label className="small fw-bold text-muted text-uppercase">Appointment Time</Form.Label>
                            <Form.Control 
                                type="time" 
                                className="border-0 shadow-sm" 
                                value={editFormData.Time} 
                                onChange={e => setEditFormData({...editFormData, Time: e.target.value})}
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <Form.Label className="small fw-bold text-muted text-uppercase">Status</Form.Label>
                            <Form.Select 
                                className="border-0 shadow-sm" 
                                value={editFormData.status} 
                                onChange={e => setEditFormData({...editFormData, status: e.target.value})}
                            >
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </Form.Select>
                        </div>
                        <BootstrapButton type="submit" variant="warning" className="w-100 py-3 rounded-pill fw-bold shadow-sm">
                            UPDATE APPOINTMENT
                        </BootstrapButton>
                    </Form>
                </Modal.Body>
            </Modal>

            <style>{`
                .custom-table tr { transition: all 0.2s ease; cursor: default; }
                .custom-table tr:hover { background-color: rgba(0, 0, 0, 0.02) !important; }
                .btn-white { background-color: white !important; }
                .btn-white:hover { background-color: #f8f9fa !important; }
                .mb-n2 { margin-bottom: -0.5rem; }
                .action-btn { transition: all 0.2s ease; }
                .action-btn:hover { transform: scale(1.1); }
            `}</style>
        </div>
    );
};

export default DoctorDashboard;
