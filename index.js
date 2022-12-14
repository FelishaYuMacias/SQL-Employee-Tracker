//dotenv to encrypt mysql password
require("dotenv").config();
// instantiate Inquirer and MySql2
const inquirer = require("inquirer")
const mysql = require("mysql2");

//adding connection to db
const db = mysql.createConnection(
    {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    },
    console.log(`Connected to the employee_tracker_db.`)
  );

//function to start list of options 
function startQuestion() {

    inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choices',
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Update employee manager", "Exit"]
    
        }
        //calling the appropriate function for each response
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
//function to view all roles
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
//function to view all employees
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
//function to add a new department
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
//function to add a new role
function addRole () {
    db.query('SELECT department.id, department.dept_name AS department FROM department',(err, res)=>{
  if(err)throw err;
  let deptChoices = res.map(({ id, department,}) => ({
    value: id, 
    name: `${department}`      
  }));
  
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
          message: "What is the department?",
          type: "list",
          choices: deptChoices
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
});
}
//functions to add a new employee
function addEmployee() {
    db.query("SELECT * FROM role", (err, results)=>{
        if(err)throw err;
        const roleOptions = results.map(oneRole =>{
            return {
                name:`${oneRole.title}`, value:`${oneRole.id}`
            }
        })
        employeeRoles(roleOptions);
        });
}
function employeeRoles(roleOptions) {
    db.query("SELECT * FROM employee", (err, results)=>{
        if(err){
            console.log(err);
        } else {
            const managerOptions = results.map(manager =>{
                return {
                    name:`${manager.first_name} ${manager.last_name}`, value:`${manager.id}`
                }
            })
  inquirer
    .prompt([
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
            message: "What is the employee's role?",
            type: "list",
            choices: roleOptions
        },
        {
            name: "manager_id",
            message: "What is the employee's manager?",
            type: "list",
            choices: managerOptions
        }
  ]).then(({first_name,last_name,role_id, manager_id }) => {
    //allows for no manager id
    if (manager_id){
        db.query("INSERT INTO employee(first_name,last_name,role_id, manager_id)VALUES(?,?,?,?)",[first_name,last_name,role_id, manager_id],(err=>{
            if(err){
                console.log(err);
            } else {    
            console.log("Employee added!")
            startQuestion ()
                    }
                }) 
            )
        } else {
                db.query("INSERT INTO employee(first_name,last_name,role_id)VALUES(?,?,?)",[first_name,last_name,role_id],(err)=>{
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
    })
        
}


//functions to update the role of an existing employee

function updateRole(){
    db.query(`SELECT employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title,
        department.dept_name AS department, 
        role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id=employee.manager_id`,(err, res)=>{
    if(err) {
        console.log(err)
    } else {
        const employees = res.map(({ id, first_name, last_name }) => ({
          value: id,
           name: `${first_name} ${last_name}`      
        }));
        getRole(employees);
    }
  })
}

function getRole(employees){
db.query(`SELECT * FROM role`,(err, res)=>{
  if(err) {
      console.log(err)
  } else {
      let roleChoices = res.map(({ id, title,}) => ({
        value: id, 
        name: `${title}`      
      }));
      getUpdatedRole(employees, roleChoices);
}
})
}

function getUpdatedRole(employees, roleChoices) {
inquirer
  .prompt([
    {
      name: "employee_id",
      message: "Which employee do you want to update?",
      type: "list",
      choices: employees
    },
    {
      name: "newRole_id",
      message: "What is the employee's new role?",
      type: "list",
      choices: roleChoices
    }
  ]).then(({newRole_id,employee_id }) => {
      db.query("UPDATE employee SET employee.role_id = ? WHERE id=?",[newRole_id,employee_id],(err)=>{
          if(err){
              console.log(err);
          } else {    
          console.log("Employee role updated!")
          startQuestion ()
                  }
      });
  });
}

//function to update an existing employee's manager
function updateManager () {
    db.query("SELECT * FROM employee", (err, results)=>{
        if(err){
            console.log(err);
        } else {
            const choices = results.map(choice =>{
                return {
                    name:`${choice.first_name} ${choice.last_name}`, value:`${choice.id}`
                }
            })
            inquirer.prompt([
                {
                    name: "employee_id",
                    message: "Which employee do you want to update?",
                    type: "list",
                    choices: choices
                },
                {
                    name: "newManager_id",
                    message: "Who is the employee's new Manager?",
                    type: "list",
                    choices: choices
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
     } )
    
}
//Calling the function so prompts will appear on open
startQuestion ();