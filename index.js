const questions = require('./library/questions.js');
const inquirer = require('inquirer');

async function begin(){

    let response = undefined

    while (response !== "Quit Application"){

        let valid = false

        try{

            response = await askQuestion("startingQuestion");
            valid = true;

        } catch(error){

            console.log(error.message);
        }

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
                    continue;
            }
        }
    }
}

async function viewDepartments(){

    console.log("View Departments");
}

async function viewRoles(){

    console.log("View Roles");
}

async function viewEmployees(){

    console.log("View Employees");
}

async function addDepartment(){

    console.log("add Department");

    let responses = await askQuestion("addDepartment");

    console.log("Department added");
}

async function addRole(){

    console.log("add Role");

    let responses = await askQuestion("addRole");
    console.log("role added");
}

async function addEmployee(){


    console.log("add employee");
    let responses = await askQuestion("addEmployee");
    console.log("Employee added");
}

async function updateEmployeeRole(){

    console.log("update Employee role");
    let responses = await askQuestion("updateEmployeeRole");
    console.log("Employee Role Updated");
}

async function updateEmployeeManager(){

    console.log("update Employee manager");
    let responses = await askQuestion("updateEmployeeManager");
    console.log("Employee manager updated");
}

async function viewEmployeesByManager(){

    let responses = await askQuestion("viewEmployeesByManager");
    console.log("Employees viewed by manager");
}

async function viewEmployeesByDepartment(){

    let responses = await askQuestion("viewEmployeesByDepartment");
    console.log("Employees viewed by department");
}

async function deleteDepartment(){

    let responses = await askQuestion("deleteDepartment")
    console.log("department deleted");
}

async function deleteRole(){

    let responses = await askQuestion("deleteRole");
    console.log("role deleted");
}

async function deleteEmployee(){

    let responses = await askQuestion("deleteEmployee")
    console.log("employee deleted");
}

async function viewDepartmentBudget(){

    let responses = await askQuestion("viewDepartmentBudget")
    console.log("department budget viewed");
}

async function askQuestion(questionName){

    let questionToBeAsked = questions.find(question => question.name === questionName);

    let responses = await inquirer.prompt(questionToBeAsked.questions);
    return responses;
}

begin();