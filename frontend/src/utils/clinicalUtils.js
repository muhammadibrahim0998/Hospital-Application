export const getClinicalAnalytics = (result, range) => {
    if (!result || !range || !range.includes('-')) {
        return { patientPercent: 0, normalRange: 'N/A', status: 'N/A', color: 'primary', val: result || '0' };
    }
    
    const rangeParts = range.match(/(\d+(\.\d+)?)/g);
    if (!rangeParts || rangeParts.length < 2) {
         return { patientPercent: 0, normalRange: 'N/A', status: 'N/A', color: 'primary', val: result || '0' };
    }

    const min = parseFloat(rangeParts[0]);
    const max = parseFloat(rangeParts[1]);
    const val = parseFloat(result.match(/(\d+(\.\d+)?)/)?.[0] || '0');
    
    if (isNaN(min) || isNaN(max) || isNaN(val)) {
        return { patientPercent: 0, normalRange: 'N/A', status: 'N/A', color: 'primary', val: result || '0' };
    }
    
    // Formula: (Value / Max) * 100 to get a relative percentage
    const patientPercent = Math.round((val / max) * 100);
    const normalMinPercent = Math.round((min / max) * 100);
    const normalMaxPercent = 100;
    
    let status = 'Normal';
    let color = 'success';
    if (val < min) { status = 'Low'; color = 'danger'; }
    else if (val > max) { status = 'High'; color = 'danger'; }
    else if (patientPercent > 90 || patientPercent < normalMinPercent + 10) { status = 'Borderline'; color = 'warning'; }
    
    return { 
        patientPercent, 
        normalRange: `${normalMinPercent}% - ${normalMaxPercent}%`,
        status,
        color,
        val,
        min,
        max
    };
};
