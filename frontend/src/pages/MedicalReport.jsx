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
    Pill,
    Globe,
    Mail,
    QrCode
} from "lucide-react";
import { Badge, Card, Button, Spinner, Table, Row, Col, Container } from "react-bootstrap";

const MedicalReport = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const getResultScale = (result, range) => {
        if (!result || !range || !range.includes('-')) return { percent: 0, color: '#0d6efd', label: '', isAlert: false };
        const rangeMatch = range.match(/(\d+(\.\d+)?)/g);
        if (!rangeMatch || rangeMatch.length < 2) return { percent: 0, color: '#0d6efd', label: '', isAlert: false };
        
        const min = parseFloat(rangeMatch[0]);
        const max = parseFloat(rangeMatch[1]);
        const val = parseFloat(result.match(/(\d+(\.\d+)?)/)?.[0] || '0');
        
        if (isNaN(min) || isNaN(max) || isNaN(val)) return { percent: 0, color: '#0d6efd', label: '', isAlert: false };
        
        let color = '#2c3e50'; // Default dark
        let label = '';
        let isAlert = false;

        if (val < min) { color = '#0d6efd'; label = 'Low'; isAlert = true; }
        else if (val > max) { color = '#dc3545'; label = 'High'; isAlert = true; }
        else { color = '#0d6efd'; label = ''; isAlert = false; }
        
        return { color, label, isAlert };
    };

    const getUnit = (testName) => {
        const lower = testName.toLowerCase();
        if (lower.includes('sugar') || lower.includes('rbs') || lower.includes('glucose')) return 'mg/dL';
        if (lower.includes('hemoglobin') || lower.includes('hb')) return 'g/dL';
        if (lower.includes('count') || lower.includes('wbc') || lower.includes('rbc')) return 'cells/uL';
        if (lower.includes('percentage') || lower.includes('%')) return '%';
        return '---';
    };

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

    const handlePrint = () => window.print();

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
                <Button variant="dark" className="rounded-pill px-4 mx-auto fw-black" onClick={() => window.close()}>CLOSE</Button>
            </Card>
        </div>
    );

    const first = reports[0];
    const labTests = reports.filter(r => !r.test_name.toLowerCase().includes('x-ray') && !r.test_name.toLowerCase().includes('ultrasound'));
    const medicationsText = reports.find(r => r.medication_given)?.medication_given;

    return (
        <div className="medical-print-root min-vh-100 pb-5">
            {/* Control Bar */}
            <Container className="d-print-none mb-3 py-3" style={{ maxWidth: '850px' }}>
                <div className="d-flex justify-content-between align-items-center p-2 bg-white rounded-pill shadow-sm border">
                    <Button variant="link" className="text-dark text-decoration-none d-flex align-items-center fw-bold px-3" onClick={() => window.close()}>
                        <ArrowLeft size={16} className="me-2" /> EXIT
                    </Button>
                    <Button variant="primary" className="rounded-pill px-4 py-2 shadow-sm fw-black d-flex align-items-center btn-premium-sky border-0" onClick={handlePrint}>
                        <Printer size={16} className="me-2" /> PRINT PROFESSIONAL REPORT
                    </Button>
                </div>
            </Container>

            {/* Professional Paper */}
            <Container className="report-canvas" style={{ maxWidth: '850px' }}>
                <div className="report-paper-a4 bg-white shadow-2xl overflow-hidden position-relative">
                    
                    {/* Header Branding */}
                    <div className="report-header p-4 border-bottom border-3 border-primary">
                        <Row className="align-items-center">
                            <Col md={7}>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="lab-logo bg-primary p-2 rounded-circle shadow-sm">
                                        <Microscope color="white" size={40} />
                                    </div>
                                    <div>
                                        <h1 className="fw-black text-primary mb-0 tracking-tight h3">SAMARBAGH CITY HOSPITAL</h1>
                                        <div className="d-flex align-items-center gap-2 fw-black text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                                            SAMARBAGH • LOWER DIR • PATHOLOGY WING
                                        </div>
                                        <div className="text-muted small fw-bold mt-1" style={{ fontSize: '9px' }}>
                                            MAIN BAZAR SAMARBAGH, LOWER DIR, PAKISTAN
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={5} className="text-md-end">
                                <div className="contact-grid small fw-bold text-muted">
                                    <div><Phone size={12} className="me-1 text-primary" /> +92 345 5959000</div>
                                    <div><Mail size={12} className="me-1 text-primary" /> samarbaghcityhospital@gmail.com</div>
                                    <div><Globe size={12} className="me-1 text-primary" /> www.samarbaghcityhospital.com</div>
                                </div>
                            </Col>
                        </Row>
                        <div className="header-blue-bar mt-3"></div>
                    </div>

                    <div className="p-4 pt-3">
                        {/* Patient & Tracking Grid */}
                        <div className="patient-panel rounded-3 p-3 mb-4 border bg-light position-relative">
                            <div className="tracking-barcode-sim position-absolute top-0 end-0 m-3 d-none d-md-block text-end">
                                <div className="barcode-stub bg-dark mb-1" style={{ width: '100px', height: '20px' }}></div>
                                <div className="fw-black text-muted" style={{ fontSize: '7px' }}>REG: {new Date(first.date).getTime().toString().slice(-10)}</div>
                            </div>
                            
                            <Row className="g-3">
                                <Col md={4}>
                                    <div className="info-item">
                                        <div className="label">Patient Name</div>
                                        <div className="val fw-black h6 text-dark mb-0">{first.patient_name?.toUpperCase() || 'WALK-IN PATIENT'}</div>
                                    </div>
                                    <div className="info-item mt-2">
                                        <div className="label">Age / Gender</div>
                                        <div className="val fw-bold text-dark">21 Years / Male</div>
                                    </div>
                                </Col>
                                <Col md={4} className="text-center d-flex flex-column align-items-center">
                                    <div className="qr-box p-1 bg-white border border shadow-sm mb-1">
                                        <QrCode size={50} strokeWidth={1.5} />
                                    </div>
                                    <div className="label">PID: {first.patient_id?.toString().slice(-6) || 'N/A'}</div>
                                </Col>
                                <Col md={4} className="text-end">
                                    <div className="info-item">
                                        <div className="label">Registered On</div>
                                        <div className="val fw-bold text-dark">{new Date(first.date).toLocaleString()}</div>
                                    </div>
                                    <div className="info-item mt-2">
                                        <div className="label">Referred By</div>
                                        <div className="val fw-black text-primary mb-0">DR. {first.doctor_name?.toUpperCase()}</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* Results Table - Khkuly Style */}
                        <div className="results-section">
                            <h5 className="fw-black text-center mb-3 text-uppercase border-bottom pb-2 letter-spacing-1">Investigation Report</h5>
                            
                            <Table borderless className="clinical-table align-middle">
                                <thead>
                                    <tr className="border-bottom border-2 border-dark text-uppercase fw-black" style={{ fontSize: '11px' }}>
                                        <th style={{ width: '40%' }}>Investigation</th>
                                        <th style={{ width: '20%' }} className="text-center">Result</th>
                                        <th style={{ width: '25%' }} className="text-center">Reference Value</th>
                                        <th style={{ width: '15%' }} className="text-end">Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {labTests.map((t, idx) => {
                                        const scale = getResultScale(t.result, t.normal_range);
                                        return (
                                            <React.Fragment key={t.id}>
                                                {idx === 0 && (
                                                    <tr className="bg-light">
                                                        <td colSpan={4} className="py-1 px-3 fw-black text-muted" style={{ fontSize: '10px' }}>{t.category?.toUpperCase() || 'HEMATOLOGY'}</td>
                                                    </tr>
                                                )}
                                                <tr className="border-bottom border-light">
                                                    <td className="ps-3">
                                                        <div className="fw-black text-dark" style={{ fontSize: '12px' }}>{t.test_name}</div>
                                                        <div className="text-muted" style={{ fontSize: '9px' }}>{t.category || 'General'}</div>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="fw-black h6 mb-0 d-inline-flex align-items-center gap-2" style={{ color: scale.color }}>
                                                            {t.result || '---'}
                                                            {scale.isAlert && (
                                                                <span className="badge p-1 px-2 border" style={{ fontSize: '8px', background: 'transparent', color: scale.color, borderColor: scale.color }}>{scale.label}</span>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="text-center fw-bold text-muted" style={{ fontSize: '11px' }}>
                                                        {t.normal_range || 'Depends on age'}
                                                    </td>
                                                    <td className="text-end pe-3 fw-bold text-muted" style={{ fontSize: '11px' }}>
                                                        {t.unit || getUnit(t.test_name)}
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>

                        {/* Prescription Block */}
                        {medicationsText && (
                            <div className="prescription-block mt-4 p-3 rounded-3 border border-dashed border-primary bg-primary bg-opacity-5">
                                <h6 className="fw-black text-primary mb-2 text-uppercase d-flex align-items-center gap-2" style={{ fontSize: '11px' }}>
                                    <Stethoscope size={14} /> Clinical Prescription & Advice
                                </h6>
                                <div className="text-dark fw-bold" style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{medicationsText}</div>
                            </div>
                        )}

                        {/* Signature Blocks */}
                        <div className="signature-area mt-5 pt-4">
                            
                            <Row className="text-center g-4">
                                <Col xs={4}>
                                    <div className="signature-box">
                                        <div className="sig-image mb-2 border-bottom border-dark" style={{ height: '40px' }}></div>
                                        <div className="fw-black text-dark" style={{ fontSize: '10px' }}>PATHOLOGIST</div>
                                        <div className="text-muted" style={{ fontSize: '8px' }}>SIGNATURE & STAMP</div>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="signature-box">
                                        <div className="sig-image mb-2 border-bottom border-dark" style={{ height: '40px' }}></div>
                                        <div className="fw-black text-dark" style={{ fontSize: '10px' }}>LAB TECHNICIAN</div>
                                        <div className="text-muted" style={{ fontSize: '8px' }}>SIGNATURE</div>
                                    </div>
                                </Col>
                                <Col xs={4}>
                                    <div className="signature-box">
                                        <div className="sig-image mb-2 border-bottom border-dark" style={{ height: '40px' }}></div>
                                        <div className="fw-black text-dark" style={{ fontSize: '10px' }}>OFFICIAL VERIFICATION</div>
                                        <div className="text-muted" style={{ fontSize: '8px' }}>AUTHORIZED SEAL</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>

                    {/* Bottom Branding Strip */}
                    <div className="branding-strip p-2 bg-primary text-white d-flex justify-content-between align-items-center px-4" style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                         <div className="fw-black" style={{ fontSize: '9px' }}>SAMPLE COLLECTION AT ANY BRANCH</div>
                         <div className="fw-black d-flex align-items-center gap-2" style={{ fontSize: '12px' }}>
                            <Phone size={12} fill="white" /> 0123456789
                         </div>
                    </div>
                </div>
            </Container>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
                
                .medical-print-root { font-family: 'Roboto', sans-serif; background: #eef2f7; }
                .fw-black { font-weight: 900; }
                .report-paper-a4 {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 20px auto;
                    background: white;
                    padding-bottom: 50px;
                }
                .label { font-size: 8px; font-weight: 800; text-uppercase: uppercase; color: #7f8c8d; letter-spacing: 0.5px; }
                .header-blue-bar { height: 8px; background: #0088cc; width: 100%; border-radius: 4px; }
                .clinical-table th { padding: 10px; color: #2c3e50; }
                .clinical-table td { padding: 8px 0; }
                .shadow-2xl { box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25), 0 18px 36px -18px rgba(0, 0, 0, 0.3); }

                @media print {
                    .d-print-none { display: none !important; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    .report-paper-a4 {
                        margin: 0 !important;
                        width: 100% !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    @page { margin: 0; size: A4; }
                }
            `}</style>
        </div>
    );
};

export default MedicalReport;
