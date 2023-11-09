const mysql2 = require('mysql2');

let storedFirstName = "";
let storedLastName = "";

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
                //validate: (input) => validateTitle(input, "department")
                 
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
                validate: async function(input) { 
                    
                    let returnValue = await validateTitle(input, "role");
                    return returnValue;
                }
        
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
                filter: (input) => filterName(input, "first"),
                validate: validateName
            },
            {
                type: "input",
                name: "employeeLastName",
                message: "What is the employee's last name?",
                default: "Morrow",
                filter: (input) => filterName(input, "last"),
                validate: validateName
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
                choices: () => helperQuery("employee")
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
                choices: () => helperQuery("role")
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
                choices: () => helperQuery("employee")
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
)

async function filterName(input, whichName){

    if(whichName === "first"){
        
        storedFirstName = input;
        return input

    } else {

        storedLastName = input;

        let currentEmployees = await helperQuery("employee");

        let foundEmployees = currentEmployees.filter(function(employee) {

            let employeePieces = employee.split(" ");

            if((employeePieces[0] + employeePieces[1]) === (storedFirstName + storedLastName)){

                return true;
            
            } else {

                return false;
            }

        });

        if (foundEmployees.length > 0){

            return input + " " + (foundEmployees.length + 1);
        }
    }
}

function validateName(input){

    let nameRegex = /^[a-zA-Z]+(\s[0-9]{1,2})?$/

    if(nameRegex.test(input) === true){

        return true

    } else {

        return "That was an invalid response.  A name can only contain letters, spaces, and hyphens and optionally one or two numbers at the end preceded by a space.  Try again. "
    }
}

// async function validateTitle(input, queryType){

//     let existingTitles = await helperQuery(queryType);

    //let data = await database.promise().query("SELECT name FROM department;");

    // let foundTitle = existingTitles.find((title) => title.name === input);
    
    // if(foundTitle !== undefined){

    //     return "That was an invalid response.  The title of a department or role must be unique.  Try again."
    // }

    // let titleRegex = /^[a-zA-Z0-9\ -]+$/

    // if(titleRegex.test(input) === true){

    //     return true
    
    // } else {

    //     return "That was an invalid response.  The title of a department or role can only contain letters, numbers, spaces, and hyphens.  Try again. "
    // }

//     return true;
// }

function validateSalary(input){

    let titleRegex = /^(?!.*\.$)[0-9]+\.{0,1}[0-9]{0,2}$/

    if(titleRegex.test(input) === true){

        return true
    
    } else {

        return "That was an invalid response.  A salary can only contain numbers, and potentially followed by a period, potentially followed by another two numbers. "
    }
}

async function helperQuery(tableName){

    let namesOrTitlesArray = undefined;
    let data = undefined;
    let query = undefined;
    
    // switch(tableName){

    //     case "department":
    //         query = `SELECT name FROM ${tableName};`;
    //         data = await database.promise().query(query);
    //         namesOrTitlesArray = data[0].map(datum => datum.title);
    //         break;
    //     case "role":
    //         query = `SELECT title FROM ${tableName};`
    //         data = await database.promise().query(query);
    //         namesOrTitlesArray = data[0].map(datum => datum.title);
    //         break;
    //     case "employee":
    //         query = `SELECT CONCAT(first_name, ' ', last_name) AS full_name
    //                  FROM ${tableName};`;  
    //         data = await database.promise().query(query);
    //         namesOrTitlesArray = data[0].map(datum => datum.title);
    //         break;
    // }

    if(tableName === "department"){

        query = `SELECT name FROM ${tableName}`;
        data = await database.promise().query(query);
        namesOrTitlesArray = data[0].map(datum => datum.name);

    } else if (tableName === "role"){

        query = `SELECT title FROM ${tableName}`;
        data = await database.promise().query(query);
        namesOrTitlesArray = data[0].map(datum => datum.title);


    } else if (tableName === "employee"){

        query = `SELECT CONCAT(first_name, ' ', last_name) AS full_name
                 FROM ${tableName}`;
        data = await database.promise().query(query);
        namesOrTitlesArray = data[0].map(datum => datum.title);  
        
    }

    // data = await database.promise().query(query);
    // namesOrTitlesArray = data[0].map(datum => datum.title);
    
    
    return namesOrTitlesArray;
    //return data;
}

module.exports = {questions, database};