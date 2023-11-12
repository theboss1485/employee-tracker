# Employee Tracker

## Description

My motivation for building this project was to gain experience with integrating database functionality into a command-line application.  I built this project so that I could gain practice with querying a local database, and so that I could learn how to use database queries with the inquirer package.  This project solves the problem of a small company needing to keep track of the various departments, job titles (roles), and employees that it has.  The project allows users to create, read, update, and delete departments, roles, and employees.  With this project, I learned how to query a local database using Javascript, and I also learned a bit more about the functionality of the Inquirer package. 

## Table of Contents (Optional)

This README isn't that long, so N/A.

## Installation

First, clone my GitHub repository with the "git clone" command.  Then, you will need to install the necessary dependencies, which are inquirer, and mysql2.  You can install them by running the command "npm install".  After this, I recommend running the .sql files in the database folder to create and seed the database.  To do this, first, navigate to the database folder in the program structure.  Then, run the command 
"mysql -u [your mysql username] -p [your mysql password]" and then enter your password.  Once you are inside the mysql shell, run the commands "source schema.sql" and "source seeds.sql" to create and seed the database.

## Usage

To start the program, navigate to the correct folder, and run the command "node index.js".  The usage of this program is relatively straightfoward.  The program will ask you what you would like to do.  Navigate between the options using the up and down arrow keys, and hit **Enter** to make a choice.  

The first three options, View All Departments, View All Roles, and View All Employees each print out a single table with one of the three types of data (departments, roles, and employees, respectively).  

For the options to add a department, a role or an employee you will be prompted to enter the name of the department, role, or employee, and then a check will make sure you haven't entered illegal characters.   For the department, that all you will need to do before the department will be added to the database.  For adding a role, you will need also need to enter the salary of the role (a number with an optional formatting of two decimal places), and the department that the role belongs to.  When adding an employee, in addition to entering the employee's name, you will also need to enter the role the employee has and the employee's manager. 

For the options of updating an employee's role and updating an employee's manager, you will need to select the employee and also select the role or manager that he or she will now have.  It is worth noting that when updating an employee's role, you can't update it to the same role they already have.  Additionally, when updating an employee's manager, you can't give him or her the same manager he or she already has, and you can also choose to not give the employee a manager (denoted by the option "No Manager").

For the options of viewing employees by manager and viewing employees by department, you will need to select a department or a manager, and then the system will display a table containing all the employees in that department or under that manager, respectively.

For the options of deleting a department, an employee, or a user, you will first need to select a department, an employee, or a user, respectively, and then the system will remove the record in question from the database.

For the option of viewing the total utilized budget of a department, you will need to select a department.  Then, the system will total up the salaries of all the employees who are in roles that belong to that department, and display the result in a table.

The "Quit the Application" option will stop the program.



## Credits

I took a regular expression from [https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name](https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name) and used it for validation.  This regular expression appears to have been given by the Stack Overflow user maček.  Here is a link to his profile: [https://stackoverflow.com/users/184600/ma%c4%8dek](https://stackoverflow.com/users/184600/ma%c4%8dek).

I also used OSUs Xpert Learning Assistant AI chatbot to help out with writing the code.

## License

This project is under an MIT license.  Please see the license in the GitHub repository for more information.

## Badges

I don't have any noteworthy badges to display.

## Features

This project is a relatively simple database application that keeps track of departments, roles, and employee.  The implication of this would be that it would be used in a company.  It allows the user to view, create and delete all three types of data.  The user can also update the roles managers that individual employees have, view the employees that belong to a specific manager or department, and also view the total budget for a department, which is the combined salaries of all the employees that belong to all the roles within that department.

## How to Contribute

This was an assignment I personally completed, so N/A.

## Tests

N/A