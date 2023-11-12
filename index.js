let {questions, database, 
    departmentList, roleList, employeeList, 
    helperQuery, updateList, getId, updateDepartmentList} = 
    require('./library/questions-and-validation.js')

const inquirer = require('inquirer');


let query = undefined;

/* This is the 'main' function of the application, which controls the program flow. */
async function begin(){

    let response = undefined;
    

    mainLoop: while (response !== "Quit Application"){

        let valid = false

        /* I put the switch statement inside of the try... catch statement so as to 
        only need one main catch block and not have to have one in every main function here.  */
        try{

            /* To start, the user is asked the question "What would you like to do?" and given a list of options.  Each of those options
            is a case in the switch statment below. */
            response = await askQuestion("startingQuestion");
            valid = true;
            
            if(valid === true){

                let noDepartmentsMessage = undefined;
                let noRolesMessage = undefined;
                let noEmployeesMessage = undefined;

                switch(response.start){
                    case "View All Departments":
                        await viewDepartments();
                        break;
                    case "View All Roles":
                        await viewRoles();
                        break;
                    case "View All Employees":
                        await viewEmployees();
                        break;
                    case "Add A Department":
                        departmentList = await helperQuery("department");
                        updateDepartmentList(departmentList, "department");
                        await addDepartment();
                        break;
                    case "Add A Role":
                        noDepartmentsMessage = "There are no departments. Please add a deparment before adding a role.";
                        await ifListHasItemsProceedAsNormal(["department"], [noDepartmentsMessage], addRole, "");
                        break;
                    case "Add An Employee":
                        noRolesMessage = "There are no roles. Please add a role before adding an employee.";
                        await ifListHasItemsProceedAsNormal(["role"], [noRolesMessage], addEmployee, "");
                        break;
                    case "Update An Employee's Role":
                        noRolesMessage = "There are no roles. Please add a role before attempting to update an employee's role.";
                        noEmployeesMessage = "There are no employees. Please add an employee before attempting to update an employee's role."
                        await ifListHasItemsProceedAsNormal(["role", "employee"], [noRolesMessage, noEmployeesMessage], updateEmployeeRole, "");
                        break;
                    case "Update An Employee's Manager":
                        noEmployeesMessage = "There are no employees.  Please add an employee before attempting to update an employee's manager.";
                        await ifListHasItemsProceedAsNormal(["employee"], [noEmployeesMessage], updateEmployeeManager, "");
                        break;
                    case "View Employees By Manager":
                        noEmployeesMessage = "There are no employees.  Please add an employee before attempting to view an employee's direct reports.";
                        await ifListHasItemsProceedAsNormal(["employee"], [noEmployeesMessage], viewEmployeesByManager, "");
                        break;
                    case "View Employees By Department":
                        noDepartmentsMessage = "There are no departments.  Please add a department before attempting to view the employees a department contains.";
                        await ifListHasItemsProceedAsNormal(["department"], [noDepartmentsMessage], viewEmployeesByDepartment, "");
                        break;
                    case "Delete A Department":
                        noDepartmentsMessage = "There are no departments.  Please add a department before attempting to delete a department.";
                        await ifListHasItemsProceedAsNormal(["department"], [noDepartmentsMessage], deleteRecord, "department");
                        break;
                    case "Delete A Role":
                        noRolesMessage = "There are no roles.  Please add a role before attempting to delete a role.";
                        await ifListHasItemsProceedAsNormal(["role"], [noRolesMessage], deleteRecord, "role");
                        break;
                    case "Delete An Employee":
                        noEmployeesMessage = "There are no employees.  Please add an employee before attempting to delete a employee.";
                        await ifListHasItemsProceedAsNormal(["employee"], [noEmployeesMessage], deleteRecord, "employee");
                        break;
                    case "View The Total Utilized Budget Of A Department":
                        noDepartmentsMessage = "There are no departments.  Please add a department before attempting to view a department's budget.";
                        await ifListHasItemsProceedAsNormal(["department"], [noDepartmentsMessage], viewDepartmentBudget, "department");
                        break;
                    case "Quit the Application":
                        process.exit();
                }
            }

        //If the program catches an error, it will also stop the application.
        } catch(error){

            console.log(error);
            process.exit();
        }
    }
}

