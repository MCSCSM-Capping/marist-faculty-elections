
--Use FacultyElectionsDB;

DROP TABLE IF EXISTS Faculty;
DROP TABLE IF EXISTS Committees;
Drop TABLE IF EXISTS Schools;
Drop TABLE IF EXISTS Faculty_Committees;


CREATE TABLE IF NOT EXISTS Faculty (CWID INT PRIMARY KEY, 
RecActive ENUM("Y","N") DEFAULT "Y", --change to "N" when deleted
First_Name TEXT, 
Last_Name TEXT, 
Preferred_Name TEXT, 
Service_Statement TEXT, 
Candidate_Statement TEXT, 
School_ID INT,
Is_On_Committee NUMBER(1),
Website_URL TEXT, );
--INSERT INTO Faculty VALUES ();
--Select * From Faculty;

CREATE TABLE IF NOT EXISTS Committees (Committee_ID INT PRIMARY KEY, Committee_Name TEXT);
--INSERT INTO Committees VALUES ();
--Select * From Committees;

CREATE TABLE IF NOT EXISTS Schools (School_ID INT PRIMARY KEY, School_Name);
 --INSERT INTO T6_User VALUES ("1","Y","Andrew.Tokash@marist.edu","ProfAPTO","2021-10-7","Admin","Andrew","Tokash","21 Marist Way");
 --SELECT * From T6_User;

CREATE TABLE IF NOT EXISTS Faculty_Committees (CWID INT, Committee_ID INT);

--CREATE TABLE IF NOT EXISTS Admin_Login (Username INT PRIMARY KEY, Password INT);