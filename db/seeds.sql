USE employee_tracker_db;

INSERT INTO department (dept_name)
VALUES ("Management"),
("Sales"), ("Human Resources");

INSERT INTO role (title,salary,department_id)
VALUES ("Sales Manager", "100000",1),
("Salesman", "50000",2), ("HR Manager", "100000",3),("HR Assistant", "50000",3);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Felisha","Yu",1,NULL),
("Plato","TheDog",2,1), ("Jose","Macias",3,NULL);