import db from './config/db.js';
import bcrypt from 'bcryptjs';

async function reset() {
    try {
        const hash = await bcrypt.hash('poweradmin', 10);
        const [res] = await db.query('UPDATE users SET password = ? WHERE email = ?', [hash, 'superadmin@hospital.com']);
        if (res.affectedRows === 0) {
            console.log('Super Admin not found. Creating one...');
            await db.query('INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)',
                ['Super Admin', 'superadmin@hospital.com', hash, 'super_admin']);
            console.log('Super Admin created.');
        } else {
            console.log('Super Admin password reset to: poweradmin');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
reset();
