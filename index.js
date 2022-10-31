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
startQuestion()
}

function viewRoles () {
    db.query('SELECT * FROM role',(err, data)=>{
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
    startQuestion()
    }

function viewEmployees () {
    console.log("formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to")
    startQuestion()
}

function addDeparment () {
    console.log("prompted to enter the name of the department and that department is added to the database")
    startQuestion()
}

function addRole () {
    console.log("prompted to enter the name, salary, and department for the role and that role is added to the database")
    startQuestion()
}

function addEmployee () {
    console.log("prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database")
    startQuestion()
}

function updateEmployee () {
    console.log("prompted to select an employee to update and their new role and this information is updated in the database")
    startQuestion()
}

startQuestion ();