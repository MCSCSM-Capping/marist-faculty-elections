
Use FacultyElectionsDB;

DROP TABLE IF EXISTS Faculty;
DROP TABLE IF EXISTS Committees;
Drop TABLE IF EXISTS Schools;
Drop TABLE IF EXISTS Faculty_Committees;
DROP TABLE IF EXISTS Admin_Login;

CREATE TABLE IF NOT EXISTS Faculty (CWID INT PRIMARY KEY, 
RecActive ENUM("Y","N") DEFAULT "Y",
First_Name VARCHAR(50), 
Last_Name VARCHAR(50), 
Preferred_Name VARCHAR(100), 
Service_Statement VARCHAR(255) DEFAULT "Faculty member has not written a statement of service.", 
Candidate_Statement VARCHAR(800) DEFAULT "Not Available.", 
School_Name ENUM("School of Communication and the Arts", 
"School of Computer Science and Mathematics", "School of Liberal Arts", "School of Management", "School of Science", 
"School of Social and Behavioural Sciences", "School of Professional Programs"),
Is_On_Committee BOOLEAN,
Website_URL VARCHAR(150) );
INSERT INTO Faculty VALUES (0, "Y", "Test", "User", "Test User 1", DEFAULT, DEFAULT, "School of Science", True, "https://www.marist.edu");
INSERT INTO Faculty VALUES (1, "Y", "Test1", "User1", "Test User 2", DEFAULT, DEFAULT, "School of Management", True, "https://www.marist.edu");
INSERT INTO Faculty VALUES (2, "Y", "Test2", "User2", "Test User 3", DEFAULT, DEFAULT, "School of Liberal Arts", True, "https://www.marist.edu");

CREATE TABLE IF NOT EXISTS Committees (Committee_ID INT PRIMARY KEY, Committee_Name TEXT);
INSERT INTO Committees VALUES (0, "Faculty Affairs Committee");
INSERT INTO Committees VALUES (1, "Academic Affairs Committee");
INSERT INTO Committees VALUES (2, "Online Distance Education Committee");
INSERT INTO Committees VALUES (3, "Budget Review Committee");
INSERT INTO Committees VALUES (4, "Rank and Tenure Committee");
INSERT INTO Committees VALUES (5, "Academic Standards Committee");
INSERT INTO Committees VALUES (6, "Curriculum Committee");
INSERT INTO Committees VALUES (7, "Faculty/Student Affairs Committee");
INSERT INTO Committees VALUES (8, "Grievance Committee");
INSERT INTO Committees VALUES (9, "Graduate Council");
INSERT INTO Committees VALUES (10, "Library Development Committee");
INSERT INTO Committees VALUES (11, "Faculty Research & Sabbaticals Committee");
INSERT INTO Committees VALUES (12, "Core and Liberal Studies");
INSERT INTO Committees VALUES (13, "Integrative Major Committee");
INSERT INTO Committees VALUES (14, "Priorities and Resources Committee");
INSERT INTO Committees VALUES (15, "Honors Council");

CREATE TABLE IF NOT EXISTS Faculty_Committees (CWID INT, Committee_ID INT);

CREATE TABLE IF NOT EXISTS Admin_Login (Username VARCHAR(50) PRIMARY KEY, Admin_Password VARCHAR(100), Salt VARCHAR(20));
INSERT INTO Admin_Login VALUES ("testadmin", "fad61dcf952d156f39a4ace90174a7744db38a06f86e27b4a5891a1696859b4f", "19ba4b2bd6c33461");

DELETE FROM Faculty_Committees WHERE CWID = 0 AND Committee_ID = 3;
