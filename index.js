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
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role","Exit"]
    
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
                updateEmployee();
                break;
            default:
                console.log("See you next time!");
                break;
        }
    })
}
//function to view all departments
function viewDeparments () {
    db.query('SELECT * FROM department',(err, data)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    msg:"oh shucks!",
                    err:err
                })
            } else {
                    console.table(data)
                    }
            })
}

function viewRoles () {
    db.query('SELECT role.id AS id, role.title AS title, department.dept_name AS department, role.salary AS salary FROM role JOIN department ON role.department_id = department.id',(err, data)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                msg:"oh shucks!",
                err:err
            })
        } else {
                console.table(data)
                }
        })
    }

function viewEmployees () {
    db.query('SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS job_title, department.dept_name AS department, role.salary AS salary, employee.manager_id as manager FROM employee JOIN role ON employee.role_id = role.id JOIN department on role.department_id = department.id',(err, data)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                msg:"oh shucks!",
                err:err
            })
        } else {
                console.table(data)
                }
        })
}

function addDeparment () {
    inquirer.prompt({
        name: "dept_name",
        message: "What is the name of the department?",
        type: "input"
    }).then(({ dept_name }) => {
        db.query("INSERT INTO department(dept_name)VALUES(?)",[dept_name],(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    msg:"oh shucks!",
                    err:err
                })
            } else {    
            console.log("Department added!")
                    }
                })
    })
 
}

function addRole () {
    inquirer.prompt({
        name: "title",
        message: "What is the title of the role?",
        type: "input"
    },
    {
        name: "salary",
        message: "What is the salary of the role?",
        type: "number" 
    }).then(({ title }) => {
        db.query("INSERT INTO role(title)VALUES(?)",[title],(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).json({
                    msg:"oh shucks!",
                    err:err
                })
            } else {    
            console.log("Role added!")
                    }
                })
    })
}

function addEmployee () {
    console.log("prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database")
}

function updateEmployee () {
    console.log("prompted to select an employee to update and their new role and this information is updated in the database")
}

startQuestion ();