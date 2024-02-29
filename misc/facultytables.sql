
Use FacultyElectionsDB;

DROP TABLE IF EXISTS Faculty;
DROP TABLE IF EXISTS Committees;
Drop TABLE IF EXISTS Faculty_Committees;
DROP TABLE IF EXISTS Admin_Login;

CREATE TABLE IF NOT EXISTS Faculty (CWID INT PRIMARY KEY, 
RecActive ENUM("Y","N") DEFAULT "Y",
First_Name VARCHAR(63), 
Last_Name VARCHAR(63), 
Preferred_Name VARCHAR(127), 
Service_Statement VARCHAR(4095) DEFAULT "Faculty member has not written a statement of service.", 
Candidate_Statement VARCHAR(4095) DEFAULT "Why you should vote for me.", 
School_Name ENUM("School of Communication and the Arts", 
"School of Computer Science and Mathematics", "School of Liberal Arts", "School of Management", "School of Science", 
"School of Social and Behavioural Sciences", "School of Professional Programs"),
Is_On_Committee BOOLEAN,
Website_URL VARCHAR(255) );


CREATE TABLE IF NOT EXISTS Committees (Committee_ID INT PRIMARY KEY, Committee_Name TEXT, RecActive BOOLEAN);
INSERT INTO Committees VALUES (0, "Faculty Affairs Committee", True);
INSERT INTO Committees VALUES (1, "Academic Affairs Committee", True);
INSERT INTO Committees VALUES (2, "Online Distance Education Committee", True);
INSERT INTO Committees VALUES (3, "Budget Review Committee", True);
INSERT INTO Committees VALUES (4, "Rank and Tenure Committee");
INSERT INTO Committees VALUES (5, "Academic Standards Committee", True);
INSERT INTO Committees VALUES (6, "Curriculum Committee", True);
INSERT INTO Committees VALUES (7, "Faculty/Student Affairs Committee", True);
INSERT INTO Committees VALUES (8, "Grievance Committee", True);
INSERT INTO Committees VALUES (9, "Graduate Council", True);
INSERT INTO Committees VALUES (10, "Library Development Committee", True);
INSERT INTO Committees VALUES (11, "Faculty Research & Sabbaticals Committee", True);
INSERT INTO Committees VALUES (12, "Core and Liberal Studies", True);
INSERT INTO Committees VALUES (13, "Integrative Major Committee", True);
INSERT INTO Committees VALUES (14, "Priorities and Resources Committee", True);
INSERT INTO Committees VALUES (15, "Honors Council", True);
INSERT INTO Committees VALUES (16, "Professional Programs Committee", True);
INSERT INTO Committees VALUES (17, "Curriculum Committee", True);
INSERT INTO Committees VALUES (18, "Assessment Committee", True);
INSERT INTO Committees VALUES (19, "Institutional Review Board", True);
INSERT INTO Committees VALUES (20, "Campus Sustainability Advisory Committee", True);
INSERT INTO Committees VALUES (21, "Marist 100 Strategic Planning Committee", True);
INSERT INTO Committees VALUES (22, "Marist 100 Action Planning Committee", True);
INSERT INTO Committees VALUES (23, "Peer Review Committee", True);
INSERT INTO Committees VALUES (24, "Campus Campaign Committee (fundraising)", True);

CREATE TABLE IF NOT EXISTS Faculty_Committees (CWID INT, Committee_ID INT);

CREATE TABLE IF NOT EXISTS Admin_Login (Username VARCHAR(50) PRIMARY KEY, Admin_Password VARCHAR(100), Salt VARCHAR(20));



INSERT INTO Faculty VALUES (0, "Y", "Test", "User", "Test User 1", DEFAULT, DEFAULT, "School of Science", True, "https://www.marist.edu");
INSERT INTO Faculty VALUES (1, "Y", "Test1", "User1", "Test User 2", DEFAULT, DEFAULT, "School of Management", True, "https://www.marist.edu");
INSERT INTO Faculty VALUES (2, "Y", "Test2", "User2", "Test User 3", DEFAULT, DEFAULT, "School of Liberal Arts", True, "https://www.marist.edu");


INSERT INTO Committees VALUES (16, "Test", False);


INSERT INTO Admin_Login VALUES ("testadmin", "fad61dcf952d156f39a4ace90174a7744db38a06f86e27b4a5891a1696859b4f", "19ba4b2bd6c33461");

DELETE FROM Faculty_Committees WHERE CWID = 0 AND Committee_ID = 3;