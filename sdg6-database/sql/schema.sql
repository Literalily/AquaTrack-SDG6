-- In this file we create the sdg6 database
-- To create the database do the following:  mysql -u root < sql/schema.sql

-- Delete the database if it exists... for testing
DROP DATABASE IF EXISTS sdg6_water;

-- Create the database
CREATE DATABASE sdg6_water
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Set the script to use the db created
USE sdg6_water;

-- tblLocation 
-- Purpose: geographic locations where water pumps are installed
CREATE TABLE tblLocation (
    locationId INT NOT NULL AUTO_INCREMENT,
    country VARCHAR(100) NOT NULL,
    county VARCHAR(100) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    basinName VARCHAR(100) DEFAULT NULL COMMENT 'River basin or watershed name',
    PRIMARY KEY (LocationID),
    INDEX idxLocationCountryCity (country, city)
) ENGINE=InnoDB;

-- tblDepartment
-- Purpose: geographic locations where water pumps are installed
CREATE TABLE tblDepartment (
    departmentId INT NOT NULL AUTO_INCREMENT,
    departmentName VARCHAR(100) NOT NULL,
    PRIMARY KEY (departmentId)
) ENGINE=InnoDB;


-- tblEmployees
-- Purpose: Staff responsible for pump installment and maintenance
CREATE TABLE tblEmployees (
    employeeId INT NOT NULL AUTO_INCREMENT,
    forename VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    DOB DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    departmentId INT NOT NULL,
    locationId INT NOT NULL,
    PRIMARY KEY (employeeId),
    INDEX idxEmployeesDepartment (departmentId),
    INDEX idxEmployeesLocation (locationId),
    FOREIGN KEY (departmentId) REFERENCES tblDepartment(departmentId),
    FOREIGN KEY (locationId) REFERENCES tblLocation(locationId)
) ENGINE=InnoDB;

-- tblWaterPump
-- Purpose: Individual water pumps
CREATE TABLE tblWaterPump (
    waterPumpId INT NOT NULL AUTO_INCREMENT,
    locationId INT NOT NULL,
    PumpType VARCHAR(100) NOT NULL COMMENT 'e.g. Hand Pump, Mechanized Pump, Solar Pump',
    waterQuality VARCHAR(100) NOT NULL,
    installationDate DATE NOT NULL,
    waterOutput DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (waterPumpId),
    INDEX idxWaterpumpLocation (locationId),
    INDEX idxWaterpumpType (pumpType),
    FOREIGN KEY (locationId) REFERENCES tblLocation(locationId)
) ENGINE=InnoDB;

-- tblEquipment
-- Purpose: Testing and maintenace equipment
CREATE TABLE tblEquipment (
    equipmentId INT NOT NULL AUTO_INCREMENT,
    equipmentName VARCHAR(100) NOT NULL,
    equipmentType VARCHAR(100) NOT NULL,
    PRIMARY KEY (equipmentId)
) ENGINE=InnoDB;

-- tblWatertest
-- Purpose: Water quality results for each pump
CREATE TABLE tblWaterTest (
    watertestId INT NOT NULL AUTO_INCREMENT,
    waterPumpId INT NOT NULL,
    equipmentId INT NOT NULL,
    waterpH DECIMAL(3,1) DEFAULT NULL COMMENT 'pH level (0.0-14.0)',
    arsenic DECIMAL(7,3) DEFAULT NULL COMMENT 'Arsenic concentration (microg/L)',
    fluoride DECIMAL(5,2) DEFAULT NULL COMMENT 'Fluoride concentration (mg/L)',
    bacteria DECIMAL(8,1) DEFAULT NULL COMMENT 'Bacterial colony count (CFU/100mL)',
    testDate DATE NOT NULL,
    PRIMARY KEY (watertestId),
    INDEX idxWatertestPumpDate (waterPumpId, testDate),
    INDEX idxWatertestEquipment (equipmentId),
    FOREIGN KEY (waterPumpId) REFERENCES tblWaterPump(waterPumpId),
    FOREIGN KEY (equipmentId) REFERENCES tblEquipment(equipmentId)
) ENGINE=InnoDB;

-- tblMaintenance
-- Purpose: Maintenance records for pumps
CREATE TABLE tblMaintenance (
    maintenanceId INT NOT NULL AUTO_INCREMENT,
    waterPumpId INT NOT NULL,
    maintenanceDate DATE NOT NULL,
    workDescription VARCHAR(255) NOT NULL,
    maintenanceStatus VARCHAR(100) NOT NULL,
    pumpCondition VARCHAR(100) NOT NULL,
    PRIMARY KEY (maintenanceId),
    INDEX idxMaintenancePump (waterPumpId),
    FOREIGN KEY (waterPumpId) REFERENCES tblWaterPump(waterPumpId)
) ENGINE=InnoDB;

-- tblWaterPumpsEmployees
-- Purpose: Which employees are assigned to each pump
CREATE TABLE tblWaterPumpsEmployees (
    waterPumpId INT NOT NULL,
    employeeId INT NOT NULL,
    PRIMARY KEY (waterPumpId, employeeId),
    INDEX idxWaterPumpEmployee (employeeId),
    FOREIGN KEY (waterPumpId) REFERENCES tblWaterPump(waterPumpId),
    FOREIGN KEY (employeeId) REFERENCES tblEmployees(employeeId)
) ENGINE=InnoDB;

-- tblMaintenanceEmployees
-- Purpose: which employees work on which maintenance jobs
CREATE TABLE tblMaintenanceEmployees (
    maintenanceId INT NOT NULL,
    employeeId INT NOT NULL,
    PRIMARY KEY (maintenanceId, employeeId),
    INDEX idxMaintenaceEemployee (employeeId),
    FOREIGN KEY (maintenanceId) REFERENCES tblMaintenance(maintenanceId),
    FOREIGN KEY (employeeId) REFERENCES tblEmployees(employeeId)
) ENGINE=InnoDB;

