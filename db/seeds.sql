const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee_tracker_db'
  },
  console.log(`Connected to the employee_tracker_db database.`)
);