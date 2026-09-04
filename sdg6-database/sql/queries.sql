USE sdg6_water;

-- Pump type distribution
SELECT pumpType,
       COUNT(*) AS count,
       ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tblWaterpump), 1) AS percentage
FROM tblWaterpump
GROUP BY pumpType
ORDER BY count DESC;

-- Pumps with their assigned employees
SELECT wp.waterPumpId,
       wp.pumpType,
       l.country,
       l.city,
       COUNT(wpe.employeeId) AS 'Assigned Employee Count',
       GROUP_CONCAT(CONCAT(e.forename, ' ', e.surname) SEPARATOR ', ') AS 'Assigned Employees'
FROM tblWaterpump wp
JOIN tblLocation l ON wp.locationId = l.locationId
LEFT JOIN tblWaterpumpsEmployees wpe ON wp.waterPumpId = wpe.waterPumpId
LEFT JOIN tblEmployees e ON wpe.employeeId = e.employeeId
GROUP BY wp.waterPumpId, wp.pumpType, l.country, l.city
ORDER BY COUNT(wpe.employeeId) DESC
LIMIT 50;

-- Pumps with most water tests
SELECT wp.waterPumpId,
       wp.pumpType,
       l.country,
       l.city,
       COUNT(wt.watertestId) AS 'Test Count',
       MIN(wt.testDate) AS 'First Test',
       MAX(wt.testDate) AS 'Latest Test'
FROM tblWaterpump wp
JOIN tblLocation l ON wp.locationId = l.locationId
LEFT JOIN tblWatertest wt ON wp.waterPumpId = wt.waterPumpId
GROUP BY wp.waterPumpId, wp.pumpType, l.country, l.city
ORDER BY COUNT(wt.watertestId) DESC
LIMIT 20;

-- Average water quality metrics by country
SELECT l.Country,
       COUNT(DISTINCT wt.WatertestID) AS 'Total Tests',
       ROUND(AVG(wt.waterpH), 2) AS 'Avg pH',
       ROUND(AVG(wt.arsenic), 2) AS 'Avg Arsenic (µg/L)',
       ROUND(AVG(wt.fluoride), 2) AS 'Avg Fluoride (mg/L)',
       ROUND(AVG(wt.bacteria), 1) AS 'Avg Bacteria (CFU/100mL)'
FROM tblWatertest wt
JOIN tblWaterpump wp ON wt.WaterPumpID = wp.WaterPumpID
JOIN tblLocation l ON wp.LocationID = l.LocationID
GROUP BY l.Country
ORDER BY l.Country;

--in the last 6 months, which pumps have been maintained and how does that correlate with water quality

SELECT 
    l.country,
    CASE 
        WHEN DATEDIFF(CURDATE(), rm.lastMaint) <= 180 THEN 'Recently Maintained'
        ELSE 'Not Recently Maintained'
    END AS maint_status,
    ROUND(AVG(wt.bacteria), 2) AS bacteria,
    ROUND(AVG(wt.arsenic), 2) AS arsenic,
    ROUND(AVG(wt.fluoride), 2) AS fluoride,
    COUNT(DISTINCT wp.waterPumpId) AS pump_count
FROM tblWaterPump wp
JOIN tblLocation l ON l.locationId = wp.locationId
LEFT JOIN (
    SELECT waterPumpId, MAX(maintenanceDate) AS lastMaint
    FROM tblMaintenance
    GROUP BY waterPumpId
) rm ON rm.waterPumpId = wp.waterPumpId
LEFT JOIN tblWaterTest wt ON wt.waterPumpId = wp.waterPumpId
WHERE wt.waterPumpId IS NOT NULL
GROUP BY l.country, maint_status
ORDER BY l.country, maint_status


--pumps that reqire above average levels of maintenence
WITH ordered AS (
    SELECT 
        m.maintenanceId,
        m.waterPumpId,
        m.maintenanceDate,
        LAG(m.maintenanceDate) OVER (PARTITION BY m.waterPumpId ORDER BY m.maintenanceDate) AS prevDate
    FROM tblMaintenance m
)
SELECT 
    o.waterPumpId,
    l.country,
    l.city,
    ROUND(AVG(DATEDIFF(o.maintenanceDate, o.prevDate)), 1) AS avgDaysBetweenMaintenance,
    COUNT(o.maintenanceId) AS maintenanceEvents
FROM ordered o
JOIN tblWaterPump wp ON wp.waterPumpId = o.waterPumpId
JOIN tblLocation l ON l.locationId = wp.locationId
WHERE o.prevDate IS NOT NULL
GROUP BY o.waterPumpId, l.country, l.city
ORDER BY avgDaysBetweenMaintenance ASC;




--countries with most inconsistent water quality (chart)
SELECT 
    l.country AS label,
    ROUND(STDDEV(wt.arsenic), 2) AS arsenic_sd,
    ROUND(STDDEV(wt.fluoride), 2) AS fluoride_sd,
    ROUND(STDDEV(wt.bacteria), 2) AS bacteria_sd,
    ROUND(
        (STDDEV(wt.arsenic) + STDDEV(wt.fluoride) + STDDEV(wt.bacteria)) / 3,
        2
    ) AS value
FROM tblWatertest wt
JOIN tblWaterPump wp ON wp.waterPumpId = wt.waterPumpId
JOIN tblLocation l ON l.locationId = wp.locationId
GROUP BY l.country
ORDER BY value DESC;

