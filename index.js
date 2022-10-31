const inquirer = require("inquirer")
const mySql2 = require("mysql2");
const { start } = require("repl");

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'employee_tracker_db'
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

function viewDeparments () {
console.log("table showing department names and department ids")
startQuestion()
}

function viewRoles () {
    console.log("job title, role id, the department that role belongs to, and the salary for that role")
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