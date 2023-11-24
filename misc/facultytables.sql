
Use FacultyElectionsDB;

DROP TABLE IF EXISTS Faculty;
DROP TABLE IF EXISTS Committees;
Drop TABLE IF EXISTS Schools;
Drop TABLE IF EXISTS Faculty_Committees;
DROP TABLE IF EXISTS Admin_Login;

CREATE TABLE IF NOT EXISTS Faculty (CWID INT PRIMARY KEY, 
RecActive ENUM("Y","N") DEFAULT "Y", --change to "N" when deleted
First_Name VARCHAR(50), 
Last_Name VARCHAR(50), 
Preferred_Name VARCHAR(100), 
Service_Statement VARCHAR(255) DEFAULT "Faculty member has not written a statement of service.", 
Candidate_Statement VARCHAR(800) DEFAULT "Not Available.", 
School_ID INT,
Is_On_Committee BOOLEAN,
Website_URL VARCHAR(150) );
--INSERT INTO Faculty VALUES ();
--Select * From Faculty;

CREATE TABLE IF NOT EXISTS Committees (Committee_ID INT PRIMARY KEY, Committee_Name TEXT);
--INSERT INTO Committees VALUES ();
--Select * From Committees;

CREATE TABLE IF NOT EXISTS Schools (School_ID INT PRIMARY KEY, School_Name ENUM("School of Communication and the Arts", 
"School of Computer Science and Mathematics", "School of Liberal Arts", "School of Management", "School of Science", 
"School of Social and Behavioural Sciences", "School of Professional Programs"));
INSERT INTO Schools VALUES (0, "School of Communication and the Arts");
INSERT INTO Schools VALUES (1, "School of Computer Science and Mathematics");
INSERT INTO Schools VALUES (2, "School of Liberal Arts");
INSERT INTO Schools VALUES (3, "School of Management");
INSERT INTO Schools VALUES (4, "School of Science");
INSERT INTO Schools VALUES (5, "School of Social and Behavioural Sciences");
INSERT INTO Schools VALUES (6, "School of Professional Programs");

CREATE TABLE IF NOT EXISTS Faculty_Committees (CWID INT, Committee_ID INT);

CREATE TABLE IF NOT EXISTS Admin_Login (Username INT PRIMARY KEY, Admin_Password VARCHAR(100)); --password may change type