/* This function makes sure that for each of the three items where a list of departments, roles, and employees is necessary,
the corresponding table in the database is actually populated with data.  If the table isn't populated, a message is printed to the user.
This message is somewhat different depending on which question was asked.   Once the message is printed, control returns to the main 
function of the program.*/
async function ifListHasItemsProceedAsNormal(listTypes, messages, proceedFunction, proceedFunctionParameter = ""){

    let proceed = true
    let dataList = undefined;


    /* The reason this for loop is necessary is that for one of the questions, 
    needs to make sure that two of the database's tables have data, rather than just one.*/
    for(let counter = 0; counter < listTypes.length; counter++){

        dataList = await helperQuery(listTypes[counter]);
        
        if(listTypes[counter] === "department"){

            updateDepartmentList()
        }

        if(dataList.length === 0){
            console.log(messages[counter]);
            proceed = false;
        }
    }

    /* If the proper data is populated, the program proceeds as normal by calling the function that
    was passed into the call to this current function. */
    if(proceed === true){
        
        switch(proceedFunctionParameter){

            case "":
                await proceedFunction();
                break;
            case "department":
                await proceedFunction("department");
                break;
            case "role":
                await proceedFunction("role");
                break;
            case "employee":
                await proceedFunction("employee");
                break;
        }
    }
}

/* This is the function that the program calls when the user selects the option to view all departments. */
async function viewDepartments(){

    let noDataMessage = "There are no departments to display.";

    query = 'SELECT * FROM department ORDER BY id';
    let data = await queryDatabase(query, "Select");
    
    displayData(data[0], noDataMessage);
}

/* This is the function that the program calls when the user selects the option to view all roles. */
async function viewRoles(){

    let noDataMessage = "There are no roles to display.";

    query = `SELECT role.id AS role_id, title AS role_title, department.name AS department, salary
             FROM role 
             LEFT JOIN department on role.department_id = department.id ORDER BY role.id`;
    
    let data = await queryDatabase(query, "Select");
    displayData(data[0], noDataMessage);
}

/* This is the function that the program calls when the user selects the option to view all employees. */
async function viewEmployees(){

    let noDataMessage = "There are no employees to display.";

    query = `SELECT e1.id AS employee_id, e1.first_name, e1.last_name, role.title AS job_title, department.name AS department, salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager
             FROM employee e1 
             LEFT JOIN role on e1.role_id = role.id
             LEFT JOIN department on role.department_id = department.id
             LEFT JOIN employee e2 on e1.manager_id = e2.id ORDER BY e1.id;`;
    
    let data = await queryDatabase(query, "Select");
    displayData(data[0], noDataMessage);
}

/* The functions for adding departments, roles, and employees take the responses that the user gives and assemble them 
into SQL INSERT queries.  Once program adds the data to the database, it prints a message to the user. */
async function addDepartment(){

    let responses = await askQuestion("addDepartment");

    let addDepartmentQuery = `INSERT INTO department(name) VALUES ("${responses.departmentName}")`;
    let response = await queryDatabase(addDepartmentQuery, "Insert");

    if(response === "success"){

        console.log(`Added department '${responses.departmentName}' to the database`);
    }
}

async function addRole(){


    let responses = await askQuestion("addRole");

    let departmentId = await getId(responses.roleDepartment, "department");

    let addRoleQuery  = `INSERT INTO role (title, salary, department_id) VALUES (
                        "${responses.roleName}", 
                         ${responses.roleSalary}, 
                        "${departmentId}");`;

    let response = await queryDatabase(addRoleQuery, "Insert");

    if(response === "success"){

        console.log(`Added role '${responses.roleName}' to the database`);
    }
}

