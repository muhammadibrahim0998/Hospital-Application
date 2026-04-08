import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Container, Row, Col, Card, Button, Form, Table } from "react-bootstrap";
import { Plus, Save, Settings } from "lucide-react";

const MODULE_LIST = [
    { id: "dashboard", name: "Dashboard" },
    { id: "register-business", name: "Register Business" },
    { id: "user-management", name: "User Management" },
    { id: "appointments", name: "Appointments" },
    { id: "lab", name: "Laboratory Services" },
    { id: "doctors", name: "Doctors" },
    { id: "clients", name: "Clients" }
];

const CreateRoles = () => {
    const [roleTitle, setRoleTitle] = useState("");
    const [roleDesc, setRoleDesc] = useState("");
    const [isSuperRole, setIsSuperRole] = useState(false);

    // Permission state: mapping moduleId -> { view, add, update, delete }
    const [permissions, setPermissions] = useState(
        MODULE_LIST.reduce((acc, mod) => {
            acc[mod.id] = { view: false, add: false, update: false, delete: false };
            return acc;
        }, {})
    );

    const togglePerm = (modId, action) => {
        setPermissions(prev => ({
            ...prev,
            [modId]: { ...prev[modId], [action]: !prev[modId][action] }
        }));
    };

    const handleSuperToggle = (checked) => {
        setIsSuperRole(checked);
        if (checked) {
            // Check all
            const allChecked = MODULE_LIST.reduce((acc, mod) => {
                acc[mod.id] = { view: true, add: true, update: true, delete: true };
                return acc;
            }, {});
            setPermissions(allChecked);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // Here we would save this complex JSON structure to the DB
        alert(`Role "${roleTitle}" permissions captured. Ready to save.`);
    };

    return (
        <Container fluid className="py-4 px-md-5 bg-light min-vh-100">
            <Card className="border-0 shadow-lg rounded-5 overflow-hidden bg-white">
                <Card.Header className="bg-white border-0 p-4 border-bottom border-blue-soft text-center">
                    <h4 className="fw-black mb-0 tracking-tight text-dark letter-spacing-1">ROLE PERMISSION CONTROL</h4>
                    <p className="text-muted small mb-0 mt-1 fw-bold fw-black">Configure System Logic & Access Nodes</p>
                </Card.Header>
                <Card.Body className="p-4">
                    <Form onSubmit={handleSave}>
                        <Row className="mb-4 g-3">
                            <Col md={6}>
                                <Form.Label className="small fw-bold text-muted">Role Title</Form.Label>
                                <Form.Control
                                    className="py-2 border-0 bg-light"
                                    value={roleTitle}
                                    onChange={e => setRoleTitle(e.target.value)}
                                    placeholder="Enter Role Name (e.g. Lab Manager)"
                                    required
                                />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small fw-bold text-muted">Role Description</Form.Label>
                                <Form.Control
                                    className="py-2 border-0 bg-light"
                                    value={roleDesc}
                                    onChange={e => setRoleDesc(e.target.value)}
                                    placeholder="Brief Description"
                                />
                            </Col>
                        </Row>

                        <div className="d-flex align-items-center gap-3 mb-5 p-3 rounded-4 border-start border-4 border-blue shadow-sm bg-blue-tint">
                            <Form.Check
                                type="checkbox"
                                id="super-role-toggle"
                                label={<span className="fw-black text-dark" style={{fontSize: '14px'}}>Super Role (All Permissions)</span>}
                                checked={isSuperRole}
                                onChange={e => handleSuperToggle(e.target.checked)}
                            />
                        </div>

                        <div className="table-responsive rounded-4 overflow-hidden shadow-sm border mt-4">
                            <Table hover className="align-middle mb-0 bg-white">
                                <thead className="bg-light text-muted small text-uppercase">
                                    <tr>
                                        <th className="px-4 py-3 border-0">Module Name</th>
                                        <th className="py-3 border-0">Permissions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MODULE_LIST.map(mod => (
                                        <tr key={mod.id}>
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id={`mod-${mod.id}`}
                                                        checked={permissions[mod.id].view}
                                                        onChange={() => togglePerm(mod.id, 'view')}
                                                    />
                                                    <span className="fw-bold text-dark">{mod.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex flex-wrap gap-4">
                                                    {['view', 'update', 'delete', 'add'].map(action => (
                                                        <Form.Check
                                                            key={action}
                                                            type="checkbox"
                                                            id={`${mod.id}-${action}`}
                                                            label={<span className="text-capitalize small fw-semibold text-muted">{action}</span>}
                                                            checked={permissions[mod.id][action]}
                                                            onChange={() => togglePerm(mod.id, action)}
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>

                        <div className="mt-5 text-center">
                            <Button type="submit" variant="primary" className="px-4 py-2 rounded-2 fw-black shadow-lg d-inline-flex align-items-center gap-2 border-0 btn-premium-blue" style={{fontSize: '12px'}}>
                                <Save size={16} /> CREATE NEW ROLE
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                body { font-family: 'Inter', sans-serif; background: #f8fafc; }
                .fw-black { font-weight: 900; }
                .border-blue-soft { border-bottom-color: rgba(13, 110, 253, 0.1) !important; }
                .border-blue { border-color: #0d6efd !important; }
                .bg-blue-tint { background: rgba(13, 110, 253, 0.03); }
                .letter-spacing-1 { letter-spacing: 1px; }
                .btn-premium-blue { background: #0d6efd !important; transition: all 0.3s ease; }
                .btn-premium-blue:hover { background: #0b5ed7 !important; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(13, 110, 253, 0.2) !important; }
                .tracking-tight { letter-spacing: -1px; }
            `}</style>
        </Container>
    );
};

export default CreateRoles;
