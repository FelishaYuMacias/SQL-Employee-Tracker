-- SELECT 
-- role.id AS id, 
-- role.title AS title, 
-- department.dept_name AS department, 
-- role.salary AS salary 
-- FROM role 
-- JOIN department 
-- ON role.department_id = department.id;
USE employee_tracker_db
SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS job_title, department.dept_name AS department, role.salary AS salary, employee.manager_id as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department on role.department_id = department.id;