async function addEmployee(){

    let responses = await askQuestion("addEmployee");

    responses.employeeLastName = await filterName(responses.employeeFirstName, responses.employeeLastName)

    let roleId = await getId(responses.employeeRole, "role");

    let managerId = await getId(responses.employeeManager, "employee");

    let addEmployeeQuery = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (
                           "${responses.employeeFirstName}", 
                           "${responses.employeeLastName}", 
                            ${roleId}, 
                            ${managerId});`

    let response = await queryDatabase(addEmployeeQuery, "Insert");

    if(response === "success"){

        console.log(`Added employee '${responses.employeeFirstName} ${responses.employeeLastName}' to the database`);
    }
}


/* The program calls this function when the user chooses to update an employee's role.  It takes the user's responses and assembles them into an UPDATE query.
Once the role is updated, the program prints a message to the user. */
async function updateEmployeeRole(){

    let responses = await askQuestion("updateEmployeeRole");

    if(responses.newRoleOfEmployee === "Return"){

        return;
    }

    let roleId = await getId(responses.newRoleOfEmployee, "role");

    let employeeId =  await getId(responses.employeeName, "employee");

    let updateEmployeeRoleQuery = `UPDATE employee 
                                   SET employee.role_id = ${roleId}
                                   WHERE employee.id = ${employeeId};`;
    
    let response = await queryDatabase(updateEmployeeRoleQuery, "Update");

    if(response === "success"){

        console.log(`Updated the role of employee ${responses.employeeName} to "${responses.newRoleOfEmployee}".`);
    }
}

/* The program calls this function when the user chooses to update an employee's manager.  It takes the user's responses and assembles them into an UPDATE query.
Once the manager is updated, the program prints a message to the user. */
async function updateEmployeeManager(){

    let responses = await askQuestion("updateEmployeeManager");

    if(responses.newManagerOfEmployee === "Return"){

        return;
    }

    let employeeId = await getId(responses.employeeName, "employee");

    let managerId = undefined;

    if(responses.newManagerOfEmployee === "No Manager"){

        managerId = "NULL";
    
    } else {

        managerId = await getId(responses.newManagerOfEmployee, "employee");
    }

    let updateEmployeeManagerQuery = `UPDATE employee 
                                      SET employee.manager_id = ${managerId}
                                      WHERE employee.id = ${employeeId};`;

    let response = await queryDatabase(updateEmployeeManagerQuery, "Update");

    if(response === "success"){

        if(managerId === "NULL"){

            console.log(`Updated employee ${responses.employeeName} to have no manager`);
        
        } else {

            console.log(`Updated the manager of employee ${responses.employeeName} to ${responses.newManagerOfEmployee}.`);
        }
    } 
}

/* This function is called when the user chooses to view employees by manager.  It takes the user's responses, and creates a JOIN statment out of them,
so as to retrieve a manager's employees and those employees' role titles and departments all at once. */
async function viewEmployeesByManager(){

    let responses = await askQuestion("viewEmployeesByManager");

    let noDataMessage = `The employee '${responses.managerName}' doesn't manage any other employees.`;

    let managerId =  await getId(responses.managerName, "employee");

    let managerQueryPiece = undefined;

    let finalJoinQueryPiece = undefined;

    if(managerId !== "NULL"){

        managerQueryPiece = `CONCAT(e2.first_name, " ", e2.last_name)`;
        finalJoinQueryPiece = `LEFT JOIN employee e2 ON e1.manager_id = e2.id WHERE e1.manager_id = ${managerId}`
    
    } else {

        managerQueryPiece = `manager_id`
        finalJoinQueryPiece = `WHERE e1.manager_id IS NULL`;
    }

    let getEmployeesByManagerQuery = `SELECT e1.id, e1.first_name, e1.last_name, role.title AS job_title, department.name AS department, ${managerQueryPiece} AS manager 
                                      FROM employee e1
                                      JOIN role on e1.role_id = role.id
                                      JOIN department on role.department_id = department.id 
                                      ${finalJoinQueryPiece}`

    let returnedData = await queryDatabase(getEmployeesByManagerQuery, "Select");

    displayData(returnedData[0], noDataMessage)
}


/* This function is called when the user chooses to view employees by department.  It takes the user's responses and creates a JOIN statment out of them,
so as to retrieve a department's employees, and those employees' role titles and managers all at once. */
async function viewEmployeesByDepartment(){

    let responses = await askQuestion("viewEmployeesByDepartment");

    let noDataMessage = `The department '${responses.departmentName}' doesn't contain any employees.`;

    let departmentId = await getId(responses.departmentName, "department");

    let getEmployeesByDepartmentQuery = `SELECT e1.id, e1.first_name, e1.last_name, role.title AS job_title, CONCAT(e2.first_name, " ", e2.last_name) as manager, department.name AS department
                                         FROM employee e1
                                         JOIN role on e1.role_id = role.id
                                         JOIN department on role.department_id = department.id 
                                         LEFT OUTER JOIN employee e2 ON e1.manager_id = e2.id WHERE department.id = ${departmentId} ORDER BY e1.id;`;
    
    let returnedData = await queryDatabase(getEmployeesByDepartmentQuery, "Select");

    displayData(returnedData[0], noDataMessage)
}

