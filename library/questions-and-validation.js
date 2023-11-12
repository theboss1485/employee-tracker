//const mysql2 = require('mysql2');

const Sequelize = require('sequelize');
require('dotenv').config();

/* The departmentList array is used to keep track of the departments that are in the database outside of this file. 
This is necessary because I needed index.js to have access to the list of departments in order to circumvent the 
inquirer bug discussed here: https://github.com/SBoudrias/Inquirer.js/issues/912*/
let departmentList = []

/* The questions are nested in a multi-dimensional array. The top-level object contains an object for each main set of questions 
(one or more) that the program asks.  The arrays inside those objects contain individual question objects for each individual
question in each set. */
const questions = [
    
    {
        name: "startingQuestion",
        questions: [

            {
                type: "list",
                name: "start",
                message: "What would you like to do",
                choices: [
        
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Add A Department",
                    "Add A Role",
                    "Add An Employee",
                    "Update An Employee's Role",
                    "Update An Employee's Manager",
                    "View Employees By Manager",
                    "View Employees By Department",
                    "Delete A Department",
                    "Delete A Role",
                    "Delete An Employee",
                    "View The Total Utilized Budget Of A Department",
                    "Quit the Application"
                ]
            }
        ]
    },
    {
        name: "addDepartment",
        questions: [

            {
                type: "input",
                name: "departmentName",
                message: "What is the name of the department?",
                filter: trimTitle,
                validate: async (input) => await validateTitle(input, "department", 1)
                 
            }
        ]
    },
    {
        name: "addRole",
        questions: [

            {
                type: "input",
                name: "roleName",
                message: "What is the name of the role?",
                filter: trimTitle,
                validate: (input) => validateTitle(input, "role")
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What is the salary of the role?",
                validate: validateSalary
            },
            {
                type: "list",
                name: "roleDepartment",
                message: "Which department does the role belong to?",
                choices: () => helperQuery("department")
            }
        ]
    },
    {
        name: "addEmployee",
        questions: [

            {
                type: "input",
                name: "employeeFirstName",
                message: "What is the employee's first name?",
                validate: (input) => validateName(input, "first")
            },
            {
                type: "input",
                name: "employeeLastName",
                message: "What is the employee's last name?",
                validate: (input) => validateName(input, "last")

            },
            {
                type: "list",
                name: "employeeRole",
                message: "What is the employee's role?",
                choices: () => helperQuery("role")
            },
            {
                /* Before the system lets the user pick a manager 
                for a new employee it adds the "No Manager" option to the list
                to allow the user to ignify that the employee doesn't have a manager. */
                type: "list",
                name: "employeeManager",
                message: "Who is the employee's manager?",
                choices: async (answers) =>{

                    let employeeArray = await helperQuery("employee")

                    employeeArray.push("No Manager");
                    return employeeArray;
                }
            }
        ]
    },
    {
        name: "updateEmployeeRole",
        questions: [

            {
                type: "list",
                name: "employeeName",
                message: "Which employee's role do you want to update?",
                choices: () => helperQuery("employee")
            },
            {
                /* When the user goes to update an employee's role, the system won't allow the user to reassign the employee's current
                role to the employee.  If the employee's current role is the only role in the database, the system allows the user to press
                Enter to return to the main part of the program. */
                type: "list",
                name: "newRoleOfEmployee",
                message: "Which role do you want to assign to the selected employee?",
                choices: async (answers) => {

                    let roleList = await helperQuery("role")
                    let employee = answers.employeeName;
                    let employeeRole = await getEmployeeRole(employee)
                    let newRoleList = roleList.filter((role) => role !== employeeRole)
                    if(newRoleList.length === 0){

                        console.log("There is only one employee, and no roles exist other than what the employee already has.  Please add another role before " +
                                    "attempting to update the employee's current role.  Press Enter to return to the main menu.")
                        
                        newRoleList.push("Return");
                    }

                    return newRoleList;
                }
            }
        ]
    },
    {
        name: "updateEmployeeManager",
        questions: [

            {
                type: "list",
                name: "employeeName",
                message: "Which employee's manager do you want to update?",
                choices: () => helperQuery("employee")
            },
            {
                /* When the user goes to update an employee's manager, the system won't allow the user to reassign the employee's current
                manager to the employee.  If there are no other employees in the database, the system allows the user to press
                Enter to return to the main part of the program. */
                type: "list",
                name: "newManagerOfEmployee",
                message: "Which manager do you want to assign to the selected employee?",
                choices: async (answers) =>{

                    let employeeList = await helperQuery("employee")

                    let newEmployeeList = employeeList.filter((person) => person !== answers.employeeName);
                    let employeeManager = await getEmployeeManager(answers.employeeName);
                    if(employeeManager !== null){

                        newEmployeeList = newEmployeeList.filter((person) => person !== employeeManager);
                        newEmployeeList.push("No Manager");
                    }

                    if(newEmployeeList.length === 0){

                        console.log("There is only one employee, and as such the only option is for that employee to not have a manager. "+
                                    "Please add an employee before you attempt to update this employee's manager.  Press Enter to return to the main menu");

                        newEmployeeList.push("Return");
                    }

                    return newEmployeeList;
                } 
            }
        ]
    },
    {
        name: "viewEmployeesByManager",
        questions: [

            {
                type: "list",
                name: "managerName",
                message: "Which manager's employees do you want to view?",
                choices: () => helperQuery("employee")
            }
        ]
    },
    {
        name: "viewEmployeesByDepartment",
        questions: [

            {
                type: "list",
                name: "departmentName",
                message: "Which department's employees do you want to view?",
                choices: () => helperQuery("department")
            }
        ]
    },
    {
        name: "deleteDepartment",
        questions: [

            {
                type: "list",
                name: "departmentName",
                message: "Which department do you want to delete?",
                choices: () => helperQuery("department")
            }
        ]
    },
    {
        name: "deleteRole",
        questions: [

            {
                type: "list",
                name: "roleName",
                message: "Which role do you want to delete?",
                choices: () => helperQuery("role")
            }
        ]
    },
    {

        name: "deleteEmployee",
        questions: [

            {
                type: "list",
                name: "employeeName",
                message: "Which employee do you want to delete?",
                choices: () => helperQuery("employee")
            }
        ]
    },
    {

        name: "viewDepartmentBudget",
        questions: [

            {
                type: "list",
                name: "departmentName",
                message: "Which department would you like to view the total utilized budget for?",
                choices: () => helperQuery("department")
            }
        ]
    }
];

