-- Seed initial data for Employee Management System (MySQL)

USE employee_management;

-- Insert default admin (password: admin123)
INSERT IGNORE INTO admins (email, password, name) VALUES 
('admin@company.com', 'admin123', 'Admin User');

-- Insert sample departments
INSERT IGNORE INTO departments (name, description) VALUES
('IT', 'Information Technology Department'),
('HR', 'Human Resources Department'),
('Finance', 'Finance and Accounting Department');

-- Insert sample employees
INSERT IGNORE INTO employees (employee_id, name, email, date_of_birth, gender, marital_status, designation, department_id, salary, role, password) VALUES
('EMP001', 'John Dan', 'john@company.com', '1990-05-15', 'Male', 'Married', 'Senior Developer', 1, 5000.00, 'Developer', 'password123'),
('EMP002', 'Jane hildah', 'jane@company.com', '1992-08-20', 'Female', 'Single', 'HR Manager', 2, 4500.00, 'Manager', 'password123'),
('EMP003', 'Mikel Johnson', 'mike@company.com', '1988-03-10', 'Male', 'Married', 'Accountant', 3, 4000.00, 'Staff', 'password123'),
('EMP004', 'Sarah Willian', 'sarah@company.com', '1995-11-25', 'Female', 'Single', 'Junior Developer', 1, 3500.00, 'Developer', 'password123');

-- Insert sample leave requests
INSERT IGNORE INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES
(1, 'Sick Leave', '2025-01-15', '2025-01-17', 'Medical appointment', 'approved'),
(2, 'Annual Leave', '2025-02-01', '2025-02-05', 'Vacation', 'approved'),
(3, 'Sick Leave', '2025-01-20', '2025-01-21', 'Flu', 'pending'),
(4, 'Personal Leave', '2025-01-25', '2025-01-26', 'Family matter', 'rejected');

-- Insert sample tasks
INSERT IGNORE INTO tasks (title, description, status, priority, due_date, created_by, assigned_to, department_id) VALUES
('Website Redesign', 'Complete redesign of company website with modern UI/UX', 'in_progress', 'high', '2025-02-15', 1, 1, 1),
('HR Policy Update', 'Review and update employee handbook policies', 'todo', 'medium', '2025-02-28', 2, 2, 2),
('Financial Audit', 'Conduct quarterly financial audit and prepare reports', 'todo', 'high', '2025-02-10', 3, 3, 3),
('Marketing Campaign', 'Launch new product marketing campaign', 'completed', 'medium', '2025-01-30', 4, 4, 1),
('Database Migration', 'Migrate legacy database to new system', 'in_progress', 'high', '2025-02-20', 1, 1, 1),
('Team Building Event', 'Organize quarterly team building activities', 'todo', 'low', '2025-03-15', 2, 2, 2);
