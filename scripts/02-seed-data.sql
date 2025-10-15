-- Seed initial data for Employee Management System

-- Insert default admin (password: admin123)
INSERT INTO admins (email, password, name) 
VALUES ('admin@company.com', '$2a$10$rKvVLq8h5LZJKxZ5YqXxXeYGxYvHxYvHxYvHxYvHxYvHxYvHxYvHx', 'Admin User')
ON CONFLICT (email) DO NOTHING;

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
('IT', 'Information Technology Department'),
('HR', 'Human Resources Department'),
('Finance', 'Finance and Accounting Department')
ON CONFLICT DO NOTHING;

-- Insert sample employees
INSERT INTO employees (employee_id, name, email, date_of_birth, gender, marital_status, designation, department_id, salary, role, password) VALUES
('EMP001', 'John Dan', 'john@company.com', '1990-05-15', 'Male', 'Married', 'Senior Developer', 1, 5000.00, 'Developer', '$2a$10$rKvVLq8h5LZJKxZ5YqXxXeYGxYvHxYvHxYvHxYvHxYvHxYvHxYvHx'),
('EMP002', 'Jane hildah', 'jane@company.com', '1992-08-20', 'Female', 'Single', 'HR Manager', 2, 4500.00, 'Manager', '$2a$10$rKvVLq8h5LZJKxZ5YqXxXeYGxYvHxYvHxYvHxYvHxYvHxYvHxYvHx'),
('EMP003', 'Mikel Johnson', 'mike@company.com', '1988-03-10', 'Male', 'Married', 'Accountant', 3, 4000.00, 'Staff', '$2a$10$rKvVLq8h5LZJKxZ5YqXxXeYGxYvHxYvHxYvHxYvHxYvHxYvHxYvHx'),
('EMP004', 'Sarah Willian', 'sarah@company.com', '1995-11-25', 'Female', 'Single', 'Junior Developer', 1, 3500.00, 'Developer', '$2a$10$rKvVLq8h5LZJKxZ5YqXxXeYGxYvHxYvHxYvHxYvHxYvHxYvHxYvHx')
ON CONFLICT (employee_id) DO NOTHING;

-- Insert sample leave requests
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES
(1, 'Sick Leave', '2025-01-15', '2025-01-17', 'Medical appointment', 'approved'),
(2, 'Annual Leave', '2025-02-01', '2025-02-05', 'Vacation', 'approved'),
(3, 'Sick Leave', '2025-01-20', '2025-01-21', 'Flu', 'pending'),
(4, 'Personal Leave', '2025-01-25', '2025-01-26', 'Family matter', 'rejected');
