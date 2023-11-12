INSERT INTO department(name)
VALUES ("Accounting"),
       ("Human Resources"),
       ("Information Technology"),
       ("Marketing"),
       ("Sales"),
       ("Top Level");
       

INSERT INTO role(title, salary, department_id)
VALUES ("Accountant", 100000, 1),
       ("Auditor", 110000, 1),
       ("Bookeeper", 70000, 1),
       ("Chief Financial Officer", 250000, 1),
       ("Financial Analyst", 95000, 1),

       ("Benefits Administrator", 80000, 2),
       ("Employee Relations Manager", 95000, 2),
       ("HR Coordinator", 70000, 2),
       ("Recruiter", 70000, 2),
       ("Recruitment Manager", 90000, 2),

       ("Computer Systems Analyst", 90000, 3),
       ("Chief Technology Officer", 300000, 3),
       ("Database Administrator", 120000, 3),
       ("Systems Adminstrator", 120000, 3),
       ("Software Developer", 85000, 3),

       ("Brand Manager", 85000, 4),
       ("Content Marketer", 80000, 4),
       ("Chief Marketing Officer", 200000, 4),
       ("Market Researcher", 70000, 4),
       ("Social Media Marketer", 75000, 4),

       ("Sales Associate", 60000, 5),
       ("Sales Associate Lead", 65000, 5),
       ("Sales Director", 90000, 5),
       ("Sales Engineer", 70000, 5),
       ("Sales Manager", 75000, 5),

       ("Chief Executive Officer", 500000, 6);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Matthew", "Miller", 26, NULL),

       ("Cody", "Wenrich-Clegg", 4, 1),
       ("Gabriel", "Morrow", 7, 1),
       ("Joe", "Axe", 12, 1),
       ("Michael", "Arrasmith", 18, 1),
       ("Rick", "Deakins", 23, 1),

       ("Abubakar", "Ahmed", 1, 2),
       ("Charity", "Graham", 2, 2),
       ("Chia", "Yang", 3, 2),
       ("Dusty", "Gray", 5, 2),
       
       
       ("Elliott", "Gibson-Creech", 6, 3),
       ("Grant", "Wolff", 8, 3),
       ("Jared", "Byrum", 9, 3),
       ("Jay", "Gallegos", 10, 3),
       
       
       ("Jeremy", "Corso", 11, 4),
       ("Joe", "Cameruca", 13, 4),
       ("Karra", "Maynard", 14, 4),
       ("Kasi", "Wilson", 15, 4),

       ("Mahmoud", "Ahmed", 16, 5),
       ("Maria", "Juan-Talledo", 17, 5),
       ("Nicholas", "Reel", 19, 5),
       ("Owen", "McCormick", 20, 5),

       
       ("Pamela", "Agrast", 21, 6),
       ("Quinn", "Combs", 22, 6),
       ("Sarah", "Leder", 24, 6),
       ("Sushmitha", "Reddy", 25, 6);

       
       
       
       



       
