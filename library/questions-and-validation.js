const mysql2 = require('mysql2');

let departmentList = []
let roleList = [];
let employeeList = [];


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
                default: "Forensics",
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
                default: "Investigator",
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
                default: "Gabriel",
                validate: (input) => validateName(input, "first")
            },
            {
                type: "input",
                name: "employeeLastName",
                message: "What is the employee's last name?",
                default: "Morrow",
                validate: (input) => validateName(input, "last")

            },
            {
                type: "list",
                name: "employeeRole",
                message: "What is the employee's role?",
                choices: () => helperQuery("role")
            },
            {
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
                type: "list",
                name: "newRoleOfEmployee",
                message: "Which role do you want to assign to the selected employee?",
                choices: async (answers) => {
                    let employee = answers.employeeName;
                    let employeeRole = await getEmployeeRole(employee)
                    let newRoleList = roleList.filter((role) => role !== employeeRole)
                    if(newRoleList.length === 0){

                        console.log("There is only one employee, and no roles exist other than what the employee already has.  Please add another role before" +
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
                type: "list",
                name: "newManagerOfEmployee",
                message: "Which manager do you want to assign to the selected employee?",
                choices: async (answers) =>{

                    let newEmployeeList = await helperQuery("employee")

                    newEmployeeList = newEmployeeList.filter((person) => person !== answers.employeeName);
                    let employeeManager = await getEmployeeManager(answers.employeeName);
                    if(employeeManager !== null){

                        newEmployeeList = newEmployeeList.filter((person) => person !== employeeManager);
                        newEmployeeList.push("No Manager");
                    }

                    if(newEmployeeList.length === 0){

                        console.log("There is only one employee, and as such the only option is for that employee to not have a manager. "+
                                    "Please add an employee before you attempt to update this employee's manager.  Press Eneter to return to the main menu");

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

const database = mysql2.createConnection(

    {
        host: '127.0.0.1',
        user: 'root',
        password: '02Co:v!L$dk7#p5',
        database: 'company_db'
    },
);

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

function validateSalary(input){

    let titleRegex = /^(?!.*\.$)[0-9]+\.{0,1}[0-9]{0,2}$/

    if(titleRegex.test(input) === true){

        return true
    
    } else {

        return "That was an invalid response.  A salary can only contain numbers, potentially followed by a period, and then another two numbers. "
    }
}

async function helperQuery(tableName){

    let namesOrTitlesArray = undefined;
    let data = undefined;
    let query = undefined;

    if(tableName === "role"){

        query = `SELECT title FROM ${tableName}`;
        data = await database.promise().query(query)

        namesOrTitlesArray = data[0].map(datum => datum.title);
    
        

    } else if (tableName === "department"){

        query = `SELECT name FROM ${tableName}`;

        data = await database.promise().query(query)

        namesOrTitlesArray = data[0].map(datum => datum.name);


    } else if (tableName === "employee"){

        query = `SELECT CONCAT(first_name, ' ', last_name) AS full_name
                 FROM ${tableName}`;
        data = await database.promise().query(query)

        namesOrTitlesArray = data[0].map(datum => datum.full_name);
    }    
    return namesOrTitlesArray;
}

function updateList(passedBackList, listType){

    switch(listType){

        case "department":
            departmentList = passedBackList;
            break;
        case "role":
            roleList = passedBackList;
            break;
        case "employee":
            employeeList = passedBackList;
            break;

    }
    
}

async function getEmployeeRole(employeeName){

    let employeeId = await getId(employeeName, "employee");
    
    let getRoleQuery = `SELECT role.title
                        FROM role LEFT JOIN employee ON employee.role_id = role.id 
                        WHERE employee.id = ${employeeId}`
    
    let roleTitle = await database.promise().query(getRoleQuery)
    return roleTitle[0][0].title;
}

async function getEmployeeManager(employeeName){

    let employeeId = await getId(employeeName, "employee");
    
    let getManagerQuery = `SELECT CONCAT(e2.first_name, ' ', e2.last_name) as full_name
                           FROM employee e1
                           LEFT JOIN employee e2 ON e1.manager_id = e2.id
                           WHERE e1.id = ${employeeId}`
    
    let employeeManager = await database.promise().query(getManagerQuery)
    return employeeManager[0][0].full_name;
}

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
    
        let idData = await database.promise().query(idQuery);
    
        id = idData[0][0].id;
    }
    
    return id;
}

module.exports = {questions, database, helperQuery, departmentList, employeeList, roleList, updateList, getId};