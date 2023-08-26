USE employee_db;
-- sample departments for testing
INSERT INTO departments (name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Marketing'),
  ('Human Resource');

-- sample roles
INSERT INTO roles (title, salary, department_id) VALUES
  ('Sales Manager', 70000.00, 1),
  ('Sales Representative', 50000.00, 1),
  ('Software Engineer', 80000.00, 2),
  ('Marketing Manager', 60000.00, 3),
  ('HR Coordinator', 60000.00, 4);

-- sample employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('Mike', 'Tyson', 2, NULL),
  ('Michael', 'Jackson', 3, NULL),
  ('Michel', 'Jordan', 4, NULL);
