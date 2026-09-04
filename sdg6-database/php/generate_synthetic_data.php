<?php

// Project notes:
// - This script that generats our data was created by using ROO CODE and Cluade Opus 4.6. I shared the teams ERD and data dictionaries asking the LLM to generate synthetic data relevant to the schema. It showed me the structure and results. I believe this can be used to test and validate our schema implmentation going forward.
// 

// ============================================================
// SDG6 Water Pump Database — Synthetic Data Generator
// ============================================================
// Generates realistic synthetic data for all 9 tables in the
// sdg6_water database, focused on water-stressed areas in
// Sub-Saharan Africa.
//
// Usage:
//   php php/generate_synthetic_data.php [--clear] [--verbose]
//
// Options:
//   --clear   : Clear existing data before inserting
//   --verbose : Show detailed progress
// ============================================================

require_once __DIR__ . '/db_config.php';

// ============================================================
// Configuration
// ============================================================
$CONFIG = [
    'locations'    => 50,
    'departments'  => 6,
    'employees'    => 100,
    'equipment'    => 25,
    'waterpumps'   => 250,
    'watertests'   => 500,
    'maintenance'  => 350,
    'pump_emp'     => 400,
    'maint_emp'    => 500,
];

// Parse command line arguments
$clearData = in_array('--clear', $argv ?? []);
$verbose = in_array('--verbose', $argv ?? []);

// ============================================================
// Data Arrays
// ============================================================

// Countries with their counties/regions, cities, and basins
$LOCATIONS = [
    'Kenya' => [
        'counties' => ['Turkana', 'Marsabit', 'Garissa', 'Kitui', 'Makueni', 'Kilifi', 'Mandera', 'Wajir', 'Isiolo', 'Tana River'],
        'cities' => ['Lodwar', 'Moyale', 'Garissa', 'Kitui', 'Wote', 'Malindi', 'Mandera', 'Wajir', 'Isiolo', 'Hola'],
        'basins' => ['Tana', 'Athi', 'Ewaso Ng\'iro', 'Lake Turkana', 'Kerio Valley'],
    ],
    'Nigeria' => [
        'counties' => ['Borno', 'Yobe', 'Sokoto', 'Kano', 'Kaduna', 'Jigawa', 'Zamfara', 'Katsina', 'Bauchi', 'Gombe'],
        'cities' => ['Maiduguri', 'Damaturu', 'Sokoto', 'Kano', 'Kaduna', 'Dutse', 'Gusau', 'Katsina', 'Bauchi', 'Gombe'],
        'basins' => ['Lake Chad', 'Niger', 'Benue', 'Komadugu-Yobe', 'Hadejia'],
    ],
    'Ethiopia' => [
        'counties' => ['Afar', 'Somali', 'Oromia', 'Tigray', 'Amhara', 'SNNPR', 'Dire Dawa', 'Harari', 'Gambela'],
        'cities' => ['Semera', 'Jijiga', 'Dire Dawa', 'Mekelle', 'Bahir Dar', 'Hawassa', 'Harar', 'Gambela', 'Asosa'],
        'basins' => ['Awash', 'Omo', 'Blue Nile', 'Wabe Shebelle', 'Genale Dawa'],
    ],
    'Tanzania' => [
        'counties' => ['Dodoma', 'Singida', 'Shinyanga', 'Mwanza', 'Tabora', 'Mara', 'Simiyu', 'Geita', 'Kagera'],
        'cities' => ['Dodoma', 'Singida', 'Shinyanga', 'Mwanza', 'Tabora', 'Musoma', 'Bariadi', 'Geita', 'Bukoba'],
        'basins' => ['Rufiji', 'Pangani', 'Lake Victoria', 'Wami', 'Ruvuma'],
    ],
    'Ghana' => [
        'counties' => ['Upper East', 'Upper West', 'Northern', 'Volta', 'Savannah', 'North East', 'Oti', 'Bono East'],
        'cities' => ['Bolgatanga', 'Wa', 'Tamale', 'Ho', 'Damongo', 'Nalerigu', 'Dambai', 'Techiman'],
        'basins' => ['Volta', 'White Volta', 'Black Volta', 'Oti', 'Daka'],
    ],
    'Malawi' => [
        'counties' => ['Karonga', 'Mzimba', 'Lilongwe', 'Machinga', 'Zomba', 'Mangochi', 'Salima', 'Nkhotakota', 'Kasungu'],
        'cities' => ['Karonga', 'Mzuzu', 'Lilongwe', 'Zomba', 'Blantyre', 'Mangochi', 'Salima', 'Nkhotakota', 'Kasungu'],
        'basins' => ['Shire', 'Lake Malawi', 'South Rukuru', 'Bua', 'Linthipe'],
    ],
];