/* This function is called whenever the user chooses to delete one of the three types of data.  The function 
takes the user's response to decide which record to delete, deletes the record, and then prints a message to the user. */
async function deleteRecord(deletionType){

    let responses = undefined;
    let id = undefined;
    let successMessage = undefined;

    switch(deletionType){

        case "department":
            responses = await askQuestion("deleteDepartment");
            id = await getId(responses.departmentName, deletionType);
            successMessage = `The ${deletionType} '${responses.departmentName}' has been deleted from the database.`
            break;
        case "role":
            responses = await askQuestion("deleteRole");
            id = await getId(responses.roleName, deletionType);
            successMessage = `The ${deletionType} '${responses.roleName}' has been deleted from the database.`
            break;
        case "employee":
            responses = await askQuestion("deleteEmployee");
            id = await getId(responses.employeeName, deletionType);
            successMessage = `The ${deletionType} '${responses.employeeName}' has been deleted from the database.`
            break;
    }

    let deleteDepartmentQuery = `DELETE FROM ${deletionType} 
                                 WHERE ${deletionType}.id = ${id};`;

    let response = await queryDatabase(deleteDepartmentQuery, "Delete");


    if(response === "success"){

        console.log(successMessage);
    }
    
}

/* The program calls this function whenever the user wants to view the total budget of a department.
The function takes the user's response, and then it takes the ID of the department the user wanted 
and puts it into a SQL query that pulls the name of the department and the sum of the salaries
of the roles of all the employees that belong to that department. */
async function viewDepartmentBudget(){

    let responses = await askQuestion("viewDepartmentBudget");

    let departmentId =  await getId(responses.departmentName, "department");

    let budgetQuery = `SELECT department.name AS department, SUM(salary) AS total_budget FROM department 
                       LEFT JOIN role ON role.department_id = department.id
                       LEFT JOIN employee ON employee.role_id = role.id
                       WHERE department.id = ${departmentId};`

    let returnedData = await queryDatabase(budgetQuery, "Select");

    if(returnedData[0][0].total_budget === null){

        returnedData[0][0].total_budget = "0";
    }
    
    console.table(returnedData[0]);
}

/* This program uses this function to ask questions of the user and wait for his or her input. */
async function askQuestion(questionName){

    let questionToBeAsked = questions.find(question => question.name === questionName);

    let responses = await inquirer.prompt(questionToBeAsked.questions);
    return responses;
}


/* The program uses this function to query the database with most of the queries that this application
uses.  For queries that aren't SELECT queries, if such a query is successful, the function returns a 
value indicating as such, and then this makes the calling function display a message to the user. */
async function queryDatabase(query, queryType){

    let returnValue = undefined
    try {

       let data = await database.promise().query(query);

        if(queryType === "Select"){
            
            returnValue = data

        } else {

            returnValue =  "success";
        }

    } catch(error){

        console.log(error);
        process.exit();
    }
        return returnValue;
}

/* This function is called when the application is creating an employee.  The functionchecks to see 
if there are any employees with the same name in the database.  If there any, the system adds a space 
and a number to the end of the employee's name, so as to differentiate the employee from the other employee(s)
with the same name. */
async function filterName(firstName, lastName){

    firstName = firstName.trim();
    lastName = lastName.trim();

    let currentEmployees = await helperQuery("employee");

    let foundEmployees = currentEmployees.filter(function(employee) {

        let employeePieces = employee.split(" ");

        if((employeePieces[0] + employeePieces[1]) === (firstName + lastName)){

            return true;
        
        } else {

            return false;
        }
    });

    if (foundEmployees.length > 0){

        return  `${lastName} ${foundEmployees.length + 1}`;
    
    } else{

        return  `${lastName}`
    } 
}

/* This function displays the various tables of data to the user that the queries return.  If a query 
returns no data, the program prints a message informing the user of this.*/
function displayData(data, noDataMessage){

    if(data.length !== 0){

        console.table(data);

    } else {

        console.log(noDataMessage);
    } 
}

begin();