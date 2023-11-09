const {questions, database} = require('./library/questions-validation-helper-queries-and-connection.js');
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

            console.log("Valid", valid);
            
            if(valid === true){

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
                        await addDepartment();
                        break;
                    case "Add A Role":
                        await addRole();
                        break;
                    case "Add An Employee":
                        await addEmployee();
                        break;
                    case "Update An Employee's Role":
                        await updateEmployeeRole();
                        break;
                    case "Update An Employee's Manager":
                        await updateEmployeeManager();
                        break;
                    case "View Employees By Manager":
                        await viewEmployeesByManager();
                        break;
                    case "View Employees By Department":
                        await viewEmployeesByDepartment();
                        break;
                    case "Delete A Department":
                        await deleteDepartment();
                        break;
                    case "Delete A Role":
                        deleteRole();
                        break;
                    case "Delete An Employee":
                        deleteEmployee();
                        break;
                    case "View The Total Utilized Budget Of A Department":
                        viewDepartmentBudget();
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

async function viewDepartments(){

    query = 'SELECT * FROM department ORDER BY id';
    let data = await queryDatabase(query, "Select");
    console.table(data[0]);
}

async function viewRoles(){

    query = `SELECT role.id AS role_id, title AS role_title, department.name AS department, salary
             FROM role 
             JOIN department on role.department_id = department.id ORDER BY role.id`;
    
    let data = await queryDatabase(query, "Select");
    console.table(data[0]);
}

async function viewEmployees(){

    query = `SELECT e1.id AS employee_id, e1.first_name, e1.last_name, role.title as job_title, department.name AS department, salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager
             FROM employee e1 
             JOIN role on e1.role_id = role.id
             JOIN department on role.department_id = department.id
             LEFT OUTER JOIN employee e2 on e1.manager_id = e2.id ORDER BY e1.id;`;
    
    let data = await queryDatabase(query, "Select");
    console.table(data[0]);
}

async function addDepartment(){

    let responses = await askQuestion("addDepartment");

    // let addDepartmentQuery = `INSERT INTO department(name) VALUES ("${responses.departmentName}")`;
    // let response = await queryDatabase(addDepartmentQuery, "Insert");

    // if(response === "success"){

    //     console.log(`Added department '${responses.departmentName}' to the database`);
    // }
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

// async function addEmployee(){

//     let responses = await askQuestion("addEmployee");

//     let roleId = getId(responses.employeeRole, "role");

//     let managerId = getId(responses.employeeManager, "employee");

//     let addEmployeeQuery = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (
//                            "${responses.employeeFirstName}", 
//                            "${responses.employeeLastName}", 
//                             ${roleId}, 
//                             ${managerId});`

//     let response = await queryDatabase(addEmployeeQuery, "Insert");

//     if(response === "success"){

//         console.log(`Added employee '${responses.employeeFirstName} ${responses.employeeLastName}' to the database`);
//     }
// }

async function updateEmployeeRole(){

    let responses = await askQuestion("updateEmployeeRole");

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

// async function updateEmployeeManager(){

//     let responses = await askQuestion("updateEmployeeManager");

//     let employeeId = getId(responses.employeeName, "employee");

//     let managerId = getId(responses.newManagerOfEmployee, "employee");

//     let updateEmployeeManagerQuery = `UPDATE employee 
//                                       SET employee.manager_id = ${managerId}
//                                       WHERE employee.id = ${employeeId};`;

//     let response = await queryDatabase(updateEmployeeManagerQuery, "Update");

//     if(response === "success"){

//         console.log(`Updated the manager of employee ${responses.employeeName} to ${responses.newManagerOfEmployee}.`);
//     } 
// }

// async function viewEmployeesByManager(){

//     let responses = await askQuestion("viewEmployeesByManager");

//     let managerId =  getId(responses.managerName, "employee");

//     let managerQueryPiece = undefined;

//     let finalJoinQueryPiece = undefined;

//     if(managerId !== "NULL"){

//         managerQueryPiece = `CONCAT(e2.first_name, " ", e2.last_name)`;
//         finalJoinQueryPiece = `LEFT OUTER JOIN employee e2 ON e1.manager_id = e2.id WHERE e1.manager_id = ${managerId};`
    
//     } else {

//         managerQueryPiece = `manager_id`
//         finalJoinQueryPiece = `WHERE e1.manager_id IS NULL`;
//     }

//     let getEmployeesByManagerQuery = `SELECT e1.id, e1.first_name, e1.last_name, role.title AS job_title, department.name AS department, ${managerQueryPiece} AS manager 
//                                       FROM employee e1
//                                       JOIN role on e1.role_id = role.id
//                                       JOIN department on role.department_id = department.id 
//                                       ${finalJoinQueryPiece};`

//     let returnedData = queryDatabase(getEmployeesByManagerQuery, "Select");

//     console.table(returnedData[0]);
// }

// async function viewEmployeesByDepartment(){

//     let responses = await askQuestion("viewEmployeesByDepartment");

//     let departmentId = getId(responses.departmentName, "department");

//     let getEmployeesByDepartmentQuery = `SELECT e1.id, e1.first_name, e1.last_name, role.title AS job_title, CONCAT(e2.first_name, " ", e2.last_name) as manager, department.name AS department
//                                          FROM employee e1
//                                          JOIN role on e1.role_id = role.id
//                                          JOIN department on role.department_id = department.id 
//                                          LEFT OUTER JOIN employee e2 ON e1.manager_id = e2.id WHERE department.id = ${departmentId} ORDER BY e1.id;`;
    
//     let returnedData = queryDatabase(getEmployeesByDepartmentQuery, "Select");

//     console.table(returnedData[0]);
// }

// async function deleteDepartment(){

//     let responses = await askQuestion("deleteDepartment")

//     let departmentId =  getId(responses.departmentName, "department");

//     let deleteDepartmentQuery = `DELETE FROM department 
//                                  WHERE department.id = ${departmentId};`;

//     let response = queryDatabase(deleteDepartmentQuery, "Delete");


//     if(response === "success"){

//         console.log(`department '${responses.departmentName}' has been deleted from the database.`);
//     }
    
// }

// async function deleteRole(){

//     let responses = await askQuestion("deleteRole");

//     let roleId =  getId(responses.departmentName, "role");

//     let deleteRoleQuery = `DELETE FROM role 
//                            WHERE role.id = ${roleId};`;

//     let response = queryDatabase(deleteRoleQuery, "Delete");
   
//     if(response === "success"){

//         console.log(`department '${responses.departmentName}' has been deleted from the database.`);
//     }
// }
    

// async function deleteEmployee(){

//     let responses = await askQuestion("deleteEmployee");

//     let employeeId =  getId(responses.departmentName, "role");

//     let deleteEmployeeQuery = `DELETE FROM employee 
//                                WHERE employee.id = ${employeeId};`;

//     let response = queryDatabase(deleteEmployeeQuery, "Delete");
   
//     if(response === "success"){

//         console.log(`department '${responses.departmentName}' has been deleted from the database.`);
//     }
// }

// async function viewDepartmentBudget(){

//     let responses = await askQuestion("viewDepartmentBudget");

//     let departmentId =  getId(responses.departmentName, "department");

//     let queryTwo = `SELECT department.name AS department, SUM(salary) AS total_budget FROM role 
//                     JOIN employee ON employee.role_id = role.id 
//                     JOIN department ON role.department_id = department.id
//                     WHERE role.department_id = ${departmentId};`

//     let returnedData = await queryDatabase(queryTwo, "Select");
    
//     console.table(returnedData[0]);
// }

async function askQuestion(questionName){

    let questionToBeAsked = questions.find(question => question.name === questionName);

    let responses = await inquirer.prompt(questionToBeAsked.questions);
    return responses;
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
    
        let idData = await queryDatabase(idQuery, "Select");
    
        id = idData[0][0].id;
    }
    
    return id;
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
        if(queryType !== "Select"){
            
            returnValue = "failure";

        }
    }
        return returnValue;
}

begin();