import fs from 'fs';
import path from 'path';

const medicalReportPath = 'c:/Users/ibrahim/Desktop/Hospital Application/frontend/src/pages/MedicalReport.jsx';
const labResultsPath = 'c:/Users/ibrahim/Desktop/Hospital Application/frontend/src/Lab/LabResults.jsx';

const getResultScaleFunc = `
    const getResultScale = (result, range) => {
        if (!result || !range || !range.includes('-')) return { percent: 0, color: 'primary', label: '' };
        const [min, max] = range.split('-').map(v => parseFloat(v));
        const val = parseFloat(result);
        if (isNaN(min) || isNaN(max) || isNaN(val)) return { percent: 0, color: 'primary', label: '' };
        
        let percent = ((val - min) / (max - min)) * 100;
        let color = 'success';
        let label = 'Normal';
        if (val < min) { color = 'danger'; label = 'Low'; percent = Math.max(percent, 0); }
        else if (val > max) { color = 'danger'; label = 'High'; percent = Math.min(percent, 100); }
        else if (percent > 85 || percent < 15) { color = 'warning'; label = 'Borderline'; }
        
        return { percent: Math.min(Math.max(percent, 15), 85), color, label };
    };`;

// 1. Update MedicalReport.jsx
let medContent = fs.readFileSync(medicalReportPath, 'utf8');
if (!medContent.includes('const getResultScale =')) {
    medContent = medContent.replace('const [loading, setLoading] = useState(true);', 'const [loading, setLoading] = useState(true);' + getResultScaleFunc);
}
const medTarget = /<td className="py-2 px-3 text-end">[\s\S]*?{t\.result \? \([\s\S]*?<div[\s\S]*?{t\.result}[\s\S]*?<\/div>[\s\S]*?\) : \([\s\S]*?<span[\s\S]*?\.\.\.<\/span>[\s\S]*?\)[\s\S]*?<\/td>/g;
const medReplacement = `<td className="py-2 px-3 text-end">
                                                            {t.result ? (
                                                                <div className="d-flex align-items-center justify-content-end gap-2">
                                                                    <div className={\`px-2 py-1 rounded bg-\${getResultScale(t.result, t.normal_range).color} text-white fw-black d-inline-block text-center shadow-sm\`} style={{ fontSize: '10px', minWidth: '45px' }}>
                                                                        {t.result}
                                                                    </div>
                                                                    <div className="bg-light rounded-pill overflow-hidden d-none d-md-block" style={{ width: '40px', height: '4px' }}>
                                                                        <div 
                                                                            className={\`bg-\${getResultScale(t.result, t.normal_range).color} h-100\`} 
                                                                            style={{ width: \`\${getResultScale(t.result, t.normal_range).percent}%\` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted small fw-bold">...</span>
                                                            )}
                                                         </td>`;
medContent = medContent.replace(medTarget, medReplacement);
fs.writeFileSync(medicalReportPath, medContent);

// 2. Update LabResults.jsx
let labContent = fs.readFileSync(labResultsPath, 'utf8');
if (!labContent.includes('const getResultScale =')) {
    labContent = labContent.replace('const [submitting, setSubmitting] = useState(false);', 'const [submitting, setSubmitting] = useState(false);' + getResultScaleFunc);
}
const labTarget = /<td>[\s\S]*?{t\.result \? \([\s\S]*?<span[\s\S]*?{t\.result}<\/span>[\s\S]*?\) : \([\s\S]*?<span[\s\S]*?PROCESSING<\/span>[\s\S]*?\)[\s\S]*?<\/td>/g;
const labReplacement = `<td>
                                    {t.result ? (
                                      <div className="d-flex align-items-center gap-2">
                                        <span className="fw-black fs-6 text-primary">{t.result}</span>
                                        <div className="bg-light rounded-pill overflow-hidden shadow-inner" style={{ width: '50px', height: '4px' }}>
                                           <div 
                                             className={\`bg-\${getResultScale(t.result, t.normal_range).color} rounded-pill h-100\`} 
                                             style={{ width: \`\${getResultScale(t.result, t.normal_range).percent}%\` }}
                                           ></div>
                                        </div>
                                        {getResultScale(t.result, t.normal_range).label && (
                                           <Badge bg={getResultScale(t.result, t.normal_range).color} className="bg-opacity-10 text-uppercase" style={{ fontSize: '7px' }}>
                                             {getResultScale(t.result, t.normal_range).label}
                                           </Badge>
                                        )}
                                      </div>
                                    ) : (
                                       <span className="text-warning fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>PROCESSING</span>
                                    )}
                                 </td>`;
labContent = labContent.replace(labTarget, labReplacement);
fs.writeFileSync(labResultsPath, labContent);

console.log("Successfully updated MedicalReport.jsx and LabResults.jsx");