// Employee names by region
$NAMES = [
    'east_african' => [
        'forenames' => ['Amani', 'Baraka', 'Farida', 'Juma', 'Nia', 'Zawadi', 'Tendai', 'Wanjiku', 'Akinyi', 'Omondi', 'Kipchoge', 'Chebet', 'Nekesa', 'Wafula', 'Auma', 'Otieno', 'Nyambura', 'Mwende', 'Mutua', 'Kibet'],
        'surnames' => ['Ochieng', 'Mwangi', 'Kimani', 'Wanjiku', 'Otieno', 'Kamau', 'Njoroge', 'Kipchoge', 'Korir', 'Cheruiyot', 'Wekesa', 'Simiyu', 'Ouma', 'Achieng', 'Nyong\'o'],
    ],
    'west_african' => [
        'forenames' => ['Adaeze', 'Chidi', 'Emeka', 'Folake', 'Kofi', 'Yemi', 'Amara', 'Kwesi', 'Ngozi', 'Oluwaseun', 'Chidinma', 'Obinna', 'Adebayo', 'Funke', 'Kwame', 'Ama', 'Akosua', 'Kojo', 'Efua', 'Yaw'],
        'surnames' => ['Okonkwo', 'Adeyemi', 'Mensah', 'Asante', 'Diallo', 'Traore', 'Okafor', 'Balogun', 'Owusu', 'Boateng', 'Agyeman', 'Nkrumah', 'Abubakar', 'Ibrahim', 'Suleiman'],
    ],
    'southern_african' => [
        'forenames' => ['Chipo', 'Farai', 'Lindiwe', 'Sipho', 'Thandiwe', 'Zola', 'Tendai', 'Blessing', 'Tawanda', 'Rumbidzai', 'Tatenda', 'Nyasha', 'Tapiwa', 'Rutendo', 'Kudzai', 'Takudzwa', 'Rudo', 'Tinashe', 'Munashe', 'Panashe'],
        'surnames' => ['Banda', 'Phiri', 'Moyo', 'Ndlovu', 'Dlamini', 'Mwale', 'Chirwa', 'Tembo', 'Mbewe', 'Zimba', 'Nyirenda', 'Gondwe', 'Kamanga', 'Mhango', 'Jere'],
    ],
];

// Departments
$DEPARTMENTS = [
    'Engineering',
    'Maintenance',
    'Operations',
    'Water Quality',
    'Community Relations',
    'Administration',
];

