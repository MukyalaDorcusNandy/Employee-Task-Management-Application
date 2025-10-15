-- Employee Management System Database Schema

-- Admin/Users table for authentication
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  marital_status VARCHAR(20),
  designation VARCHAR(255),
  department_id INT,
  salary DECIMAL(10, 2),
  role VARCHAR(100),
  image_url TEXT,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  leave_type VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status VARCHAR(20) DEFAULT 'present',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_employee_date (employee_id, date),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Salary payments table
CREATE TABLE IF NOT EXISTS salary_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  month VARCHAR(20) NOT NULL,
  year INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Insert default admin (password: admin123)
INSERT INTO admins (email, password, name) VALUES 
('admin@company.com', 'admin123', 'Admin User');

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
('IT', 'Information Technology Department'),
('HR', 'Human Resources Department'),
('Finance', 'Finance and Accounting Department');

-- Insert sample employees
INSERT INTO employees (employee_id, name, email, date_of_birth, gender, marital_status, designation, department_id, salary, role, password) VALUES
('EMP001', 'John Dan', 'john@company.com', '1990-05-15', 'Male', 'Married', 'Senior Developer', 1, 5000.00, 'Developer', 'password123'),
('EMP002', 'Jane hildah', 'jane@company.com', '1992-08-20', 'Female', 'Single', 'HR Manager', 2, 4500.00, 'Manager', 'password123'),
('EMP003', 'Mikel Johnson', 'mike@company.com', '1988-03-10', 'Male', 'Married', 'Accountant', 3, 4000.00, 'Staff', 'password123'),
('EMP004', 'Sarah Willian', 'sarah@company.com', '1995-11-25', 'Female', 'Single', 'Junior Developer', 1, 3500.00, 'Developer', 'password123');

-- Insert sample leave requests
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES
(1, 'Sick Leave', '2025-01-15', '2025-01-17', 'Medical appointment', 'approved'),
(2, 'Annual Leave', '2025-02-01', '2025-02-05', 'Vacation', 'approved'),
(3, 'Sick Leave', '2025-01-20', '2025-01-21', 'Flu', 'pending'),
(4, 'Personal Leave', '2025-01-25', '2025-01-26', 'Family matter', 'rejected');
