// Import required modules
const inquirer = require("inquirer");
const connection = require("./config/connection.js");

// Function to start the application and display menu
function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          connection.end();
          console.log("Application closed.");
          break;
      }
    });
}

// Function to view all departments
function viewDepartments() {
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;

    console.log("\nDEPARTMENTS");
    console.table(res);

    start();
  });
}

// Function to view all roles
function viewRoles() {
  const query = `
    SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log("\nROLES");
    console.table(res);

    start();
  });
}

// Function to view all employees
function viewEmployees() {
  const query = `
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    INNER JOIN roles ON employees.role_id = roles.id
    INNER JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;

    console.log("\nEMPLOYEES");
    console.table(res);

    start();
  });
}

//Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: "departmentName",
      type: "input",
      message: "Enter the name of the department:",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO departments SET ?",
        { name: answer.departmentName },
        (err, res) => {
          if (err) throw err;
          console.log("Department added successfully.");

          start();
        }
      );
    });
}

// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "Enter the title of the role:",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "Enter the salary for the role:",
      },
      {
        name: "roleDepartment",
        type: "input",
        message: "Enter the department ID for the role:",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO roles SET ?",
        {
          title: answers.roleTitle,
          salary: answers.roleSalary,
          department_id: answers.roleDepartment,
        },
        (err, res) => {
          if (err) throw err;
          console.log("Role added successfully.");

          start();
        }
      );
    });
}

// Function to add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter the employee's first name:",
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter the employee's last name:",
      },
      {
        name: "role",
        type: "input",
        message: "Enter the employee's role ID:",
      },
      {
        name: "manager",
        type: "input",
        message: "Enter the employee's manager ID:",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answers.firstName,
          last_name: answers.lastName,
          role_id: answers.role,
          manager_id: answers.manager,
        },
        (err, res) => {
          if (err) throw err;
          console.log("Employee added successfully.");

          start();
        }
      );
    });
}

// Function to update an employee role
function updateEmployeeRole() {
  connection.query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "employeeId",
          type: "list",
          message: "Select the employee to update:",
          choices: res.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        {
          name: "newRoleId",
          type: "input",
          message: "Enter the new role ID:",
        },
      ])
      .then((answers) => {
        connection.query(
          "UPDATE employees SET ? WHERE ?",
          [{ role_id: answers.newRoleId }, { id: answers.employeeId }],
          (err, res) => {
            if (err) throw err;
            console.log("Employee role updated successfully.");

            start();
          }
        );
      });
  });
}

start();