// Equipment
$EQUIPMENT = [
    // Water Testing Kits
    ['name' => 'Digital pH Meter', 'type' => 'Water Testing Kit'],
    ['name' => 'Arsenic Test Kit', 'type' => 'Water Testing Kit'],
    ['name' => 'Fluoride Test Kit', 'type' => 'Water Testing Kit'],
    ['name' => 'Bacteria Culture Kit', 'type' => 'Water Testing Kit'],
    ['name' => 'Portable Turbidity Meter', 'type' => 'Water Testing Kit'],
    ['name' => 'TDS Meter', 'type' => 'Water Testing Kit'],
    ['name' => 'Chlorine Test Kit', 'type' => 'Water Testing Kit'],
    ['name' => 'Conductivity Meter', 'type' => 'Water Testing Kit'],
    ['name' => 'Nitrate Test Kit', 'type' => 'Water Testing Kit'],
    // Repair Tools
    ['name' => 'Pipe Wrench Set', 'type' => 'Repair Tool'],
    ['name' => 'Pump Cylinder Kit', 'type' => 'Repair Tool'],
    ['name' => 'Seal Replacement Kit', 'type' => 'Repair Tool'],
    ['name' => 'Drilling Equipment', 'type' => 'Repair Tool'],
    ['name' => 'Portable Welding Kit', 'type' => 'Repair Tool'],
    ['name' => 'Pressure Gauge Set', 'type' => 'Repair Tool'],
    ['name' => 'Pipe Cutter', 'type' => 'Repair Tool'],
    ['name' => 'Thread Tap Set', 'type' => 'Repair Tool'],
    // Safety Gear
    ['name' => 'Safety Helmet', 'type' => 'Safety Gear'],
    ['name' => 'Work Gloves', 'type' => 'Safety Gear'],
    ['name' => 'Safety Boots', 'type' => 'Safety Gear'],
    ['name' => 'High-Vis Vest', 'type' => 'Safety Gear'],
    ['name' => 'First Aid Kit', 'type' => 'Safety Gear'],
    ['name' => 'Water Sampling Bottles', 'type' => 'Safety Gear'],
    ['name' => 'Safety Goggles', 'type' => 'Safety Gear'],
    ['name' => 'Respirator Mask', 'type' => 'Safety Gear'],
];

// Pump types with distribution
$PUMP_TYPES = [
    'Hand Pump' => 60,
    'Mechanized Pump' => 25,
    'Solar Pump' => 15,
];

// Maintenance descriptions
$MAINTENANCE_DESCRIPTIONS = [
    'Routine inspection and cleaning of pump components',
    'Replaced worn seals and gaskets',
    'Repaired broken handle mechanism',
    'Cleaned and disinfected water storage tank',
    'Replaced corroded pipes',
    'Fixed leaking joints and connections',
    'Installed new pump cylinder',
    'Repaired solar panel connections',
    'Replaced motor bearings',
    'Cleared debris from intake pipe',
    'Adjusted pump alignment',
    'Replaced worn foot valve',
    'Repaired cracked pump housing',
    'Installed new pressure gauge',
    'Replaced damaged rising main',
    'Serviced generator for mechanized pump',
    'Replaced worn plunger assembly',
    'Fixed electrical connections',
    'Installed new check valve',
    'Repaired borehole casing',
];

// ============================================================
// Helper Functions
// ============================================================

/**
 * Generate a random date between two dates
 */
function randomDate(string $start, string $end): string {
    $startTs = strtotime($start);
    $endTs = strtotime($end);
    $randomTs = mt_rand($startTs, $endTs);
    return date('Y-m-d', $randomTs);
}

/**
 * Generate a random date of birth for an employee (age 22-60)
 */
function randomDOB(): string {
    $minAge = 22;
    $maxAge = 60;
    $year = date('Y') - mt_rand($minAge, $maxAge);
    $month = mt_rand(1, 12);
    $day = mt_rand(1, 28);
    return sprintf('%04d-%02d-%02d', $year, $month, $day);
}

/**
 * Generate a random phone number for African countries
 */
function randomPhone(string $country): string {
    $codes = [
        'Kenya' => '+254',
        'Nigeria' => '+234',
        'Ethiopia' => '+251',
        'Tanzania' => '+255',
        'Ghana' => '+233',
        'Malawi' => '+265',
    ];
    $code = $codes[$country] ?? '+254';
    return $code . mt_rand(700000000, 799999999);
}

/**
 * Generate a random email
 */
function randomEmail(string $forename, string $surname): string {
    $domains = ['wateraid.org', 'sdg6project.org', 'cleanwater.org', 'pumptech.co', 'waterworks.org'];
    $domain = $domains[array_rand($domains)];
    $forename = strtolower(preg_replace('/[^a-zA-Z]/', '', $forename));
    $surname = strtolower(preg_replace('/[^a-zA-Z]/', '', $surname));
    $num = mt_rand(1, 99);
    return "{$forename}.{$surname}{$num}@{$domain}";
}

