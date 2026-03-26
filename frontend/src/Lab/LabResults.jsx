import React, { useState, useContext, useMemo } from "react";
import { useLab } from "../context/LabContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Badge, Button, Modal, Form, Row, Col, Table, InputGroup } from "react-bootstrap";
import { 
  FlaskConical, 
  Printer, 
  Share2, 
  Pill, 
  Search, 
  CheckCircle, 
  Info, 
  FileText, 
  User, 
  ExternalLink,
  Calendar,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ClipboardList,
  Activity,
  Zap,
  Lock,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LabResults() {
  const { user, token } = useContext(AuthContext);
  const { tests, addMedication } = useLab();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [showMedModal, setShowMedModal] = useState(false);
  const [medInput, setMedInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      if (user?.role?.toLowerCase() === "patient") {
        const matchesId = String(t.patient_id) === String(user.id);
        const matchesCnic = t.cnic && user.cnic && t.cnic === user.cnic;
        return matchesId || matchesCnic;
      }
      return true;
    });
  }, [tests, user]);

  const searchFiltered = useMemo(() => {
    return filteredTests.filter(t =>
      (t.patient_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.test_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredTests, searchTerm]);

  const groupedResults = useMemo(() => {
    return searchFiltered.reduce((acc, test) => {
      const key = test.appointment_id ? `appt-${test.appointment_id}` : `date-${test.patient_id}-${new Date(test.date || test.created_at).toDateString()}`;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          patient_name: test.patient_name,
          doctor_name: test.doctor_name,
          date: test.date || test.created_at,
          appointment_id: test.appointment_id,
          hospital_id: test.hospital_id,
          tests: []
        };
      }
      acc[key].tests.push(test);
      return acc;
    }, {});
  }, [searchFiltered]);

  const groupedList = useMemo(() => {
    return Object.values(groupedResults).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [groupedResults]);

  const handleOpenMedModal = (test) => {
    setSelectedTest(test);
    setMedInput(test.medication_given || "");
    setShowMedModal(true);
  };

  const handleSaveMedication = async () => {
    setSubmitting(true);
    try {
      if (selectedTest.isBatch) {
        await Promise.all(selectedTest.tests.map(t => addMedication(t.id, medInput)));
      } else {
        await addMedication(selectedTest.id, medInput);
      }
      setShowMedModal(false);
      setSelectedTest(null);
    } catch (err) {
      alert("Error saving medication.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenBatchMedModal = (group) => {
    const existingMeds = group.tests.find(t => t.medication_given)?.medication_given || "";
    setSelectedTest({ isBatch: true, tests: group.tests, patient_name: group.patient_name, result: "Batch Analysis", test_name: "Consolidated Results" });
    setMedInput(existingMeds);
    setShowMedModal(true);
  };

  const handleViewFullChart = (group) => {
    if (group.appointment_id) {
      window.open(`/medical-report/${group.appointment_id}`, '_blank');
    } else {
      localStorage.setItem('guest_report_data', JSON.stringify(group));
      window.open(`/medical-report/guest`, '_blank');
    }
  };

  const handleShareVisit = (group) => {
    const patientName = group.patient_name || "Guest Patient";
    const doctorName = group.doctor_name ? `DR. ${group.doctor_name.toUpperCase()}` : "RESIDENT";
    const date = new Date(group.date).toLocaleDateString();
    
    const testsStr = group.tests.map(t => `🔹 *${t.test_name}:* ${t.result || 'Pending'}`).join('%0A');
    
    const medsList = group.tests.find(t => t.medication_given)?.medication_given;
    const medsStr = medsList ? medsList.split('\n').filter(Boolean).map((m, i) => `💊 ${i+1}. ${m}`).join('%0A') : 'No Prescriptions';
    
    const text = `🏥 *CITYCARE HOSPITAL* 🏥%0A📞 *Contact:* +92 345 5959000%0A👨‍⚕️ *Consultant:* ${doctorName}%0A━━━━━━━━━━━━━━━━━━━━%0A👤 *Patient:* ${patientName}%0A📅 *Date:* ${date}%0A━━━━━━━━━━━━━━━━━━━━%0A*🧪 INVESTIGATION RESULTS:*%0A${testsStr}%0A━━━━━━━━━━━━━━━━━━━━%0A*📝 CLINICAL PRESCRIPTION:*%0A${medsStr}%0A━━━━━━━━━━━━━━━━━━━━%0A🔗 *View Smart Report:* ${window.location.host}/medical-report/${group.appointment_id || 'guest'}`;
    
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handlePrintVisit = (group) => {
      // Open the report viewer page, passing data via state for guest records to ensure beautiful paper formatting
      if(group.appointment_id) {
          window.open(`/medical-report/${group.appointment_id}?print=true`, '_blank');
      } else {
          // Temporarily store in localStorage to easily pass the complex object to the new tab
          localStorage.setItem('guest_report_data', JSON.stringify(group));
          window.open(`/medical-report/guest?print=true`, '_blank');
      }
  };

  return (
    <Container fluid className="archive-slim-root min-vh-100 py-2 py-md-3">
      {/* Ultra-Compact Header */}
      <div className="archive-compact-header mb-3 p-3 rounded-4 bg-white shadow-2xl position-relative overflow-hidden">
        <div className="accent-blur"></div>
        <Row className="align-items-center g-2 position-relative">
          <Col md={7}>
            <div className="d-flex align-items-center gap-3">
              <div className="archive-icon-box bg-dark text-primary p-2 rounded-3 shadow-lg">
                <Lock size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="fw-black mb-0 tracking-tight text-dark h4" style={{ fontSize: '1.2rem' }}>Health Analytics Archive</h2>
                <div className="d-flex align-items-center gap-2 mt-0">
                   <div className="d-flex align-items-center gap-1 text-muted fw-bold" style={{ fontSize: '9px' }}>
                     <Activity size={10} className="text-primary" /> {filteredTests.length} PARAMETERS SECURED
                   </div>
                   <div className="d-flex align-items-center gap-1 text-success fw-bold" style={{ fontSize: '9px' }}>
                     <Zap size={10} /> SYSTEM ENCRYPTED
                   </div>
                </div>
              </div>
            </div>
          </Col>
          <Col md={5}>
             <InputGroup className="shadow-sm rounded-pill overflow-hidden border border-light">
                <InputGroup.Text className="bg-white border-0 ps-3">
                  <Search size={14} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Filter by test or date..."
                  className="border-0 bg-white py-1 fw-medium shadow-none"
                  style={{ fontSize: '12px' }}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </InputGroup>
          </Col>
        </Row>
      </div>

      <div className="archive-list-container">
        {groupedList.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-5 shadow-sm border border-light">
             <ClipboardList size={48} className="text-muted opacity-20 mb-3" />
             <h5 className="fw-black text-dark">No Diagnostic Records</h5>
             <p className="text-muted small">Your medical history will appear here once processed.</p>
          </div>
        ) : (
          groupedList.map((group) => (
            <Card key={group.id} className="shadow-sm rounded-4 overflow-hidden mb-4 transition-all" style={{ border: '2px solid #e2c044' }}>
               <Card.Header className="bg-white border-0 py-2 px-3 bg-glass-header border-bottom" style={{ borderColor: '#e2c044' }}>
                  <Row className="align-items-center g-3">
                     <Col xs={12} md={7}>
                        <div className="d-flex align-items-center gap-3">
                           <div className="date-badge bg-primary bg-opacity-10 text-primary p-2 rounded-3 text-center" style={{ minWidth: '45px' }}>
                              <div className="fw-black h5 mb-0" style={{ lineHeight: '1' }}>{new Date(group.date).getDate()}</div>
                              <div className="fw-black uppercase" style={{ fontSize: '7.5px', letterSpacing: '1px' }}>{new Date(group.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                           </div>
                           <div>
                              <div className="d-flex align-items-center gap-2 mb-0">
                                 <h4 className="fw-black mb-0 text-dark h5 tracking-tight">{group.patient_name?.toUpperCase() || "PATIENT"}</h4>
                                 <Badge bg="dark" className="rounded-1 fw-black" style={{ fontSize: '8px' }}>RECORD #{group.appointment_id || '555'}</Badge>
                              </div>
                              <div className="d-flex align-items-center gap-2 text-muted fw-bold" style={{ fontSize: '10px' }}>
                                 <User size={12} className="text-primary" /> DR. {group.doctor_name?.toUpperCase() || 'RESIDENT'}
                              </div>
                           </div>
                        </div>
                     </Col>
                     <Col xs={12} md={5} className="text-md-end">
                        <div className="d-flex flex-wrap gap-2 justify-content-end">
                            <Button 
                                variant="outline-success" 
                                size="sm" 
                                className="rounded-pill px-3 fw-black border-2 d-flex align-items-center gap-2"
                                style={{ fontSize: '9px' }}
                                onClick={() => handleShareVisit(group)}
                            >
                                <Share2 size={12} /> SHARE
                            </Button>
                            <Button 
                                variant="outline-dark" 
                                size="sm" 
                                className="rounded-pill px-3 fw-black border-2 d-flex align-items-center gap-2"
                                style={{ fontSize: '9px' }}
                                onClick={() => handlePrintVisit(group)}
                            >
                                <Printer size={12} /> PRINT
                            </Button>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                className="rounded-pill px-4 fw-black border-0 shadow-lg btn-premium-sky d-flex align-items-center gap-2"
                                style={{ fontSize: '9px' }}
                                onClick={() => handleViewFullChart(group)}
                            >
                                <ExternalLink size={12} /> FULL REPORT
                            </Button>
                        </div>
                     </Col>
                  </Row>
               </Card.Header>
               <Card.Body className="p-0">
                   <div className="table-responsive">
                     <Table className="align-middle mb-0 lab-classic-table">
                        <thead className="lab-classic-header">
                           <tr>
                              <th style={{ width: '45%' }}>Investigation Parameter</th>
                              <th style={{ width: '25%' }} className="text-start">Result</th>
                              <th style={{ width: '30%' }} className="text-start">Status</th>
                           </tr>
                        </thead>
                        <tbody>
                           {group.tests.map(t => (
                             <tr key={t.id}>
                                <td>
                                   <div className="fw-bold">{t.test_name}</div>
                                   <div className="text-muted" style={{ fontSize: '11px' }}>{t.category || 'General Diagnostic'}</div>
                                </td>
                                <td>
                                   {t.result ? (
                                     <span className="fw-bold fs-6">{t.result}</span>
                                   ) : (
                                      <span className="text-warning fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>PROCESSING</span>
                                   )}
                                </td>
                                <td>
                                   <span className={`fw-bold text-uppercase ${t.status === 'done' ? 'text-success' : 'text-warning'}`} style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                     {t.status === 'done' ? 'VERIFIED' : 'PENDING'}
                                   </span>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </Table>
                  </div>

                  <div className="py-2 px-3 bg-slate-50 border-top position-relative" style={{ borderColor: '#e2c044' }}>
                     <div className="prescription-pad-accent"></div>
                     <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                         <div className="d-flex align-items-center gap-2">
                             <div className="p-1 bg-primary rounded-circle text-white shadow-sm">
                                 <Stethoscope size={14} />
                             </div>
                             <span className="fw-black text-dark text-uppercase tracking-tight" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Clinical Prescription & Directions</span>
                         </div>
                         {(user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'hospital_admin') && (
                             <Button variant="primary" size="sm" className="rounded-pill px-3 py-1 fw-black border-0 shadow-sm btn-premium-sky d-flex align-items-center gap-1 hover-lift" style={{ fontSize: '10px' }} onClick={() => handleOpenBatchMedModal(group)}>
                                 <Pill size={12} /> ENTER MEDICINE
                             </Button>
                         )}
                     </div>
                     {group.tests.some(t => t.medication_given) && (
                        <div className="bg-white p-2 px-3 rounded-4 shadow-sm border border-light mt-2">
                            {group.tests.find(t => t.medication_given)?.medication_given.split('\n').filter(Boolean).map((line, idx, arr) => (
                                <div key={idx} className="d-flex align-items-start gap-2" style={{ borderBottom: idx === arr.length - 1 ? 'none' : '1px dashed #e2e8f0', paddingBottom: idx === arr.length - 1 ? '0' : '8px', marginBottom: idx === arr.length - 1 ? '0' : '8px' }}>
                                    <div className="p-1 bg-primary bg-opacity-10 text-primary rounded-circle border border-primary border-opacity-25 flex-shrink-0 mt-1">
                                        <Pill size={12} />
                                    </div>
                                    <div className="fw-bold text-dark mt-1" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                                        {line}
                                    </div>
                                </div>
                            ))}
                        </div>
                     )}
                  </div>
               </Card.Body>
            </Card>
          ))
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .archive-slim-root { font-family: 'Inter', sans-serif; background-color: #f1f5f9; }
        .fw-black { font-weight: 900; }
        .tracking-tight { letter-spacing: -1px; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); }
        .bg-slate-50 { background-color: #f8fafc; }
        
        .accent-blur {
          position: absolute; top: -50px; right: -50px;
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(13,110,253,0.05) 0%, transparent 70%);
          z-index: 0;
        }

        .archive-visit-card { border: none !important; }
        .hover-lift:hover { transform: translateY(-3px); }
        
        .slim-table thead th { border: none !important; }
        .slim-table tbody tr:hover { background-color: rgba(13,110,253,0.015) !important; }
        
        .btn-premium-sky {
          background: linear-gradient(135deg, #0d6efd 0%, #0d5be1 100%);
          letter-spacing: 0.5px;
        }

        .op-50 { opacity: 0.5; }
        .hover-op-100:hover { opacity: 1; }
        .transform-hover:hover { transform: scale(1.1); }
        
        .archive-compact-header { border: 1px solid #e2e8f0; }
        .bg-glass-header { background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); }

        .prescription-pad-accent {
            position: absolute; top: 0; left: 0; width: 4px; height: 100%;
            background: linear-gradient(to bottom, #0d6efd, transparent);
        }

        /* Lab Classic Table Styles based on user formatting request */
        .lab-classic-table {
            width: 100%;
            border-collapse: collapse;
            font-family: inherit;
        }
        .lab-classic-header th {
            background-color: #dcb324 !important; /* Golden/yellow header */
            color: #000 !important;
            font-size: 13.5px !important;
            font-weight: 900 !important;
            padding: 6px 16px !important;
            border-bottom: 2px solid #000 !important;
            border-top: none !important;
        }
        .lab-classic-table tbody tr:nth-child(odd) {
            background-color: #ffffff !important;
        }
        .lab-classic-table tbody tr:nth-child(even) {
            background-color: #fdf5d3 !important; /* Pale yellow */
        }
        .lab-classic-table tbody td {
            color: #000 !important;
            font-size: 13px !important;
            padding: 6px 16px !important;
            border: none !important;
        }
      `}</style>
      
      {/* Keeping Modal structures for compatibility */}
      <Modal show={showMedModal} onHide={() => setShowMedModal(false)} centered size="sm">
        <Modal.Header closeButton className="border-0 bg-primary text-white p-3">
          <Modal.Title className="fw-black h6 mb-0 text-uppercase letter-spacing-1"><Stethoscope size={16} className="me-2" /> Rx Protocol</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3 bg-light">
          <Form.Group>
            <Form.Label className="small fw-black text-muted text-uppercase mb-2" style={{ fontSize: '9px' }}>Dosage & Schedule</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              className="border-0 bg-white shadow-sm p-3 rounded-4 fw-bold"
              style={{ fontSize: '13px' }}
              value={medInput}
              onChange={e => setMedInput(e.target.value)}
              placeholder="e.g. 1 Tablet Morning/Night after food"
            />
          </Form.Group>
          <Button variant="primary" className="w-100 py-3 rounded-pill fw-black shadow-lg mt-3 btn-premium-sky border-0" onClick={handleSaveMedication} disabled={submitting}>
            {submitting ? "VERIFYING..." : "COMMIT PRESCRIPTION"}
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
