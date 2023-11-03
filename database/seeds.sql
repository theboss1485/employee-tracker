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
       ("Financial Analyst", 95000, 1)

       ("Benefits Administrator", 80000, 2),
       ("Employee Relations Manager", 95000, 2)
       ("HR Coordinator", 70000, 2),
       ("HR Generalist", 75000, 2)
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
       ("Sales Development Representative", 65000, 5),
       ("Sales Director", 90000, 5),
       ("Sales Engineer", 70000, 5),
       ("Sales Manager", 75000, 5),

       ("Chief Executive Officer", 500000, 6),

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Abubakar", "Ahmed", 1, 4),
       ("Charity", "Graham", 2, 4),
       ("Chia", "Yang", 3, 4),
       ("Cody", "Wenrich-Clegg", 4, 26),
       ("Dusty", "Gray", 5, 4),

       ("Elliott", "Gibson-Creech", 6, 7),
       ("Gabriel", "Morrow", 7, 26),
       ("Grant", "Wolff", 8, 7),
       ("Jared", "Byrum", 9, 7),
       ("Jay", "Gallegos", 10, 7),

       ("Jeremy", "Corso", 11, 12),
       ("Joe", "Axe", 12, 26),
       ("Joe", "Cameruca", 13, 12),
       ("Karra", "Maynard", 14, 12),
       ("Kasi", "Wilson", 15, 12),

       ("Mahmoud", "Ahmed", 16, 18),
       ("Maria", "Juan-Talledo", 17, 18),
       ("Michael", "Arrasmith", 18, 26),
       ("Nicholas", "Reel", 19, 18),
       ("Owen", "McCormick", 20, 18),

       ("Pamela", "Agrast", 21, 23),
       ("Quinn", "Combs", 22, 23),
       ("Rick", "Deakins", 23, 26),
       ("Sarah", "Leder", 24, 23),
       ("Sushmitha", "Reddy", 25, 23),

       ("Matthew", "Miller", 26, NULL),
       
       
       



       
