
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
INSERT INTO Faculty VALUES (0, "Y", "Test", "User", "Test User 1", DEFAULT, DEFAULT, null, False, "https://www.marist.edu");

CREATE TABLE IF NOT EXISTS Committees (Committee_ID INT PRIMARY KEY, Committee_Name TEXT);
INSERT INTO Committees VALUES (0, "Test Committee 1");
INSERT INTO Committees VALUES (1, "Computer Science");
INSERT INTO Committees VALUES (2, "Art");
INSERT INTO Committees VALUES (3, "Math");
INSERT INTO Committees VALUES (4, "History");

CREATE TABLE IF NOT EXISTS Faculty_Committees (CWID INT, Committee_ID INT);

CREATE TABLE IF NOT EXISTS Admin_Login (Username VARCHAR(50) PRIMARY KEY, Admin_Password VARCHAR(100), Salt VARCHAR(20));