// Import required modules
const inquirer = require("inquirer");
const connection = require("./config/connection.js");

// Function to start the application
function start() {
  // Display the main menu
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
      // switch options so users can have choices and get responses accordingly
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
  // Retrieve all departments from the database
  connection.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;

    // Display the departments in a formatted table
    console.log("\nDEPARTMENTS");
    console.table(res);

    // Go back to the main menu
    start();
  });
}

// Function to view all roles
function viewRoles() {
  // Retrieve all roles with department information from the database
  const query = `
    SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;

    // Display the roles in a formatted table
    console.log("\nROLES");
    console.table(res);

    // Go back to the main menu
    start();
  });
}

// Function to view all employees
function viewEmployees() {
  // Retrieve all employees with role and department information from the database
  const query = `
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    INNER JOIN roles ON employees.role_id = roles.id
    INNER JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id
  `;

  connection.query(query, (err, res) => {
    if (err) throw err;

    // Display the employees in a formatted table
    console.log("\nEMPLOYEES");
    console.table(res);

    // Go back to the main menu
    start();
  });
}

// Function to add a department
function addDepartment() {
  // Prompt the user to enter the name of the department
  inquirer
    .prompt({
      name: "departmentName",
      type: "input",
      message: "Enter the name of the department:",
    })
    .then((answer) => {
      // Insert the new department into the database
      connection.query(
        "INSERT INTO departments SET ?",
        { name: answer.departmentName },
        (err, res) => {
          if (err) throw err;
          console.log("Department added successfully.");

          // Go back to the main menu
          start();
        }
      );
    });
}

// Function to add a role
function addRole() {
  // Prompt the user for role details
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
      // Insert the new role into the database
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

          // Go back to the main menu
          start();
        }
      );
    });
}

// Function to add an employee
function addEmployee() {
  // Prompt the user for employee details
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
      // Insert the new employee into the database
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

          // Go back to the main menu
          start();
        }
      );
    });
}

// Function to update an employee role
function updateEmployeeRole() {
  // Retrieve the list of employees from the database
  connection.query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;

    // Prompt the user to select an employee
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
        // Update the employee's role in the database
        connection.query(
          "UPDATE employees SET ? WHERE ?",
          [{ role_id: answers.newRoleId }, { id: answers.employeeId }],
          (err, res) => {
            if (err) throw err;
            console.log("Employee role updated successfully.");

            // Go back to the main menu
            start();
          }
        );
      });
  });
}

// Start the application
start();
