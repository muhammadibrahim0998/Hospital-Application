import fs from 'fs';

const files = [
    'c:/Users/ibrahim/Desktop/Hospital Application/frontend/src/pages/DoctorDashboard.jsx',
    'c:/Users/ibrahim/Desktop/Hospital Application/frontend/src/pages/PatientDashboard.jsx',
    'c:/Users/ibrahim/Desktop/Hospital Application/frontend/src/Lab/LabResults.jsx',
    'c:/Users/ibrahim/Desktop/Hospital Application/frontend/src/pages/MedicalReport.jsx'
];

const helperFunc = `
  const getResultScale = (result, range) => {
    if (!result || !range || !range.includes('-')) return { percent: 0, color: 'primary', label: '', patientPercent: 0, normalRange: 'N/A', status: 'N/A' };
    const rangeParts = range.match(/(\\d+(\\.\\d+)?)/g);
    if (!rangeParts || rangeParts.length < 2) return { percent: 0, color: 'primary', label: '', patientPercent: 0, normalRange: 'N/A', status: 'N/A' };
    const min = parseFloat(rangeParts[0]);
    const max = parseFloat(rangeParts[1]);
    const val = parseFloat(result.match(/(\\d+(\\.\\d+)?)/)?.[0] || '0');
    if (isNaN(min) || isNaN(max) || isNaN(val)) return { percent: 0, color: 'primary', label: '', patientPercent: 0, normalRange: 'N/A', status: 'N/A' };
    
    let percent = ((val - min) / (max - min)) * 100;
    const patientPercent = Math.round((val / max) * 100);
    const normalMinPercent = Math.round((min / max) * 100);
    
    let color = 'success';
    let label = 'Normal';
    if (val < min) { color = 'danger'; label = 'Low'; percent = 10; }
    else if (val > max) { color = 'danger'; label = 'High'; percent = 90; }
    else if (percent > 85 || percent < 15) { color = 'warning'; label = 'Borderline'; }
    
    return { 
        percent: Math.min(Math.max(percent, 5), 100), 
        color, 
        label, 
        patientPercent, 
        normalRange: \`\${normalMinPercent}% - 100%\`,
        status: label
    };
  };
`;

// 1. DOCTOR DASHBOARD MODAL
let docContent = fs.readFileSync(files[0], 'utf8');
if (!docContent.includes('const getResultScale =')) {
    docContent = docContent.replace('const DoctorDashboard = () => {', 'const DoctorDashboard = () => {' + helperFunc);
}
const docModalTarget = /{medicationData\.test_name && \([\s\S]*?<div className="mb-3 p-3 rounded-4 bg-white border border-light shadow-sm">[\s\S]*?<\/div>[\s\S]*?\)}/g;
const docModalReplacement = `{medicationData.test_name && (
                        <div className="mb-3 p-3 rounded-4 bg-white border border-light shadow-sm overflow-hidden">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="text-muted fw-black" style={{ fontSize: '9px', letterSpacing: '1px' }}>CLINICAL ANALYTICS</div>
                                <Badge bg="primary" className="bg-opacity-10 text-primary border-0" style={{ fontSize: '7px' }}>PROFESSIONAL DATA</Badge>
                            </div>
                            <Table borderless size="sm" className="mb-0">
                                <tbody>
                                    <tr className="border-bottom border-light">
                                        <td className="ps-0 py-1 text-muted small fw-bold" style={{ fontSize: '10px' }}>Normal Baseline</td>
                                        <td className="pe-0 py-1 text-end fw-black text-primary" style={{ fontSize: '11px' }}>{getResultScale(medicationData.result, medicationData.normal_range || '15-45').normalRange}</td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0 py-1 text-muted small fw-bold" style={{ fontSize: '10px' }}>Patient Status</td>
                                        <td className="pe-0 py-1 text-end">
                                            <span className={\`fw-black text-\${getResultScale(medicationData.result, medicationData.normal_range || '15-45').color}\`} style={{ fontSize: '13px' }}>
                                                {getResultScale(medicationData.result, medicationData.normal_range || '15-45').patientPercent}% {getResultScale(medicationData.result, medicationData.normal_range || '15-45').status}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    )}`;
fs.writeFileSync(files[0], docContent.replace(docModalTarget, docModalReplacement));

// 2. PATIENT DASHBOARD WIDGET
let patContent = fs.readFileSync(files[1], 'utf8');
const patTarget = /<div className="fw-bold text-primary" style={{ fontSize: '10px' }}>[\s\S]*?{report\.result \|\| "Awaiting Result"}[\s\S]*?<\/div>/g;
const patReplacement = `<div className="fw-bold text-primary" style={{ fontSize: '10px' }}>
                               {getResultScale(report.result, report.normal_range).patientPercent}% STATUS
                               <span className="text-muted ms-1" style={{ fontSize: '8px' }}>/ {getResultScale(report.result, report.normal_range).normalRange}</span>
                            </div>`;
fs.writeFileSync(files[1], patContent.replace(patTarget, patReplacement));

// 3. LAB RESULTS TABLE
let labContent = fs.readFileSync(files[2], 'utf8');
const labTarget = /<span className="fw-black fs-6 text-primary">{t\.result}<\/span>/g;
const labReplacement = `<span className="fw-black fs-6 text-primary">{getResultScale(t.result, t.normal_range).patientPercent}%</span>`;
fs.writeFileSync(files[2], labContent.replace(labTarget, labReplacement));

// 4. MEDICAL REPORT TABLE
let repContent = fs.readFileSync(files[3], 'utf8');
const repTarget = /<div className={\`px-2 py-1 rounded bg-\${getResultScale\(t\.result, t\.normal_range\)\.color} text-white fw-black d-inline-block text-center shadow-sm\`} style={{ fontSize: '10px', minWidth: '45px' }}>[\s\S]*?{t\.result}[\s\S]*?<\/div>/g;
const repReplacement = `<div className={\`px-2 py-1 rounded bg-\${getResultScale(t.result, t.normal_range).color} text-white fw-black d-inline-block text-center shadow-sm\`} style={{ fontSize: '10px', minWidth: '55px' }}>
                                                                        {getResultScale(t.result, t.normal_range).patientPercent}%
                                                                    </div>`;
fs.writeFileSync(files[3], repContent.replace(repTarget, repReplacement));

console.log("Professional Clinical Analytics updated across all dashboards.");