/*This is the object that holds the database connection.  The reason I put it here
is that putting it in its own file would have caused a circular dependency, since both
index.js and this file use it.  I took code the code to get the connection up and running
from one of the module 13 activities. */
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      logging: false,
      port: 3306
    }
  );

/* This function  */
function validateName(input, whichName){


    /*I took the regular expression for the last name from https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
    and modified it as necessary.*/
    let nameRegex = undefined;
    
    if(whichName === "first"){

        nameRegex = /^[A-Za-z]+$/

    } else if (whichName === "last"){

        nameRegex = /^[A-Za-z ,.'-]+$/
    }

    if(nameRegex.test(input) === true){

        return true

    } else {

        return `That was an invalid response.  First names can only contain A-Z and a-z characters.  Last names can only contain those plus
                spaces, commas, periods, apostrophes, and hyphens.`
    }
}

function trimTitle(input){
    
    return input.trim();
}

/* The program uses this function to validate the titles of both departments and roles to both make sure they are unique and also
to make sure they contain only letters, numbers, spaces, and hyphens.*/
async function validateTitle(input, queryType, useEmployeeList = 0){

    let existingTitles = undefined
    
    if(useEmployeeList === 1){

        existingTitles = departmentList
    
    } else {

        existingTitles = await helperQuery(queryType);
    }

    let foundTitle = existingTitles.find((title) => title === input);
    
    if(foundTitle !== undefined){

        return "That was an invalid response.  The title of a department or role must be unique. This title is already taken. Try again."
    }

    let titleRegex = /^[a-zA-Z0-9\ -]+$/

    if(titleRegex.test(input) === true){

       return true;
    
    } else {

        return "That was an invalid response.  The title of a department or role can only contain letters, numbers, spaces, and hyphens.  Try again. "
    }
}

/* The program uses this function to validate the salary to make sure it is only numbers, or that it is a number
with two decimal places. */
function validateSalary(input){

    let titleRegex = /^(?!.*\.$)[0-9]+\.{0,1}[0-9]{0,2}$/

    if(titleRegex.test(input) === true){

        return true
    
    } else {

        return "That was an invalid response.  A salary can only contain numbers, potentially followed by a period, and then another two numbers. "
    }
}

/* The program uses this function to get the names/titles of departments, roles, and employees when 
it needs to do something such as providing the names of departments, roles and employees as choices
to answer a question. */
async function helperQuery(tableName){

    let namesOrTitlesArray = undefined;
    let data = undefined;
    let query = undefined;

    if(tableName === "role"){

        query = `SELECT title FROM ${tableName}`;
        data = await sequelize.query(query)

        namesOrTitlesArray = data[0].map(datum => datum.title);
    
        

    } else if (tableName === "department"){

        query = `SELECT name FROM ${tableName}`;

        data = await sequelize.query(query)

        namesOrTitlesArray = data[0].map(datum => datum.name);


    } else if (tableName === "employee"){

        query = `SELECT CONCAT(first_name, ' ', last_name) AS full_name
                 FROM ${tableName}`;
        data = await sequelize.query(query)

        namesOrTitlesArray = data[0].map(datum => datum.full_name);
    }    
    return namesOrTitlesArray;
}

/* This function updates the global variable departmentList.  This allows 
the program to avoid the inquirer bug I discussed at the top of this file. */
function updateDepartmentList(passedBackList){

    departmentList = passedBackList
}

/* This function gets the role that is assigned to a specified employee. 
This is useful to allow the program to know what role an employee already has
so that it can be removed from the list of other roles that the user can assign
to the employee.*/
async function getEmployeeRole(employeeName){

    let employeeId = await getId(employeeName, "employee");
    
    let getRoleQuery = `SELECT role.title
                        FROM role LEFT JOIN employee ON employee.role_id = role.id 
                        WHERE employee.id = ${employeeId}`
    
    let roleTitle = await sequelize.query(getRoleQuery)
    return roleTitle[0][0].title;
}

/* This function gets the manager that is assigned to a specified employee. 
This is useful to allow the program to know what manager an employee already has
so that it can be removed from the list of other employees that the user can assign
to manage the employee in question.*/
async function getEmployeeManager(employeeName){

    let employeeId = await getId(employeeName, "employee");
    
    let getManagerQuery = `SELECT CONCAT(e2.first_name, ' ', e2.last_name) as full_name
                           FROM employee e1
                           LEFT JOIN employee e2 ON e1.manager_id = e2.id
                           WHERE e1.id = ${employeeId}`
    
    let employeeManager = await sequelize.query(getManagerQuery)
    return employeeManager[0][0].full_name;
}

/* Getting a department, role, or employee Id is such a common task for this program 
that I wrote a function to do it.  This is used quite a bit when generating 
a lot of the SQL queries that this program uses. */
async function getId(responseText, idType){

    let selectQueryVariable = undefined;

    let id = undefined;

    if(responseText == "No Manager"){

        id = "NULL";
    
    } else{

        switch (idType){

            case "employee":
                selectQueryVariable = `CONCAT(first_name, " ", last_name)`;
                break;
            case "role":
                selectQueryVariable = `title`;
                break;
            case "department":
                selectQueryVariable = `name`;
                break;
        }
    
        let idQuery = `SELECT id FROM ${idType}
                       WHERE ${selectQueryVariable} = "${responseText}"`;
    
        let idData = await sequelize.query(idQuery);
    
        id = idData[0][0].id;
    }
    
    return id;
}

module.exports = {questions, sequelize, departmentList, 
                  helperQuery, updateDepartmentList, getId};