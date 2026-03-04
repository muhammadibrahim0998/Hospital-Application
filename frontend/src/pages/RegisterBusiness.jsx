import React, { useState, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { Building2, Save, Upload } from "lucide-react";

/**
 * RegisterBusiness Component
 * Matches the "REGISTER BUSINESS" form from user screenshots
 */
const RegisterBusiness = () => {
    const { user, token } = useContext(AuthContext);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        charges: "0",
        reg_name: "",
        phone: "",
        business_type: "Hospital",
        logo: null
    });

    const headers = { Authorization: `Bearer ${token}` };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mapping UI fields to backend hospitals table
            const payload = {
                name: form.name,
                address: form.address,
                phone: form.phone,
                email: form.email,
                // These extras can be stored in a JSON column or separate table if needed, 
                // but for now we'll match the main hospitals table
            };

            await axios.post(`${API_BASE_URL}/api/super-admin/hospitals`, payload, { headers });
            setAlert({ type: "success", msg: "Business Registered Successfully!" });
            setForm({ name: "", email: "", address: "", charges: "0", reg_name: "", phone: "", business_type: "Hospital", logo: null });
        } catch (err) {
            setAlert({ type: "danger", msg: err.response?.data?.message || "Failed to register business" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="py-4 px-md-5 bg-light min-vh-100">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Header className="bg-white border-0 p-4 border-bottom">
                    <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                        REGISTER BUSINESS
                    </h4>
                </Card.Header>
                <Card.Body className="p-4 p-md-5">
                    {alert && <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>{alert.msg}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <h5 className="text-muted fw-bold mb-4 border-bottom pb-2" style={{ fontSize: "0.9rem" }}>Business Info</h5>

                        <Row className="g-4 mb-5">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted">Business Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                        className="py-2 border-0 bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted">Reg Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.reg_name}
                                        onChange={e => setForm({ ...form, reg_name: e.target.value })}
                                        className="py-2 border-0 bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        required
                                        className="py-2 border-0 bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted">Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        className="py-2 border-0 bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted">Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={1}
                                        value={form.address}
                                        onChange={e => setForm({ ...form, address: e.target.value })}
                                        className="py-2 border-0 bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted">Business Type</Form.Label>
                                    <Form.Select
                                        value={form.business_type}
                                        onChange={e => setForm({ ...form, business_type: e.target.value })}
                                        className="py-2 border-0 bg-light"
                                    >
                                        <option value="Hospital">Hospital</option>
                                        <option value="Clinic">Clinic</option>
                                        <option value="Laboratory">Laboratory</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted">Charges</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={form.charges}
                                        onChange={e => setForm({ ...form, charges: e.target.value })}
                                        className="py-2 border-0 bg-light"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-muted">Upload Image</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Control
                                            type="file"
                                            className="d-none"
                                            id="business-logo"
                                            onChange={e => setForm({ ...form, logo: e.target.files[0] })}
                                        />
                                        <Button
                                            as="label"
                                            htmlFor="business-logo"
                                            variant="light"
                                            className="border w-100 py-2 text-muted fw-bold d-flex align-items-center justify-content-center gap-2"
                                        >
                                            <Upload size={16} /> {form.logo ? form.logo.name : "Choose File"}
                                        </Button>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="border-top pt-4">
                            <Button type="submit" variant="primary" disabled={loading} className="px-5 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-2">
                                <Save size={18} /> {loading ? "Registering..." : "Update Settings"}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterBusiness;