/**
 * Generate water quality test values based on country-specific issues
 */
function generateWaterTestValues(string $country): array {
    // Base distributions
    $values = [];
    
    // pH (6.0 - 9.5 range, mostly 6.5-8.5)
    $rand = mt_rand(1, 100);
    if ($rand <= 70) {
        $values['pH'] = round(mt_rand(65, 85) / 10, 1);
    } elseif ($rand <= 90) {
        $values['pH'] = mt_rand(0, 1) ? round(mt_rand(60, 65) / 10, 1) : round(mt_rand(85, 90) / 10, 1);
    } else {
        $values['pH'] = mt_rand(0, 1) ? round(mt_rand(50, 60) / 10, 1) : round(mt_rand(90, 95) / 10, 1);
    }
    
    // Arsenic (µg/L) - higher in Ethiopia, Ghana, Nigeria
    $arsenicBase = match($country) {
        'Ethiopia' => [0, 80, 60],   // [min, max, elevated_chance%]
        'Ghana' => [0, 150, 50],
        'Nigeria' => [0, 100, 40],
        default => [0, 50, 25],
    };
    $rand = mt_rand(1, 100);
    if ($rand <= (100 - $arsenicBase[2])) {
        $values['arsenic'] = round(mt_rand(0, 100) / 10, 3); // 0-10 µg/L (safe)
    } else {
        $values['arsenic'] = round(mt_rand(100, $arsenicBase[1] * 10) / 10, 3);
    }
    
    // Fluoride (mg/L) - higher in East African Rift Valley
    $fluorideBase = match($country) {
        'Kenya' => [0, 80, 45],      // [min*10, max*10, elevated_chance%]
        'Ethiopia' => [0, 60, 40],
        'Tanzania' => [0, 50, 35],
        default => [0, 30, 20],
    };
    $rand = mt_rand(1, 100);
    if ($rand <= (100 - $fluorideBase[2])) {
        $values['fluoride'] = round(mt_rand(0, 15) / 10, 2); // 0-1.5 mg/L (safe)
    } else {
        $values['fluoride'] = round(mt_rand(15, $fluorideBase[1]) / 10, 2);
    }
    
    // Bacteria (CFU/100mL) - higher in Nigeria, Malawi
    $bacteriaBase = match($country) {
        'Nigeria' => [0, 5000, 50],
        'Malawi' => [0, 2000, 45],
        default => [0, 1000, 30],
    };
    $rand = mt_rand(1, 100);
    if ($rand <= 50) {
        $values['bacteria'] = round(mt_rand(0, 100) / 10, 1); // 0-10 CFU (safe)
    } elseif ($rand <= 75) {
        $values['bacteria'] = round(mt_rand(100, 1000) / 10, 1); // 10-100 CFU
    } elseif ($rand <= 90) {
        $values['bacteria'] = round(mt_rand(1000, 10000) / 10, 1); // 100-1000 CFU
    } else {
        $values['bacteria'] = round(mt_rand(10000, $bacteriaBase[1] * 10) / 10, 1);
    }
    
    return $values;
}

/**
 * Determine water quality based on test values
 */
function determineWaterQuality(array $testValues): string {
    $issues = 0;
    
    if ($testValues['pH'] < 6.5 || $testValues['pH'] > 8.5) $issues++;
    if ($testValues['arsenic'] > 10) $issues++;
    if ($testValues['fluoride'] > 1.5) $issues++;
    if ($testValues['bacteria'] > 10) $issues++;
    
    if ($issues === 0) return 'High';
    if ($issues <= 2) return 'Medium';
    return 'Low';
}

/**
 * Select a random pump type based on distribution
 */
function randomPumpType(array $types): string {
    $rand = mt_rand(1, 100);
    $cumulative = 0;
    foreach ($types as $type => $percentage) {
        $cumulative += $percentage;
        if ($rand <= $cumulative) {
            return $type;
        }
    }
    return array_key_first($types);
}

