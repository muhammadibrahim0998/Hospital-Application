USE hospital_system;

CREATE TABLE IF NOT EXISTS lab_tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    hospital_id INT,
    patient_name VARCHAR(255),
    cnic VARCHAR(50),
    test_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    result TEXT,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    price DECIMAL(10, 2) DEFAULT 0.00,
    normal_range VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
);
