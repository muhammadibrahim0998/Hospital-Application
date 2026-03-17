import React, { useState, useContext } from "react";
import { useLab } from "../context/LabContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Badge, Button, Modal, Form, Row, Col, Table } from "react-bootstrap";
import { FlaskConical, Printer, Share2, Pill, Search, CheckCircle, Info, FileText, User } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function LabResults() {
  const { user, token } = useContext(AuthContext);
  const { tests, addMedication } = useLab();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [showMedModal, setShowMedModal] = useState(false);
  const [medInput, setMedInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredTests = tests.filter((t) => {
    if (user?.role?.toLowerCase() === "patient") {
      // Check both patient_id and cnic for robustness
      const matchesId = String(t.patient_id) === String(user.id);
      const matchesCnic = t.cnic && user.cnic && t.cnic === user.cnic;
      return matchesId || matchesCnic;
    }
    return true;
  });

  const filteredResults = filteredTests.filter(t =>
    (t.patient_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.test_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group results by Appointment ID (or patient_id + date if no appt_id)
  const groupedResults = filteredResults.reduce((acc, test) => {
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

  const groupedList = Object.values(groupedResults).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleOpenMedModal = (test) => {
    setSelectedTest(test);
    setMedInput(test.medication_given || "");
    setShowMedModal(true);
  };

  const handleSaveMedication = async () => {
    setSubmitting(true);
    try {
      // If we are in batch mode (selectedGroup exists), apply to all tests in group
      if (selectedTest.isBatch) {
        await Promise.all(selectedTest.tests.map(t => addMedication(t.id, medInput)));
      } else {
        // Use context function instead of manual axios to handle token/headers internally
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
    const existingMeds = group.tests.map(t => t.medication_given).filter(m => m).join(" | ");
    setSelectedTest({ isBatch: true, tests: group.tests, patient_name: group.patient_name, result: "Batch Analysis", test_name: "Consolidated Results" });
    setMedInput(existingMeds);
    setShowMedModal(true);
  };

  const handleShareWhatsApp = (test, isBatch = false, group = null) => {
    const patientName = isBatch ? (group.patient_name || "Patient") : (test.patient_name || (user?.role === 'patient' ? user.name : "Guest Patient"));
    const hospitalName = user?.hospital_name || user?.hospitalName || "City Hospital Diagnostics";
    
    let message = `*⚕️ CLINICAL REPORT ANALYSIS*%0A---------------------------%0A*🏥 Hospital:* ${hospitalName}%0A*👤 Patient:* ${patientName}%0A`;
    
    if (isBatch && group) {
      message += `*📅 Visit Date:* ${new Date(group.date).toLocaleDateString()}%0A%0A*Investigations Done:*%0A`;
      group.tests.forEach(t => {
        message += `• *${t.test_name}:* ${t.result || "Awaiting"}%0A`;
      });
      const batchMeds = group.tests.map(t => t.medication_given).filter(m => m).join(" | ");
      if (batchMeds) message += `%0A*📝 Physician's Advice:*%0A${batchMeds}%0A`;
    } else {
      message += `*🧪 Test:* ${test.test_name}%0A*📊 Result:* ${test.result || "Pending"}%0A`;
      if (test.medication_given) message += `*📝 Medication:* ${test.medication_given}%0A`;
    }
    
    message += `%0A_Verified digital record by ${hospitalName}_`;
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handlePrintFullReport = (group) => {
    const patientName = group.patient_name || (user?.role === 'patient' ? user.name : "Guest Patient");
    const hospitalName = "CITY CARE HOSPITAL & PATHOLOGY";
    const medications = group.tests.map(t => t.medication_given).filter(m => m).join(" | ");

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Lab Report - ${patientName}</title>
          <style>
            @page { size: auto; margin: 2mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 2px; color: #000; line-height: 0.95; font-size: 9px; }
            .report-box { border: 1px solid #000; padding: 3px; min-height: 98vh; display: flex; flex-direction: column; }
            .header { border-bottom: 2px solid #000; padding-bottom: 2px; text-align: center; margin-bottom: 3px; }
            .hospital { font-size: 16px; font-weight: 900; color: #000; text-transform: uppercase; margin-bottom: 0px; }
            .subtitle { font-size: 7px; font-weight: 800; letter-spacing: 0.5px; color: #333; }
            .meta-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 2px; margin-bottom: 5px; border-bottom: 0.5px solid #999; padding-bottom: 3px; }
            .meta-item { font-size: 8px; }
            .table-wrap { flex-grow: 1; }
            table { width: 100%; border-collapse: collapse; margin-top: 2px; }
            th, td { border: 0.5px solid #333; padding: 1px 4px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: 900; font-size: 8px; text-transform: uppercase; }
            .res-bold { font-weight: 900; font-size: 10px; }
            .med-box { border: 0.5px solid #000; background: #fff; padding: 3px; margin-top: 3px; }
            .med-title { font-weight: bold; font-size: 8px; text-decoration: underline; margin-bottom: 1px; display: block; }
            .footer { margin-top: auto; padding-top: 3px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 7px; }
            .sig-box { text-align: center; width: 100px; border-top: 0.5px solid #000; padding-top: 1px; }
          </style>
        </head>
        <body>
          <div class="report-box">
            <div class="header">
              <div class="hospital">${hospitalName}</div>
              <div class="subtitle">AUTOMATED PATHOLOGY INVESTIGATION REPORT</div>
            </div>
            
            <div class="meta-grid">
              <div class="meta-item"><strong>Patient:</strong> ${patientName.toUpperCase()}</div>
              <div class="meta-item"><strong>Visit ID:</strong> ${group.appointment_id || 'N/A'}</div>
              <div class="meta-item" style="text-align: right;"><strong>Visit Date:</strong> ${new Date(group.date).toLocaleDateString()}</div>
              <div class="meta-item"><strong>Ref By:</strong> Dr. ${group.doctor_name || 'Medical Officer'}</div>
              <div class="meta-item"><strong>Specimen:</strong> Serum/Plasma</div>
              <div class="meta-item" style="text-align: right;"><strong>Reporting:</strong> ${new Date().toLocaleTimeString()}</div>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style="width: 40%">INVESTIGATION</th>
                    <th style="width: 25%; text-align: center;">OBSERVED VALUE</th>
                    <th style="width: 20%; text-align: center;">NORMAL RANGE</th>
                    <th style="width: 15%; text-align: center;">UNIT</th>
                  </tr>
                </thead>
                <tbody>
                  ${group.tests.map(t => `
                    <tr>
                      <td><strong>${t.test_name}</strong></td>
                      <td class="res-bold" style="text-align: center;">${t.result || '---'}</td>
                      <td style="text-align: center;">${t.normal_range || 'N/A'}</td>
                      <td style="text-align: center;">${t.test_name.includes('Sugar') ? 'mg/dL' : (t.test_name.includes('ALT') ? 'U/L' : '---')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            ${medications ? `
            <div class="med-box">
              <span class="med-title">DOCTOR'S CLINICAL ADVICE & MEDICATION:</span>
              <div style="font-weight: 600; font-size: 11px;">${medications}</div>
            </div>` : ''}

            <div class="footer">
              <div class="sig-box">
                <strong>Lab Technologist</strong><br>Checked & Verified
              </div>
              <div style="text-align: center; color: #666;">
                This is a computer generated report.<br>Correlate clinically.
              </div>
              <div class="sig-box">
                <strong>Pathologist</strong><br>MBBS, FCPS (Path)
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <Container fluid className="py-4 px-md-5 min-vh-100" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3 bg-white p-4 rounded-5 shadow-lg border-start border-5 border-primary">
        <div>
          <h1 className="fw-900 text-dark mb-1" style={{ letterSpacing: '-1px' }}>Smart Health Archive</h1>
          <p className="text-muted mb-0 fw-medium">Premium digital vault for your laboratory investigations</p>
        </div>
        <div className="position-relative" style={{ width: "300px" }}>
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-primary opacity-50" size={20} />
          <Form.Control
            placeholder="Search investigations..."
            className="ps-5 border-0 shadow-sm rounded-pill py-3 fw-medium"
            style={{ background: '#f1f3f5' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Row className="g-4">
        {groupedList.length === 0 ? (
          <Col xs={12}>
            <div className="text-center py-5 bg-white rounded-5 shadow-sm">
              <FlaskConical size={64} className="text-primary opacity-10 mb-3" />
              <h4 className="text-muted fw-bold">No Records Found</h4>
              <p className="text-muted small">Your health data will appear here once finalized.</p>
            </div>
          </Col>
        ) : groupedList.map(group => (
          <Col key={group.id} lg={12}>
            <Card className="border-0 shadow-lg rounded-5 overflow-hidden mb-4 transition-all hover-lift">
              <Card.Header className="bg-white border-0 py-4 px-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div className="d-flex align-items-center gap-3">
                   <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                     <FileText className="text-primary" size={28} />
                   </div>
                   <div>
                     <Badge bg="primary" className="rounded-pill px-3 py-2 fw-bold mb-1" style={{ fontSize: "12px" }}>
                        VISIT: {new Date(group.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                     </Badge>
                     <div className="small text-muted fw-bold">REF: {group.appointment_id ? `#${group.appointment_id}` : 'INTERNAL'}</div>
                   </div>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  {(user?.role === "doctor" || user?.role === "admin") && (
                    <Button variant="warning" className="rounded-pill px-4 fw-bold text-dark border-0 shadow-sm py-2" onClick={() => handleOpenBatchMedModal(group)}>
                      <Pill size={18} className="me-2" /> Add Clinical Advice
                    </Button>
                  )}
                  <Button variant="success" className="rounded-pill px-4 fw-bold border-0 shadow-sm py-2" onClick={() => handleShareWhatsApp(null, true, group)}>
                    <Share2 size={18} className="me-2" /> WhatsApp
                  </Button>
                  <Button variant="dark" className="rounded-pill px-4 fw-bold shadow-sm py-2" onClick={() => handlePrintFullReport(group)}>
                     <Printer size={18} className="me-2" /> Print Report
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="px-4 pb-5">
                <div className="mb-4 p-3 bg-light rounded-4 border-start border-5 border-info">
                  <h4 className="fw-900 text-dark mb-1">
                    {group.patient_name || (user?.role === "patient" ? user.name : "Guest")}
                  </h4>
                  <div className="d-flex align-items-center gap-2 text-muted fw-bold small">
                    <User size={14} className="text-info" /> Attending Physician: {group.doctor_name || "Medical Officer"}
                  </div>
                </div>

                <div className="table-responsive rounded-3 border border-light shadow-sm">
                  <Table borderless hover className="align-middle mb-0 bg-white table-sm">
                    <thead className="bg-dark text-white">
                      <tr className="small fw-bold text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                        <th className="px-3 py-2">Investigation</th>
                        <th className="text-center">Result</th>
                        <th className="text-center">Normal Range</th>
                        <th className="text-center">Status</th>
                        <th className="text-end px-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.tests.map(t => (
                        <tr key={t.id} className="border-bottom border-light">
                          <td className="px-4 py-3">
                            <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>{t.test_name}</div>
                            <div className="text-muted extra-small">{t.category || "Biochemistry"}</div>
                          </td>
                          <td className="text-center">
                            {t.result ? (
                              <div className="bg-primary bg-opacity-10 py-1 rounded-2">
                                <span className="text-primary fw-900" style={{ fontSize: '16px' }}>{t.result}</span>
                              </div>
                            ) : (
                              <Badge bg="warning" className="text-dark bg-opacity-25 border-0">Awaiting Lab</Badge>
                            )}
                          </td>
                          <td className="text-center font-monospace text-muted fw-bold">{t.normal_range || "---"}</td>
                          <td className="text-center">
                            <Badge bg={t.status === 'done' ? 'success' : 'warning'} className="rounded-pill px-3 py-2 border-0" style={{ fontSize: '10px' }}>
                              {t.status === 'done' ? '✓ VERIFIED' : '⏳ IN PROCESS'}
                            </Badge>
                          </td>
                          <td className="text-end px-4">
                            <div className="d-flex gap-3 justify-content-end">
                              <Button variant="link" className="p-0 text-success hover-scale" title="Share Single" onClick={() => handleShareWhatsApp(t)}><Share2 size={20} /></Button>
                              {(user?.role === "doctor" || user?.role === "admin") && (
                                <Button variant="link" className="p-0 text-warning hover-scale" title="Edit Advice" onClick={() => handleOpenMedModal(t)}><Pill size={20} /></Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {group.tests.some(t => t.medication_given) && (
                  <div className="bg-warning bg-opacity-10 p-4 rounded-5 mt-5 border border-warning border-opacity-25" style={{ borderStyle: 'dashed' }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-warning p-2 rounded-circle shadow-sm">
                        <Pill size={20} className="text-white" />
                      </div>
                      <span className="h5 fw-900 text-dark mb-0">Physician's Clinical Guidance</span>
                    </div>
                    <div className="fs-5 text-dark fw-medium ps-1">
                      {group.tests.map(t => t.medication_given).filter(m => m).map((m, i) => (
                        <div key={i} className="mb-2 d-flex gap-2">
                          <div className="mt-1"><div style={{ width: '8px', height: '8px', background: '#ffc107', borderRadius: '50%' }}></div></div>
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showMedModal} onHide={() => setShowMedModal(false)} centered backdrop="static" size="lg">
        <Modal.Header closeButton className="border-0 bg-warning p-4 rounded-top-5">
          <Modal.Title className="fw-900 h4 mb-0 text-dark">
            <Pill className="me-2" size={24} /> Clinical Prescription
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-5 bg-white">
          {selectedTest && (
            <>
              <div className="bg-light p-4 rounded-5 mb-4 shadow-sm border-start border-5 border-warning">
                <div className="fw-900 text-dark fs-4 mb-2">{selectedTest.test_name} Clinical Analysis</div>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="text-muted fw-bold">Observed Value:</span>
                  <span className="text-primary fw-900 fs-2">{selectedTest.result}</span>
                </div>
                <div className="small text-muted fw-bold mt-2">PATIENT: {selectedTest.patient_name}</div>
              </div>
              <Form.Group>
                <Form.Label className="small fw-900 text-muted text-uppercase mb-3" style={{ letterSpacing: '2px' }}>Medical Advice / Dosage Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  className="border-0 shadow-sm rounded-5 p-4 fs-5"
                  style={{ background: '#f8f9fa' }}
                  placeholder="Enter clear instructions for the patient..."
                  value={medInput}
                  onChange={e => setMedInput(e.target.value)}
                />
              </Form.Group>
              <div className="d-grid gap-3 mt-5">
                <Button
                  variant="warning"
                  className="py-3 rounded-pill fw-900 border-0 shadow-lg text-dark fs-5"
                  onClick={handleSaveMedication}
                  disabled={submitting}
                >
                  {submitting ? "Finalizing..." : "✓ Finalize Advice & Notify Patient"}
                </Button>
                <Button variant="link" className="text-muted fw-bold text-decoration-none" onClick={() => setShowMedModal(false)}>Cancel</Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;900&display=swap');
        .lab-results-main, body, .modal-content { font-family: 'Outfit', sans-serif !important; }
        .fw-900 { font-weight: 900 !important; }
        .extra-small { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.6; }
        .hover-lift { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .hover-lift:hover { transform: translateY(-8px); shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .hover-scale { transition: transform 0.2s; }
        .hover-scale:hover { transform: scale(1.2); }
        .bg-dark { background-color: #1a1a1a !important; }
      `}</style>
    </Container>
  );
}
