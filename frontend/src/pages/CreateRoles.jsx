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
            <Card className="border-0 shadow-sm rounded-4">
                <Card.Header className="bg-white border-0 p-4 border-bottom">
                    <h5 className="fw-bold mb-0">ROLE PERMISSION CONTROL</h5>
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

                        <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-primary bg-opacity-10 rounded-3 border-start border-4 border-primary shadow-xs">
                            <Form.Check
                                type="checkbox"
                                id="super-role-toggle"
                                label={<span className="fw-bold">Super Role (All Permissions)</span>}
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

                        <div className="mt-5 text-end">
                            <Button type="submit" variant="primary" className="px-5 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2 ms-auto">
                                <Save size={18} /> CREATE NEW ROLE
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateRoles;
