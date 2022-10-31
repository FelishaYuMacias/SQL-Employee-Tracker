USE employee_tracker_db;

INSERT INTO department (dept_name)
VALUES ("Management"),
("Sales");

INSERT INTO employee (dept_name)
VALUES ("Management"),
("Sales");

INSERT INTO role (title,salary,department_id)
VALUES ("Sales Manager", "$100,000",1),
("Salesman", "$50,000",2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Felisha", "Yu-Macias",1)
("Plato","TheDog",2,1);