/**
 * Print progress message
 */
function progress(string $message, bool $verbose = false, bool $forceShow = false): void {
    if ($verbose || $forceShow) {
        echo $message . "\n";
    }
}

// ============================================================
// Main Script
// ============================================================

echo "============================================================\n";
echo "SDG6 Water Pump Database — Synthetic Data Generator\n";
echo "============================================================\n\n";

// Connect to database
try {
    $conn = getDbConnection();
    echo "✓ Connected to database: " . DB_NAME . "\n\n";
} catch (Exception $e) {
    die("✗ Database connection failed: " . $e->getMessage() . "\n");
}

// Clear existing data if requested
if ($clearData) {
    echo "Clearing existing data...\n";
    
    // Disable foreign key checks temporarily
    $conn->query("SET FOREIGN_KEY_CHECKS = 0");
    
    $tables = [
        'tblMaintenanceEmployees',
        'tblWaterPumpsEmployees',
        'tblMaintenance',
        'tblWaterTest',
        'tblWaterPump',
        'tblEquipment',
        'tblEmployees',
        'tblDepartment',
        'tblLocation',
    ];
    
    foreach ($tables as $table) {
        $conn->query("TRUNCATE TABLE $table");
        progress("  Cleared $table", $verbose);
    }
    
    $conn->query("SET FOREIGN_KEY_CHECKS = 1");
    echo "✓ All tables cleared\n\n";
}

// Begin transaction
$conn->begin_transaction();

