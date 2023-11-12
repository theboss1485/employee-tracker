let {questions, database, 
    departmentList, roleList, employeeList, 
    helperQuery, updateList, getId} = 
    require('./library/questions-and-validation.js')

const inquirer = require('inquirer');


let query = undefined;

async function begin(){

    let response = undefined;
    

    mainLoop: while (response !== "Quit Application"){

        let valid = false

        /* I put the switch statement inside of the try... catch statement so as to 
        only need one catch block and not have to have one in every main function here.  */
        try{

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
                        updateList(departmentList, "department");
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

        } catch(error){

            console.log(error);
            process.exit();
        }
    }
}


async function ifListHasItemsProceedAsNormal(listTypes, messages, proceedFunction, proceedFunctionParameter = "", listShouldHaveMoreThanOneItem = 0){

    let proceed = true
    let dataList = undefined;

    for(let counter = 0; counter < listTypes.length; counter++){

        switch(listTypes[counter]){

            case "department":
                departmentList = await helperQuery("department");
                updateList(departmentList, "department");
                dataList = departmentList;
                break;
            case "role":
                roleList = await helperQuery("role");
                updateList(roleList, "role");
                dataList = roleList;
                break;
            case "employee":
                employeeList = await helperQuery("employee");
                updateList(employeeList, "employee");
                dataList = employeeList;
                break;
        }

        if(dataList.length === 0){
            console.log(messages[counter]);
            proceed = false;
        }
    }

    // if(listShouldHaveMoreThanOneItem !== 0){

    //     switch(listShouldHaveMoreThanOneItem){

    //         case 1:
    //             alternateMessage = `There is only one employee, and no roles exist other than what the employee already has.  Please add another role before attempting to update the employee's current role.`
    //             break;
    //         case 2:
    //             alternateMessage = `There is only one employee, and an employee can't manage himself in this application. Please add another employee before attempting to update the employee's manager.`
    //             break;
    //     }
    // }

    // if(dataList.length === 1 && (listShouldHaveMoreThanOneItem !== 0 ? true : false)){

    //     console.log(alternateMessage);
    // }


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


async function viewDepartments(){

    let noDataMessage = "There are no departments to display.";

    query = 'SELECT * FROM department ORDER BY id';
    let data = await queryDatabase(query, "Select");
    
    displayData(data[0], noDataMessage);
}

async function viewRoles(){

    let noDataMessage = "There are no roles to display.";

    query = `SELECT role.id AS role_id, title AS role_title, department.name AS department, salary
             FROM role 
             LEFT JOIN department on role.department_id = department.id ORDER BY role.id`;
    
    let data = await queryDatabase(query, "Select");
    displayData(data[0], noDataMessage);
}

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

async function askQuestion(questionName){

    let questionToBeAsked = questions.find(question => question.name === questionName);

    let responses = await inquirer.prompt(questionToBeAsked.questions);
    return responses;
}

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

async function filterName(firstName, lastName){

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

function displayData(data, noDataMessage){

    if(data.length !== 0){

        console.table(data);

    } else {

        console.log(noDataMessage);
    } 
}

begin();