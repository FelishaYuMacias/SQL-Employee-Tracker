require("dotenv").config();

const inquirer = require("inquirer")
const mysql = require("mysql2");
const { start } = require("repl");

const PORT = process.env.PORT || 3001;
const db = mysql.createConnection(
    {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    },
    console.log(`Connected to the employee_tracker_db.`)
  );


function startQuestion() {

    inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choices',
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Update employee manager", "Exit"]
    
        }
    ]).then ((response)=>{
        console.log(response)
        switch (response.choices){
            case "View all departments":
                viewDeparments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            case "Add a department":
                addDeparment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateRole();
                break;
            case "Update employee manager":
                    updateManager();
                    break;
            default:
                console.log("See you next time!");
                db.end();
                break;
        }
    })
}
//function to view all departments
function viewDeparments () {
    db.query('SELECT department.id, department.dept_name AS department FROM department',(err, data)=>{
            if(err){
                console.log(err);
            } else {
                    console.table(data)
                    console.log("See Table")
                    startQuestion ()
                    }
            })
    
}

function viewRoles () {
    db.query('SELECT role.id AS id, role.title AS title, department.dept_name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id',(err, data)=>{
        if(err){
            console.log(err);
        } else {
                console.table(data)
                console.log("See Table")
                    startQuestion ()
                }
        })

    }

function viewEmployees () {
    db.query(`
    SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title,
    department.dept_name AS department, 
    role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee 
    JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON manager.id=employee.manager_id`,(err, data)=>{
        if(err){
            console.log(err);
        } else {
                console.table(data)
                console.log("See Table")
                    startQuestion ()
                }
        })

}

function addDeparment () {
    inquirer.prompt({
        name: "dept_name",
        message: "What is the name of the department?",
        type: "input"
    }).then(({ dept_name }) => {
        db.query("INSERT INTO department(dept_name)VALUES(?)",[dept_name],(err)=>{
            if(err){
                console.log(err);
            } else {    
            console.log("Department added!")
                    startQuestion ()
                    }
                })
    })
}

function addRole () {
    inquirer.prompt([

        {
            name: "title",
            message: "What is the title of the role?",
            type: "input"
        },
        {
            name: "salary",
            message: "What is the salary of the role?",
            type: "input" 
        },
        {
            name: "department_id",
            message: "What is the department id?",
            type: "input"
        }
    ]).then(({title,salary,department_id }) => {
        db.query("INSERT INTO role(title,salary,department_id)VALUES(?,?,?)",[title,salary,department_id],(err,data)=>{
            if(err){
                console.log(err);
            } else {    
            console.log("Role added!")
            startQuestion ()
                    }
                })
    })
}

function addEmployee () {
    inquirer.prompt([

        {
            name: "first_name",
            message: "What is the first name of the employee?",
            type: "input"
        },
        {
            name: "last_name",
            message: "What is the last name of the employee?",
            type: "input" 
        },
        {
            name: "role_id",
            message: "What is the employee's role id?",
            type: "input"
        },
        {
            name: "manager_id",
            message: "What is the employee's manager's id?",
            type: "input"
        }
    ]).then(({first_name,last_name,role_id, manager_id }) => {
        //allows for no manager id
        if (manager_id){
            db.query("INSERT INTO employee(first_name,last_name,role_id, manager_id)VALUES(?,?,?,?)",[first_name,last_name,role_id, manager_id],(err,data)=>{
                if(err){
                    console.log(err);
                } else {    
                console.log("Employee added!")
                startQuestion ()
                        }
                    }) 
        } else {
            db.query("INSERT INTO employee(first_name,last_name,role_id)VALUES(?,?,?)",[first_name,last_name,role_id],(err,data)=>{
                if(err){
                    console.log(err);
                } else {    
                console.log("Employee added!")
                startQuestion ()
                        }
                    })
        }
    })
}

function updateRole () {
    
    inquirer.prompt([
        {
            name: "employee_id",
            message: "What is the id of the employee you want to update?",
            type: "input"
        },
        {
            name: "newRole_id",
            message: "What is the employee's new role id?",
            type: "input" 
        }
    ]).then(({newRole_id,employee_id }) => {
        db.query("UPDATE employee SET employee.role_id = ? WHERE id=?",[newRole_id,employee_id],(err)=>{
            if(err){
                console.log(err);
            } else {    
            console.log("Employee role updated!")
            startQuestion ()
                    }
                })
    })
}
function updateManager () {
    
    inquirer.prompt([
        {
            name: "employee_id",
            message: "What is the id of the employee you want to update?",
            type: "input"
        },
        {
            name: "newManager_id",
            message: "What is the employee's new Manager id?",
            type: "input" 
        }
    ]).then(({newManager_id,employee_id }) => {
        db.query("UPDATE employee SET employee.manager_id = ? WHERE id=?",[newManager_id,employee_id],(err)=>{
            if(err){
                console.log(err);
            } else {    
            console.log("Employee Manager updated!")
            startQuestion ()
                    }
                })
    })
}
startQuestion ();