try {
    // --------------------------------------------------------
    // 1. Generate Locations
    // --------------------------------------------------------
    echo "Generating locations...\n";
    $locationIds = [];
    $locationCountries = [];
    $locationCount = 0;
    
    $stmt = $conn->prepare("INSERT INTO tblLocation (Country, County, City, basinName) VALUES (?, ?, ?, ?)");
    
    foreach ($LOCATIONS as $country => $data) {
        $numLocations = (int) ceil($CONFIG['locations'] / count($LOCATIONS));
        
        for ($i = 0; $i < $numLocations && $locationCount < $CONFIG['locations']; $i++) {
            $county = $data['counties'][array_rand($data['counties'])];
            $city = $data['cities'][array_rand($data['cities'])];
            $basin = $data['basins'][array_rand($data['basins'])];
            
            $stmt->bind_param("ssss", $country, $county, $city, $basin);
            $stmt->execute();
            
            $locationId = $conn->insert_id;
            $locationIds[] = $locationId;
            $locationCountries[$locationId] = $country;
            $locationCount++;
            
            progress("  Location $locationCount: $city, $county, $country", $verbose);
        }
    }
    $stmt->close();
    echo "✓ Generated $locationCount locations\n\n";
    
    // --------------------------------------------------------
    // 2. Generate Departments
    // --------------------------------------------------------
    echo "Generating departments...\n";
    $departmentIds = [];
    
    $stmt = $conn->prepare("INSERT INTO tblDepartment (DepartmentName) VALUES (?)");
    
    foreach ($DEPARTMENTS as $dept) {
        $stmt->bind_param("s", $dept);
        $stmt->execute();
        $departmentIds[] = $conn->insert_id;
        progress("  Department: $dept", $verbose);
    }
    $stmt->close();
    echo "✓ Generated " . count($departmentIds) . " departments\n\n";
    
    // --------------------------------------------------------
    // 3. Generate Employees
    // --------------------------------------------------------
    echo "Generating employees...\n";
    $employeeIds = [];
    
    $stmt = $conn->prepare("INSERT INTO tblEmployees (Forename, Surname, DOB, Address, Email, Phone, DepartmentID, LocationID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    $regions = array_keys($NAMES);
    $countries = array_keys($LOCATIONS);
    
    for ($i = 0; $i < $CONFIG['employees']; $i++) {
        // Rotate through regions
        $region = $regions[$i % count($regions)];
        $forename = $NAMES[$region]['forenames'][array_rand($NAMES[$region]['forenames'])];
        $surname = $NAMES[$region]['surnames'][array_rand($NAMES[$region]['surnames'])];
        $dob = randomDOB();
        
        // Generate address based on region
        $country = match($region) {
            'east_african' => ['Kenya', 'Tanzania', 'Ethiopia'][array_rand(['Kenya', 'Tanzania', 'Ethiopia'])],
            'west_african' => ['Nigeria', 'Ghana'][array_rand(['Nigeria', 'Ghana'])],
            'southern_african' => 'Malawi',
        };
        $countryData = $LOCATIONS[$country];
        $city = $countryData['cities'][array_rand($countryData['cities'])];
        $address = mt_rand(1, 500) . " " . ['Main Street', 'Water Road', 'Pump Lane', 'Well Avenue', 'Spring Drive'][array_rand(['Main Street', 'Water Road', 'Pump Lane', 'Well Avenue', 'Spring Drive'])] . ", $city, $country";
        
        $email = randomEmail($forename, $surname);
        $phone = randomPhone($country);
        $deptId = $departmentIds[array_rand($departmentIds)];
        $locId = $locationIds[array_rand($locationIds)];
        
        $stmt->bind_param("ssssssii", $forename, $surname, $dob, $address, $email, $phone, $deptId, $locId);
        $stmt->execute();
        $employeeIds[] = $conn->insert_id;
        
        progress("  Employee " . ($i + 1) . ": $forename $surname", $verbose);
    }
    $stmt->close();
    echo "✓ Generated " . count($employeeIds) . " employees\n\n";
    
    // --------------------------------------------------------
    // 4. Generate Equipment
    // --------------------------------------------------------
    echo "Generating equipment...\n";
    $equipmentIds = [];
    
    $stmt = $conn->prepare("INSERT INTO tblEquipment (EquipmentName, EquipmentType) VALUES (?, ?)");
    
    foreach ($EQUIPMENT as $equip) {
        $stmt->bind_param("ss", $equip['name'], $equip['type']);
        $stmt->execute();
        $equipmentIds[] = $conn->insert_id;
        progress("  Equipment: " . $equip['name'] . " (" . $equip['type'] . ")", $verbose);
    }
    $stmt->close();
    echo "✓ Generated " . count($equipmentIds) . " equipment items\n\n";
    
    // --------------------------------------------------------
    // 5. Generate Water Pumps
    // --------------------------------------------------------
    echo "Generating water pumps...\n";
    $pumpIds = [];
    $pumpData = []; // Store pump info for later use
    
    $stmt = $conn->prepare("INSERT INTO tblWaterPump (LocationID, PumpType, WaterQuality, InstallationDate, WaterOutput) VALUES (?, ?, ?, ?, ?)");
    
    for ($i = 0; $i < $CONFIG['waterpumps']; $i++) {
        $locationId = $locationIds[array_rand($locationIds)];
        $country = $locationCountries[$locationId];
        $pumpType = randomPumpType($PUMP_TYPES);
        
        // Generate test values to determine water quality
        $testValues = generateWaterTestValues($country);
        $waterQuality = determineWaterQuality($testValues);
        
        $installDate = randomDate('2018-01-01', '2026-01-01');
        
        // Water output based on pump type
        $waterOutput = match($pumpType) {
            'Hand Pump' => round(mt_rand(500, 2000) / 10, 2) * 10, // 50-200 L/hr
            'Mechanized Pump' => round(mt_rand(5000, 20000) / 10, 2), // 500-2000 L/hr
            'Solar Pump' => round(mt_rand(2000, 8000) / 10, 2), // 200-800 L/hr
        };
        
        $stmt->bind_param("isssd", $locationId, $pumpType, $waterQuality, $installDate, $waterOutput);
        $stmt->execute();
        
        $pumpId = $conn->insert_id;
        $pumpIds[] = $pumpId;
        $pumpData[$pumpId] = [
            'locationId' => $locationId,
            'country' => $country,
            'installDate' => $installDate,
            'waterQuality' => $waterQuality,
        ];
        
        progress("  Pump " . ($i + 1) . ": $pumpType at location $locationId ($waterQuality quality)", $verbose);
    }
    $stmt->close();
    echo "✓ Generated " . count($pumpIds) . " water pumps\n\n";
    
    // --------------------------------------------------------
    // 6. Generate Water Tests
    // --------------------------------------------------------
    echo "Generating water tests...\n";
    $testCount = 0;
    
    // Get only testing equipment IDs
    $testingEquipmentIds = [];
    $result = $conn->query("SELECT EquipmentID FROM tblEquipment WHERE EquipmentType = 'Water Testing Kit'");
    while ($row = $result->fetch_assoc()) {
        $testingEquipmentIds[] = $row['EquipmentID'];
    }
    
    $stmt = $conn->prepare("INSERT INTO tblWaterTest (WaterPumpID, EquipmentID, waterpH, arsenic, fluoride, bacteria, testDate) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    // Distribute tests across pumps (some pumps get multiple tests)
    $testsPerPump = [];
    for ($i = 0; $i < $CONFIG['watertests']; $i++) {
        $pumpId = $pumpIds[array_rand($pumpIds)];
        if (!isset($testsPerPump[$pumpId])) {
            $testsPerPump[$pumpId] = 0;
        }
        $testsPerPump[$pumpId]++;
    }
    
    foreach ($testsPerPump as $pumpId => $numTests) {
        $pump = $pumpData[$pumpId];
        
        for ($t = 0; $t < $numTests; $t++) {
            $equipmentId = $testingEquipmentIds[array_rand($testingEquipmentIds)];
            $testValues = generateWaterTestValues($pump['country']);
            
            // Test date must be after installation
            $testDate = randomDate($pump['installDate'], '2026-03-01');
            
            $stmt->bind_param("iidddds", 
                $pumpId, 
                $equipmentId, 
                $testValues['pH'], 
                $testValues['arsenic'], 
                $testValues['fluoride'], 
                $testValues['bacteria'], 
                $testDate
            );
            $stmt->execute();
            $testCount++;
            
            progress("  Test $testCount: Pump $pumpId - pH: " . $testValues['pH'] . ", Arsenic: " . $testValues['arsenic'], $verbose);
        }
    }
    $stmt->close();
    echo "✓ Generated $testCount water tests\n\n";
    
    // --------------------------------------------------------
    // 7. Generate Maintenance Records
    // --------------------------------------------------------
    echo "Generating maintenance records...\n";
    $maintenanceIds = [];
    $maintenanceData = [];
    
    $statuses = ['Completed', 'Ongoing', 'Uncompleted'];
    $statusWeights = [50, 30, 20];
    $conditions = ['Working', 'Under Construction', 'Maintenance Required'];
    $conditionWeights = [60, 10, 30];
    
    $stmt = $conn->prepare("INSERT INTO tblMaintenance (WaterPumpID, MaintenanceDate, MaintenanceStatus, PumpCondition, workDescription) VALUES (?, ?, ?, ?, ?)");
    
    for ($i = 0; $i < $CONFIG['maintenance']; $i++) {
        $pumpId = $pumpIds[array_rand($pumpIds)];
        $pump = $pumpData[$pumpId];
        
        // Maintenance date after installation
        $maintDate = randomDate($pump['installDate'], '2026-03-01');
        
        // Weighted random status
        $rand = mt_rand(1, 100);
        $cumulative = 0;
        $status = $statuses[0];
        foreach ($statuses as $idx => $s) {
            $cumulative += $statusWeights[$idx];
            if ($rand <= $cumulative) {
                $status = $s;
                break;
            }
        }
        
        // Weighted random condition
        $rand = mt_rand(1, 100);
        $cumulative = 0;
        $condition = $conditions[0];
        foreach ($conditions as $idx => $c) {
            $cumulative += $conditionWeights[$idx];
            if ($rand <= $cumulative) {
                $condition = $c;
                break;
            }
        }
        
        $description = $MAINTENANCE_DESCRIPTIONS[array_rand($MAINTENANCE_DESCRIPTIONS)];
        
        $stmt->bind_param("issss", $pumpId, $maintDate, $status, $condition, $description);
        $stmt->execute();
        
        $maintId = $conn->insert_id;
        $maintenanceIds[] = $maintId;
        $maintenanceData[$maintId] = ['pumpId' => $pumpId, 'date' => $maintDate];
        
        progress("  Maintenance " . ($i + 1) . ": Pump $pumpId - $status ($condition)", $verbose);
    }
    $stmt->close();
    echo "✓ Generated " . count($maintenanceIds) . " maintenance records\n\n";
    
    // --------------------------------------------------------
    // 8. Generate Waterpumps_Employees (Junction Table)
    // --------------------------------------------------------
    echo "Generating pump-employee assignments...\n";
    $pumpEmpCount = 0;
    $pumpEmpPairs = [];
    
    $stmt = $conn->prepare("INSERT INTO tblWaterPumpsEmployees (WaterPumpID, EmployeeID) VALUES (?, ?)");
    
    while ($pumpEmpCount < $CONFIG['pump_emp']) {
        $pumpId = $pumpIds[array_rand($pumpIds)];
        $empId = $employeeIds[array_rand($employeeIds)];
        
        $pairKey = "$pumpId-$empId";
        if (!isset($pumpEmpPairs[$pairKey])) {
            $stmt->bind_param("ii", $pumpId, $empId);
            $stmt->execute();
            $pumpEmpPairs[$pairKey] = true;
            $pumpEmpCount++;
            
            progress("  Assignment $pumpEmpCount: Pump $pumpId -> Employee $empId", $verbose);
        }
    }
    $stmt->close();
    echo "✓ Generated $pumpEmpCount pump-employee assignments\n\n";
    
    // --------------------------------------------------------
    // 9. Generate Maintenance_Employees (Junction Table)
    // --------------------------------------------------------
    echo "Generating maintenance-employee assignments...\n";
    $maintEmpCount = 0;
    $maintEmpPairs = [];
    
    $stmt = $conn->prepare("INSERT INTO tblMaintenanceEmployees (MaintenanceID, EmployeeID) VALUES (?, ?)");
    
    while ($maintEmpCount < $CONFIG['maint_emp']) {
        $maintId = $maintenanceIds[array_rand($maintenanceIds)];
        $empId = $employeeIds[array_rand($employeeIds)];
        
        $pairKey = "$maintId-$empId";
        if (!isset($maintEmpPairs[$pairKey])) {
            $stmt->bind_param("ii", $maintId, $empId);
            $stmt->execute();
            $maintEmpPairs[$pairKey] = true;
            $maintEmpCount++;
            
            progress("  Assignment $maintEmpCount: Maintenance $maintId -> Employee $empId", $verbose);
        }
    }
    $stmt->close();
    echo "✓ Generated $maintEmpCount maintenance-employee assignments\n\n";
    
    // Commit transaction
    $conn->commit();
    
    echo "============================================================\n";
    echo "✓ Synthetic data generation complete!\n";
    echo "============================================================\n\n";
    
    // Summary
    echo "Summary:\n";
    echo "  - Locations:              $locationCount\n";
    echo "  - Departments:            " . count($departmentIds) . "\n";
    echo "  - Employees:              " . count($employeeIds) . "\n";
    echo "  - Equipment:              " . count($equipmentIds) . "\n";
    echo "  - Water Pumps:            " . count($pumpIds) . "\n";
    echo "  - Water Tests:            $testCount\n";
    echo "  - Maintenance Records:    " . count($maintenanceIds) . "\n";
    echo "  - Pump-Employee Links:    $pumpEmpCount\n";
    echo "  - Maint-Employee Links:   $maintEmpCount\n";
    echo "\n";
    
} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();
    die("✗ Error: " . $e->getMessage() . "\n");
}

$conn->close();
