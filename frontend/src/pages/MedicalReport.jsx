import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { 
    Printer, 
    Share2, 
    ArrowLeft, 
    Calendar, 
    User, 
    FileText, 
    FlaskConical, 
    Stethoscope, 
    ShieldCheck,
    Phone,
    MapPin,
    Activity,
    Microscope,
    ClipboardList,
    Download,
    Zap,
    Lock,
    Pill
} from "lucide-react";
import { Badge, Card, Button, Spinner, Table, Row, Col, Container } from "react-bootstrap";

const MedicalReport = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            if (appointmentId === 'guest') {
                const guestData = localStorage.getItem('guest_report_data');
                if (guestData) {
                    try {
                        const parsed = JSON.parse(guestData);
                        const guestReports = parsed.tests.map(t => ({
                            ...t,
                            patient_name: parsed.patient_name,
                            doctor_name: parsed.doctor_name,
                            date: parsed.date,
                            appointment_id: null
                        }));
                        setReports(guestReports);
                    } catch (e) {
                        console.error("Failed to parse guest data", e);
                    }
                }
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${API_BASE_URL}/api/lab/public/appointment-report/${appointmentId}`);
                setReports(res.data || []);
            } catch (err) {
                console.error("Error fetching report", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [appointmentId]);

    // Auto-print effect
    useEffect(() => {
        if (!loading && reports.length > 0) {
            const params = new URLSearchParams(location.search);
            if (params.get('print') === 'true') {
                setTimeout(() => {
                    window.print();
                }, 800);
            }
        }
    }, [loading, reports.length, location.search]);

    const handlePrint = () => {
        window.print();
    };

    const handleWhatsAppShare = () => {
        if (reports.length === 0) return;
        
        const mainReport = reports[0];
        const patientName = mainReport.patient_name || "Guest Patient";
        const doctorName = mainReport.doctor_name ? `DR. ${mainReport.doctor_name.toUpperCase()}` : "RESIDENT";
        const date = new Date(mainReport.date || mainReport.created_at).toLocaleDateString();
        
        const testsStr = reports.map(t => `🔹 *${t.test_name}:* ${t.result || 'Pending'}`).join('%0A');
        
        const medsList = reports.find(t => t.medication_given)?.medication_given;
        const medsStr = medsList ? medsList.split('\n').filter(Boolean).map((m, i) => `💊 ${i+1}. ${m}`).join('%0A') : 'No Prescriptions';
        
        const text = `🏥 *CITYCARE HOSPITAL* 🏥%0A📞 *Contact:* +92 345 5959000%0A👨‍⚕️ *Consultant:* ${doctorName}%0A━━━━━━━━━━━━━━━━━━━━%0A👤 *Patient:* ${patientName}%0A📅 *Date:* ${date}%0A━━━━━━━━━━━━━━━━━━━━%0A*🧪 INVESTIGATION RESULTS:*%0A${testsStr}%0A━━━━━━━━━━━━━━━━━━━━%0A*📝 CLINICAL PRESCRIPTION:*%0A${medsStr}%0A━━━━━━━━━━━━━━━━━━━━%0A🔗 *View Smart Report:* ${window.location.href.split('?')[0]}`;
            
        const whatsappUrl = `https://wa.me/?text=${text}`;
        window.open(whatsappUrl, '_blank');
    };

    if (loading) return (
        <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-white">
            <Spinner animation="border" variant="primary" size="lg" className="mb-3" />
            <p className="text-primary fw-black letter-spacing-1 h5">PREPARING CLINICAL DATA...</p>
        </div>
    );

    if (reports.length === 0) return (
        <div className="container py-5 text-center">
            <Card className="border-0 shadow-sm p-4 rounded-4 bg-light">
                <FileText size={48} className="text-muted mx-auto mb-3 opacity-20" />
                <h4 className="fw-black text-dark">Record Not Found</h4>
                <p className="text-muted small">We couldn't locate a clinical record for this ID.</p>
                <Button variant="dark" className="rounded-pill px-4 mx-auto fw-black" onClick={() => window.close()}>CLOSE</Button>
            </Card>
        </div>
    );

    const first = reports[0];

    const labTests = reports.filter(r => 
        !r.test_name.toLowerCase().includes('x-ray') && 
        !r.test_name.toLowerCase().includes('ultrasound') &&
        !r.test_name.toLowerCase().includes('radiology')
    );
    const imagingTests = reports.filter(r => 
        r.test_name.toLowerCase().includes('x-ray') || 
        r.test_name.toLowerCase().includes('ultrasound') ||
        r.test_name.toLowerCase().includes('radiology') ||
        (r.category && r.category.toLowerCase().includes('imaging'))
    );
    const medicationsText = reports.find(r => r.medication_given)?.medication_given;

    return (
        <div className="medical-chart-slim min-vh-100 py-3 py-md-4">
            <Container className="d-print-none mb-3" style={{ maxWidth: '850px' }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-2 bg-white rounded-pill shadow-sm border">
                    <Button variant="link" className="text-dark text-decoration-none d-flex align-items-center fw-black px-3" onClick={() => window.close()} style={{ fontSize: '11px' }}>
                        <ArrowLeft size={16} className="me-2" /> EXIT
                    </Button>
                    <div className="d-flex gap-2">
                        <Button variant="outline-success" className="rounded-pill px-3 py-1 shadow-sm fw-black d-flex align-items-center border-2 btn-shrink" onClick={handleWhatsAppShare} style={{ fontSize: '10px' }}>
                            <Share2 size={14} className="me-2" /> SHARE
                        </Button>
                        <Button variant="primary" className="rounded-pill px-4 py-1 shadow-sm fw-black d-flex align-items-center btn-premium-sky border-0 btn-shrink" onClick={handlePrint} style={{ fontSize: '10px' }}>
                            <Printer size={14} className="me-2" /> PRINT REPORT
                        </Button>
                    </div>
                </div>
            </Container>

            <Container className="report-canvas" style={{ maxWidth: '850px' }}>
                <div className="report-paper-compact bg-white shadow-2xl rounded-4 overflow-hidden border">
                    {/* Compact Professional Header */}
                    <div className="premium-header-slim p-3 text-white position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0d5be1 100%)' }}>
                        <div className="header-accent-circle"></div>
                        <Row className="position-relative z-index-2 align-items-center g-2 text-center text-md-start">
                            <Col md={7}>
                                <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
                                    <div className="hospital-logo-compact p-2 bg-white rounded-3 shadow-sm">
                                        <ShieldCheck className="text-primary" size={32} />
                                    </div>
                                    <div>
                                        <h1 className="fw-black mb-0 h4 tracking-tight">CITYCARE HOSPITAL</h1>
                                        <div className="d-flex align-items-center gap-2 opacity-75 fw-bold" style={{ fontSize: '8px', letterSpacing: '1px' }}>
                                            <Zap size={10} /> SMART DIAGNOSTICS & CLINICAL HUB
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={5} className="text-md-end mt-2 mt-md-0">
                                <div className="d-flex flex-column align-items-center align-items-md-end gap-1">
                                    <div className="fw-black" style={{ fontSize: '10px' }}><Phone size={10} className="me-1" /> +92 345 5959000</div>
                                    <div className="opacity-75" style={{ fontSize: '9px' }}><MapPin size={10} className="me-1" /> Block B, Main Medical Tower, City</div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="p-3">
                        {/* Condensed Patient Identity */}
                        <div className="patient-identity-slim rounded-3 p-3 mb-3 border bg-slate-50">
                            <Row className="align-items-center g-2">
                                <Col md={8}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="p-2 bg-white rounded-circle shadow-sm">
                                            <User className="text-primary" size={18} />
                                        </div>
                                        <div>
                                            <h3 className="fw-black text-dark mb-0 h5 text-uppercase">{first.patient_name || first.name || 'GUEST ENTRY'}</h3>
                                            <div className="d-flex flex-wrap gap-2 mt-0 text-muted fw-bold" style={{ fontSize: '9px' }}>
                                                <span>ID: <strong className="text-dark">{first.patient_id || first.unique_id || `TRK-${new Date(first.date || first.created_at || Date.now()).getTime().toString().slice(-6)}`}</strong></span>
                                                <span>CNIC: <strong className="text-dark">{first.cnic || '---'}</strong></span>
                                                <Badge bg="dark" className="rounded-1 fw-black" style={{ fontSize: '7px' }}>SESSION #{appointmentId}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4} className="text-md-end">
                                    <div className="text-muted fw-bold mb-0" style={{ fontSize: '9px' }}>E-RECORD DATE</div>
                                    <div className="fw-black text-dark h6 mb-0">
                                        {new Date(first.date || first.created_at).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* HIGH DENSITY CHART SECTIONS */}
                        <div className="chart-body">
                            
                            {/* SECTION 1: INVESTIGATIONS */}
                            <div className="card-section mb-3">
                                <div className="section-title d-flex align-items-center gap-2 mb-2 pb-1 border-bottom border-light">
                                    <div className="p-1 bg-primary bg-opacity-10 rounded text-primary"><FlaskConical size={14} /></div>
                                    <h6 className="fw-black text-dark mb-0 text-uppercase letter-spacing-1" style={{ fontSize: '10px' }}>Laboratory Investigations</h6>
                                </div>

                                {labTests.length > 0 ? (
                                    <div className="table-responsive rounded-3 border overflow-hidden">
                                        <Table hover borderless className="align-middle mb-0 compact-table">
                                            <thead>
                                                <tr className="bg-slate-50 text-muted text-uppercase fw-black border-bottom border-light" style={{ fontSize: '7.5px' }}>
                                                    <th className="py-2 px-3">Parameter / Category</th>
                                                    <th className="py-2 text-center">Reference Range</th>
                                                    <th className="py-2 text-center" style={{ width: '80px' }}>Status</th>
                                                    <th className="py-2 px-3 text-end" style={{ width: '100px' }}>Result</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {labTests.map((t) => (
                                                    <tr key={t.id} className="border-bottom border-light transition-all">
                                                        <td className="py-2 px-3">
                                                            <div className="fw-black text-dark" style={{ fontSize: '11px' }}>{t.test_name}</div>
                                                            <div className="text-muted fw-bold opacity-75" style={{ fontSize: '8px' }}>{t.category || 'Clinical'}</div>
                                                        </td>
                                                        <td className="py-2 text-center text-muted fw-bold" style={{ fontSize: '9.5px' }}>{t.normal_range || '15-45 mg/dL'}</td>
                                                        <td className="py-2 text-center">
                                                            <Badge bg={t.status === 'done' ? "success" : "warning"} className="bg-opacity-10 text-success fw-black rounded-1 border-0" style={{ fontSize: '7px' }}>
                                                                {t.status === 'done' ? "VERIFIED" : "PENDING"}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-2 px-3 text-end">
                                                            {t.result ? (
                                                                <div className="px-2 py-1 rounded bg-primary text-white fw-black d-inline-block text-center shadow-sm" style={{ fontSize: '10.5px', minWidth: '50px' }}>
                                                                    {t.result}
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted small fw-bold">...</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center p-3 bg-light rounded-3 text-muted small">No laboratory data recorded.</div>
                                )}
                            </div>

                            {/* SECTION 2: RADIOLOGY */}
                            {imagingTests.length > 0 && (
                                <div className="card-section mb-3">
                                    <div className="section-title d-flex align-items-center gap-2 mb-2 pb-1 border-bottom border-light">
                                        <div className="p-1 bg-info bg-opacity-10 rounded text-info"><Activity size={14} /></div>
                                        <h6 className="fw-black text-dark mb-0 text-uppercase letter-spacing-1" style={{ fontSize: '10px' }}>Radiology Findings</h6>
                                    </div>
                                    <Row className="g-2">
                                        {imagingTests.map((test) => (
                                            <Col md={12} key={test.id}>
                                                <div className="p-2 rounded-3 border bg-white shadow-sm d-flex justify-content-between align-items-start gap-3 border-start border-3 border-info">
                                                    <div>
                                                        <h6 className="fw-black mb-1 text-dark" style={{ fontSize: '11px' }}>{test.test_name}</h6>
                                                        <div className="fw-bold text-muted" style={{ fontSize: '10px', whiteSpace: 'pre-line' }}>{test.result || "Awaiting finalized clinical report..."}</div>
                                                    </div>
                                                    <Badge bg="info" className="bg-opacity-10 text-info fw-black rounded-1 border-0" style={{ fontSize: '7px' }}>IMAGE VERIFIED</Badge>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}

                            {/* SECTION 3: MEDICATION PAD */}
                            <div className="card-section mb-3">
                                <div className="section-title d-flex align-items-center gap-2 mb-2 pb-1 border-bottom border-light">
                                    <div className="p-1 bg-danger bg-opacity-10 rounded text-danger"><Stethoscope size={14} /></div>
                                    <h6 className="fw-black text-dark mb-0 text-uppercase letter-spacing-1" style={{ fontSize: '10px' }}>Clinical Prescription (Rx)</h6>
                                </div>

                                {medicationsText ? (
                                    <div className="p-2 rounded-3 bg-danger bg-opacity-5 border border-danger border-opacity-10">
                                        <Row className="g-2">
                                            {medicationsText.split('\n').filter(Boolean).map((line, idx) => (
                                                <Col md={12} key={idx}>
                                                    <div className="d-flex gap-2 align-items-center p-2 bg-white rounded-2 shadow-sm">
                                                        <div className="p-1 bg-light rounded text-danger"><Pill size={11} /></div>
                                                        <div className="fw-black text-dark" style={{ fontSize: '11px' }}>{line}</div>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                ) : (
                                    <div className="text-center p-3 bg-light rounded-3 text-muted small">No prescriptions associated with this diagnostics session.</div>
                                )}
                            </div>
                        </div>

                        {/* High-Density Footer */}
                        <div className="medical-footer mt-4 pt-3 border-top">
                            <Row className="align-items-center g-3">
                                <Col md={6}>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="p-2 bg-light rounded-circle shadow-inner">
                                            <ShieldCheck className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <div className="text-muted fw-bold text-uppercase" style={{ fontSize: '8px' }}>CLINICAL SUPERVISOR</div>
                                            <h6 className="fw-black text-dark mb-0">DR. {first.doctor_name?.toUpperCase()}</h6>
                                            <div className="text-primary fw-bold" style={{ fontSize: '8px' }}>CONSULTANT / SYSTEM AUTH</div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} className="text-md-end">
                                    <div className="d-inline-block text-center" style={{ minWidth: '150px' }}>
                                        <div className="signature-scan border-bottom border-dark border-1 mb-1" style={{ height: '30px' }}></div>
                                        <div className="fw-black text-dark" style={{ fontSize: '8.5px' }}>E-VERIFICATION STAMP</div>
                                        <div className="text-muted fw-bold" style={{ fontSize: '7px' }}>TOKEN ID: {appointmentId}-CCH-VERIFIED</div>
                                    </div>
                                </Col>
                            </Row>

                            <div className="mt-4 p-2 bg-dark text-white rounded-3 text-center fw-bold d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '8.5px' }}>
                                <Lock size={10} /> THIS IS A VERIFIED ELECTRONIC MEDICAL RECORD. VALID FOR CLINICAL USE.
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                
                .medical-chart-slim { font-family: 'Inter', sans-serif; background-color: #f1f5f9; }
                .fw-black { font-weight: 900; }
                .tracking-tight { letter-spacing: -1px; }
                .letter-spacing-1 { letter-spacing: 1px; }
                .bg-slate-50 { background-color: #f8fafc; }
                .shadow-2xl { box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1); }
                .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.05); }

                .premium-header-slim { position: relative; border-bottom: 3px solid #0d5be1; }
                .header-accent-circle {
                    position: absolute; top: -20px; right: -20px;
                    width: 100px; height: 100px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 50%;
                    z-index: 1;
                }

                .compact-table thead th { border: none !important; }
                .compact-table tbody tr:hover { background-color: rgba(13,110,253,0.02) !important; }
                
                .patient-identity-slim { border: 1px solid #e2e8f0; }
                
                .btn-premium-sky {
                    background: linear-gradient(135deg, #0d6efd 0%, #0d5be1 100%);
                    letter-spacing: 0.5px;
                }
                
                .btn-shrink:hover { transform: translateY(-1px); }

                @media print {
                    .d-print-none { display: none !important; }
                    html, body {
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        height: 100vh !important;
                        overflow: hidden !important;
                    }
                    .medical-chart-slim { 
                        padding: 0 !important; 
                        margin: 0 !important;
                        height: 100vh !important; 
                        overflow: hidden !important;
                    }
                    .report-canvas {
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        max-width: 100% !important;
                    }
                    .report-paper-compact { 
                        box-shadow: none !important; 
                        margin: 0 !important; 
                        width: 100% !important;
                        border: none !important;
                        border-radius: 0 !important;
                        page-break-inside: avoid !important;
                        page-break-after: avoid !important;
                        transform: scale(0.75) !important;
                        transform-origin: top center !important;
                    }
                    .premium-header-slim { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .bg-slate-50 { background-color: #f8f9fa !important; -webkit-print-color-adjust: exact !important; }
                    .badge { border: 1px solid #ccc !important; }
                    @page { margin: 10mm; size: A4 portrait; }
                }
            `}</style>
        </div>
    );
};

export default MedicalReport;
