const {validateName, validateSalary, validateTitle} = require('./validation-functions.js')

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
                validate: validateTitle
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
                validate: validateTitle
        
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
                choices: []
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
                validate: validateName,
            },
            {
                type: "input",
                name: "employeeLastName",
                message: "What is the employee's last name?",
                default: "Morrow",
                validate: validateName,
            },
            {
                type: "list",
                name: "employeeRole",
                message: "What is the employee's role?",
                choices: []
            },
            {
                type: "list",
                name: "employeeManager",
                message: "Who is the employee's manager?",
                choices: []
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
                choices: []
            },
            {
                type: "list",
                name: "newRoleOfEmployee",
                message: "Which role do you want to assign to the selected employee?",
                choices: []
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
                choices: []
            },
            {
                type: "list",
                name: "newManagerOfEmployee",
                message: "Which manager do you want to assign to the selected employee?",
                choices: []
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
                choices: []
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
                choices: []
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
                choices: []
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
                choices: []
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
                choices: []
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
                choices: []
            }
        ]
    }
]

module.exports = questions;