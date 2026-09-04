// ── QUERY HELPER ───────────────────────────────────
// NOTE: moved outside showPage() so all functions can use it
function runQuery(sql, callback) {
  var formData = new FormData();
  formData.append('query', sql);
  fetch('dbConnector.php', { method: 'POST', body: formData })
    .then(function(response) { return response.json(); })
    .then(function(json) { callback(json); });
}


// ── PAGE NAVIGATION ────────────────────────────────
function showPage(pageId) {

  // Hide all pages
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('active');
  }

  // Remove active from all nav links
  var links = document.querySelectorAll('.nav-link');
  for (var i = 0; i < links.length; i++) {
    links[i].classList.remove('active');
  }

  // Show the selected page
  document.getElementById('page-' + pageId).classList.add('active');

  // Highlight the correct nav link
  for (var i = 0; i < links.length; i++) {
    var onclick = links[i].getAttribute('onclick');
    if (onclick && onclick.indexOf("'" + pageId + "'") !== -1) {
      links[i].classList.add('active');
    }
  }

  window.scrollTo(0, 0);

  // Load the correct data when a page is opened
  if (pageId === 'pumps')       loadPumps();
  if (pageId === 'locations')   loadLocations();
  if (pageId === 'watertests')  loadWaterTests();
  if (pageId === 'maintenance') loadMaintenance();
  if (pageId === 'employees')   loadEmployees();
  if (pageId === 'departments') loadDepartments();
  if (pageId === 'add-location') addLocation();
  if (pageId === 'employee-pump-assignment') employeePumpAssignmentReport();
  if (pageId === 'most-water-tests-pumps') mostWaterTestsReport();
  if (pageId === 'report-maintenance') loadMaintenanceReport();
  if (pageId === 'report-workload')    loadWorkloadReport();
  if (pageId === 'report-contamination') loadContaminationReport();
  if (pageId === 'add-maintenance') addMaintenance();
  if (pageId === 'add-waterPump') addWaterPump();
  if (pageId === 'add-watertest') addWaterTest();
  if (pageId === 'add-employee') setEmployeeIdLimits();
  if (pageId === 'edit-employee') setEmployeeIdLimits();
  if (pageId === 'edit-watertest') {}
  if (pageId === 'employee-main-assignment') employeeMainAssignmentReport();
  if (pageId === 'report-uncompleted-maintenance') uncompletedMaintenanceReport();
  if (pageId === 'report-installed-waterpumps') installedPumpsReport();
  if (pageId === 'maintenance-reliability') loadMaintenanceReliability();
  if (pageId === 'high-maintenance-pumps') loadHighMaintenancePumps();
  if (pageId === 'report-maintenance-history') loadMaintenanceHistoryReport();
}


// ── LOAD FUNCTIONS ─────────────────────────────────
// Each one queries the DB and builds the table rows

function loadPumps() {
  runQuery('SELECT * FROM tblwaterpump', function(json) {
    var tbody = document.getElementById('pumps-tbody');
    tbody.innerHTML = '';
    for (var i = 0; i < json.data.length; i++) {
      var p = json.data[i];
      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + p.waterPumpId + '</td>' +
        '<td>' + p.locationId + '</td>' +
        '<td>' + p.PumpType + '</td>' +
        '<td>' + p.waterQuality + '</td>' +
        '<td>' + p.installationDate + '</td>' +
        '<td>' + p.waterOutput + '</td>' +
        '<td><button onclick=\'editWaterPump(' + JSON.stringify(p) + ')\'>Edit</button> <button onclick=\'deleteWaterPump(' + JSON.stringify(p) + ')\'>Delete</button></td>';
      tbody.appendChild(row);
    }
  });
}

function addWaterPump() {
  // Simply display the correct div based on pageId
  // <div id="page-add-waterPump" class="page">
}

function editWaterPump(waterPump) {
  showPage('edit-waterPump');
 
  // Store selected ID
  selectedWaterPumpID = waterPump.waterPumpId;

  console.log(waterPump.waterPumpId);
  console.log(waterPump.locationId);
  console.log(waterPump.PumpType);
  console.log(waterPump.waterQuality);
  console.log(waterPump.installationDate);
  console.log(waterPump.waterOutput);
  
  // Fill form
  document.querySelector("#editWaterPumpID").value = waterPump.waterPumpId;
  document.querySelector("#editLocationId").value = waterPump.locationId;
  //document.querySelector("#editPumpType").value = waterPump.PumpType;
  //document.querySelector("#editWaterQuality").value = waterPump.waterQuality;
  document.querySelector("#editInstallDate").value = waterPump.installationDate;
  document.querySelector("#editWaterOutput").value = waterPump.waterOutput;

  // Clear message 
  const output = document.querySelector("#editWaterPumpOutput");
  output.textContent = "";
  output.className = "editWaterPumpMessage";
}

function deleteWaterPump(waterPump) {
  if (confirm('Are you sure you want to delete this water pump:\n\n - waterPumpId: ' + waterPump.waterPumpIdId + '\n - locationId: ' + location.locationId +'\n - pumpType: ' + waterPump.pumpType + '\n - waterQuality: ' + waterPump.waterQuality + '\n - installationDate: ' + waterPump.installationDate + '\n - waterOutput:' + waterPump.waterOutput)) {
    runQuery('DELETE FROM tblwaterpump WHERE waterPumpId = ' + waterPump.waterPumpId, function(result) {
      console.log(result);
    });
  };
  loadPumps();
}

function loadLocations() {

  runQuery('SELECT * FROM tbllocation', function(json) {
    var tbody = document.getElementById('locations-tbody');
    tbody.innerHTML = '';
    for (var i = 0; i < json.data.length; i++) {
      var l = json.data[i];
      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + l.locationId + '</td>' +
        '<td>' + (l.country || '') + '</td>' +
        '<td>' + (l.county   || '') + '</td>' +
        '<td>' + (l.city    || '') + '</td>' +
        '<td>' + (l.basinName   || '') + '</td>' +
        '<td><button onclick=\'editLocation(' + JSON.stringify(l) + ')\'>Edit</button> <button onclick=\'deleteLocation(' + JSON.stringify(l) + ')\'>Delete</button></td>';
      tbody.appendChild(row);
    }
  });
}

function addLocation() {
  // Simply display the correct div based on pageId
  // <div id="page-add-location" class="page">
}

function editLocation(location) {
  showPage('edit-location');
 
  // Store selected ID
  selectedLocationID = location.locationId;
  
  // Fill form
  document.querySelector("#editLocationID").value = location.locationId;
  document.querySelector("#editCountry").value = location.country;
  document.querySelector("#editCounty").value = location.county;
  document.querySelector("#editCity").value = location.city;
  document.querySelector("#editBasinName").value = location.basinName;

  // Clear message 
  const output = document.querySelector("#editOutput");
  output.textContent = "";
  output.className = "message";
}

function deleteLocation(location) {
  if (confirm('Are you sure you want to delete this location:\n\n - locationId: ' + location.locationId + '\n - country: ' + location.country + '\n - county: ' + location.county + '\n - city: ' + location.city + '\n - basinName:' + location.basinName)) {
    runQuery('DELETE FROM tbllocation WHERE locationId = ' + location.locationId, function(result) {
      console.log(result);
    });
  };
  loadLocations();
}

function loadWaterTests() {
  runQuery('SELECT * FROM tblwatertest', function(json) {
    var tbody = document.getElementById('tests-tbody');
    tbody.innerHTML = '';
    for (var i = 0; i < json.data.length; i++) {
      var t = json.data[i];
      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + t.watertestId + '</td>' +
        '<td>' + t.waterPumpId + '</td>' +
        '<td>' + t.equipmentId + '</td>' +
        '<td>' + (t.waterpH || '') + '</td>' +
        '<td>' + (t.arsenic || '') + '</td>' +
        '<td>' + (t.fluoride || '') + '</td>' +
        '<td>' + (t.bacteria || '') + '</td>' +
        '<td>' + t.testDate + '</td>' +
        '<td>' +
          '<button type="button" class="edit-btn" data-id="' + t.watertestId + '" data-pump="' + t.waterPumpId + '" data-equip="' + t.equipmentId + '" data-ph="' + (t.waterpH || '') + '" data-arsenic="' + (t.arsenic || '') + '" data-fluoride="' + (t.fluoride || '') + '" data-bacteria="' + (t.bacteria || '') + '" data-date="' + t.testDate + '">Edit</button> ' +
          '<button type="button" class="delete-btn" data-id="' + t.watertestId + '">Delete</button>' +
        '</td>';
      tbody.appendChild(row);
    }
    
    // Attach event listeners for Edit buttons
    document.querySelectorAll('.edit-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var data = this.dataset;
        editWaterTest({
          watertestId: parseInt(data.id),
          waterPumpId: parseInt(data.pump),
          equipmentId: parseInt(data.equip),
          waterpH: data.ph ? parseFloat(data.ph) : null,
          arsenic: data.arsenic ? parseFloat(data.arsenic) : null,
          fluoride: data.fluoride ? parseFloat(data.fluoride) : null,
          bacteria: data.bacteria ? parseFloat(data.bacteria) : null,
          testDate: data.date
        });
      });
    });
    
    // Attach event listeners for Delete buttons
    document.querySelectorAll('.delete-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = parseInt(this.dataset.id);
        deleteWaterTest({ watertestId: id });
      });
    });
  });
}

function addWaterTest() {
  // Simply display the correct div based on pageId
}

function editWaterTest(waterTest) {
  showPage('edit-watertest');
  
  // Store selected ID
  selectedWaterTestID = waterTest.watertestId;

  console.log(waterTest.watertestId);
  console.log(waterTest.waterPumpId);
  console.log(waterTest.equipmentId);
  console.log(waterTest.waterpH);
  console.log(waterTest.arsenic);
  console.log(waterTest.fluoride);
  console.log(waterTest.bacteria);
  console.log(waterTest.testDate);
  
  // Fill form
  document.querySelector("#editWaterTestID").value = waterTest.watertestId;
  document.querySelector("#editTestPumpId").value = waterTest.waterPumpId;
  document.querySelector("#editTestEquipmentId").value = waterTest.equipmentId;
  document.querySelector("#editTestpH").value = waterTest.waterpH;
  document.querySelector("#editTestArsenic").value = waterTest.arsenic;
  document.querySelector("#editTestFluoride").value = waterTest.fluoride;
  document.querySelector("#editTestBacteria").value = waterTest.bacteria;
  document.querySelector("#editTestDate").value = waterTest.testDate;

  // Clear message 
  const output = document.querySelector("#editwatertestoutput");
  output.textContent = "";
  output.className = "message";
}

function deleteWaterTest(waterTest) {
  if (confirm('Are you sure you want to delete this water test?\n\n - Test ID: ' + waterTest.watertestId)) {
    runQuery('DELETE FROM tblwatertest WHERE watertestId = ' + waterTest.watertestId, function(result) {
      console.log(result);
      loadWaterTests();
    });
  };
}

function loadMaintenance() {
  runQuery('SELECT * FROM tblmaintenance', function(json) {
    var tbody = document.getElementById('maintenance-tbody');
    tbody.innerHTML = '';
    for (var i = 0; i < json.data.length; i++) {
      var m = json.data[i];
      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + m.maintenanceId + '</td>' +
        '<td>' + m.waterPumpId + '</td>' +
        '<td>' + m.maintenanceDate  + '</td>' +
        '<td>' + m.workDescription  + '</td>' +
        '<td>' + m.maintenanceStatus + '</td>' +
        '<td>' + m.pumpCondition + '</td>'+
        '<td><button onclick=\'editMaintenance(' + JSON.stringify(m) + ')\'>Edit</button> <button onclick=\'deleteMaintenance(' + JSON.stringify(m) + ')\'>Delete</button></td>';
       tbody.appendChild(row);
    }
  });
}

function addMaintenance() {
  // Simply display the correct div based on pageId
  // <div id="page-add-maintenance" class="page">
}

function editMaintenance(maintenance) {
  showPage('edit-maintenance');
 
  // Store selected ID
  selectedMaintenanceID = maintenance.maintenanceId;

  console.log(maintenance.maintenanceId);
  console.log(maintenance.waterPumpId);
  console.log(maintenance.maintenanceDate);
  console.log(maintenance.workDescription);
  console.log(maintenance.maintenanceStatus);
  console.log(maintenance.pumpCondition);

  var select = 0;

  if(maintenance.maintenaceStatus === 'Completed')
  {
    select = 1;
    document.getElementById("editStatus").selectedIndex === 0;
  }
  else if(maintenance.maintenaceStatus === "Ongoing")
  {
    select = 2;
    document.querySelector("#editStatus").selectedIndex === 1;
  }
  else if(maintenance.maintenaceStatus === "Uncompleted")
  {
    select = 3;
    console.log("Help");
    document.getElementById("editStatus").selectedIndex === 2;
  }

  console.log(select);
  
  // Fill form
  document.querySelector("#editMaintenanceID").value = maintenance.maintenanceId;
  document.querySelector("#editWaterPumpId").value = maintenance.waterPumpId;
  document.querySelector("#editDate").value = maintenance.maintenanceDate;
  document.querySelector("#editDescription").value = maintenance.workDescription;
  //document.querySelector("#editStatus").value = maintenance.maintenanceStatus;
  //document.querySelector("#editCondition").value = maintenance.pumpCondition;

  // Clear message 
  const output = document.querySelector("#editMaintenanceOutput");
  output.textContent = "";
  output.className = "editMaintenanceMessage";
}

function deleteMaintenance(maintenance) {
  if (confirm('Are you sure you want to delete this record:\n\n - maintenanceId: ' + maintenance.maintenanceId + '\n - Water Pump ID: ' + maintenance.waterPumpId + '\n - Date: ' + maintenance.maintenanceDate + '\n - Description: ' + maintenance.workDescription + '\n - Status:' + maintenance.status + '\n - Pump Condition:' + maintenance.pumpCondition)) {
    runQuery('DELETE FROM tblmaintenance WHERE maintenanceId = ' + maintenance.maintenanceId, function(result) {
      console.log(result);
    });
  };
  loadMaintenance();
}


// Load Employees Table
function loadEmployees() {
  runQuery(`SELECT employeeId, forename, surname, DOB, address, email, phone, departmentId, locationId FROM tblemployees`, function (json) {
    var tbody = document.getElementById('employees-tbody');
    tbody.innerHTML = '';
    for (var i = 0; i < json.data.length; i++) {
      var e = json.data[i];
      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + e.employeeId + '</td>' +
        '<td>' + e.forename + ' ' + e.surname + '</td>' +
        '<td>' + e.DOB + '</td>' +
        '<td>' + e.address + '</td>' +
        '<td>' + e.email + '</td>' +
        '<td>' + e.phone + '</td>' +
        '<td>' + e.departmentId + '</td>' +
        '<td>' + e.locationId + '</td>' +
        '<td>' +
        '<button onclick=\'editEmployee(' + JSON.stringify(e) + ')\'>Edit</button> ' +
        '<button onclick=\'deleteEmployee(' + JSON.stringify(e) + ')\'>Delete</button>' +
        '</td>';      
      tbody.appendChild(row);
    }
  });
}

// EDIT EMPLOYEE
let selectedEmployeeId = null;
let selectedEmployeeLocationId = null;
let editEmployeeDepartmentId = null;

function editEmployee(employee) {
  showPage('edit-employee');
  selectedEmployeeId = employee.employeeId;
  selectedEmployeeLocationId = employee.locationId;
  editEmployeeDepartmentId = employee.departmentId;
  document.querySelector("#editEmployeeId").value = employee.employeeId;
  document.querySelector("#editForename").value = employee.forename;
  document.querySelector("#editSurname").value = employee.surname;
  document.querySelector("#editDOB").value = (employee.dob || employee.DOB || "").split(" ")[0];
  document.querySelector("#editAddress").value = employee.address;
  document.querySelector("#editEmail").value = employee.email;
  document.querySelector("#editPhone").value = employee.phone;
  document.querySelector("#editEmployeeDepartmentId").value = employee.departmentId ?? "";
  document.querySelector("#editEmployeeLocationId").value = employee.locationId ?? "";

  const output = document.querySelector("#editEmployeeOutput");
  output.textContent = "";
  output.className = "message";
}


function setEmployeeIdLimits() {
  runQuery("SELECT MAX(departmentId) as maxId FROM tbldepartment", function (json) {
    const maxId = json.data && json.data[0] ? json.data[0].maxId : "";
    const addDept = document.querySelector("#addDepartmentId");
    const editDept = document.querySelector("#editEmployeeDepartmentId");
    if (addDept) addDept.max = maxId;
    if (editDept) editDept.max = maxId;
  });

  runQuery("SELECT MAX(locationId) as maxId FROM tbllocation", function (json) {
    const maxId = json.data && json.data[0] ? json.data[0].maxId : "";
    const addLoc = document.querySelector("#addLocationId");
    const editLoc = document.querySelector("#editEmployeeLocationId");

    if (addLoc) addLoc.max = maxId;
    if (editLoc) editLoc.max = maxId;
  });
}


function deleteEmployee(emp) {
  if (confirm('Are you sure you want to delete this employee:\n\n - employeeId: ' + emp.employeeId + '\n - name: ' + emp.forename + " " + emp.surname)) {
    runQuery('DELETE FROM tblemployees WHERE employeeId = ' + emp.employeeId, function (result) {
      console.log(result);
      loadEmployees();
    });
  }
}

//used when adding a new employee and editing an exitising one
function validateEmployee(employee) {
  // presence checks - name
  if (!employee.forename || !employee.surname) { //name vaidation
    return "Full name is required";
  }

  if (employee.forename.length > 100) {
    return "Forename must be 100 characters or fewer.";
  }

  for (let i = 0; i < employee.forename.length; i++) {
    const char = employee.forename[i];

    const isLetter =
      (char >= 'A' && char <= 'Z') ||
      (char >= 'a' && char <= 'z');

    const isSpace = char === ' ';

    if (!isLetter && !isSpace) {
      return "Forename can only contain letters and spaces.";
    }
  }

  if (employee.surname.length > 100) {
    return "Surname must be 100 characters or fewer.";
  }

  for (let i = 0; i < employee.surname.length; i++) {
    const char = employee.surname[i];

    const isLetter =
      (char >= 'A' && char <= 'Z') ||
      (char >= 'a' && char <= 'z');

    const isSpace = char === ' ';

    if (!isLetter && !isSpace) {
      return "Surname can only contain letters and spaces.";
    }
  }

  // presence checks - date of birth
  if (!employee.dob) {
    return "Date of birth is required";
  }

  // check date of birth is not today or in the future
  const dob = new Date(employee.dob);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dob >= today) {
    return "Date of birth must be in the past";
  }

  // presence checks - address
  if (!employee.address) {
    return "Address is required";
  }


  // presence checks - enail address            
  if (!employee.email) {
    return "Email is required";
  }

  // presence checks - phone number
  if (!employee.phone) {
    return "Phone number is required";
  }

  // presence checks - department and location ids
  const deptId = parseInt(employee.departmentID ?? employee.departmentId);
  const locId = parseInt(employee.locationID ?? employee.locationId);

  if (isNaN(deptId) || isNaN(locId) || deptId <= 0 || locId <= 0) { //if not a number or less than 1, error is thrown
    return "Department ID and Location ID must be valid numbers.";
  }

  //getting the max id for dept and location to validate against the user input before submitting to the database
  const deptMaxInput = document.querySelector("#addDepartmentId") || document.querySelector("#editEmployeeDepartmentId");
  const locMaxInput = document.querySelector("#addLocationId") || document.querySelector("#editEmployeeLocationId");

  if (deptMaxInput && deptMaxInput.max && deptId > parseInt(deptMaxInput.max)) { //if the user input is greater than the max id in the database, error is thrown
    return "Invalid Department ID";
  }

  if (locMaxInput && locMaxInput.max && locId > parseInt(locMaxInput.max)) {
    return "Invalid Location ID";
  }

  return "";
}


function loadDepartments() {
 runQuery('SELECT * FROM tbldepartment', function(json) {
    var tbody = document.getElementById('departments-tbody');
    tbody.innerHTML = '';
    for (var i = 0; i < json.data.length; i++) {
      var d = json.data[i];
      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + d.departmentId + '</td>' +
        '<td>' + d.departmentName + '</td>' +
        '<td>' +
          '<button onclick=\'editDepartment(' + JSON.stringify(d) + ')\'>Edit</button> ' +
          '<button onclick=\'deleteDepartment(' + JSON.stringify(d) + ')\'>Delete</button>' +
        '</td>';
      tbody.appendChild(row);
    }
  });
}

const validateDepartment = (dept) => {
  if (!dept.name || dept.name.trim().length < 2) {
    return "Department name must be at least 2 characters long.";
  }
  if (dept.name.length > 50) {
    return "Department name is too long (max 50 characters).";
  }
  return ""; // Returns an empty string if there are no errors
};

let selectedDepartmentID;
let selectedWaterTestID;

function editDepartment(dept) {
  showPage('edit-department');
  selectedDepartmentID = dept.departmentId;
  document.querySelector("#editDepartmentID").value = dept.departmentId;
  document.querySelector("#editDepartmentName").value = dept.departmentName;
  const output = document.querySelector("#editDeptOutput");
  output.textContent = "";
  output.className = "message";
}

function deleteDepartment(dept) {
  if (confirm('Are you sure you want to delete this department:\n\n - departmentId: ' + dept.departmentId + '\n - name: ' + dept.departmentName)) {
    runQuery('DELETE FROM tbldepartment WHERE departmentId = ' + dept.departmentId, function(result) {
      console.log(result);
      loadDepartments();
    });
  }
}

const validateLocation = (location) => {
      if (!location || typeof location !== "object") {
        return "Location details are required.";
      }

      // Clean up and convert values first so the checks below are easier to write.
      const country = typeof location.country === "string" ? location.country.trim() : "";
      const county = typeof location.county === "string" ? location.county.trim() : "";
      const city = typeof location.city === "string" ? location.city.trim() : "";
      const basinName = typeof location.basinName === "string" ? location.basinName.trim() : "";

      country = country.trim();

      if (!country) {
        return "Country is required.";
      
      }

      if (country.length > 100) {
        return "Country must be 100 characters or fewer.";
      }
      
      // Country can only contain letters and spaces
      for (let i = 0; i < country.length; i++) {
        const char = country[i];

        const isLetter =
          (char >= 'A' && char <= 'Z') ||
          (char >= 'a' && char <= 'z');

        const isSpace = char === ' ';

        if (!isLetter && !isSpace) {
          return "Country can only contain letters and spaces.";
        }
      }

      if (!county) {
        return "County is required.";
      }

      if (county.length > 100) {
        return "County must be 100 characters or fewer.";
      }

      for (let i = 0; i < county.length; i++) {
        const char = county[i];

        const isLetter =
          (char >= 'A' && char <= 'Z') ||
          (char >= 'a' && char <= 'z');

        const isSpace = char === ' ';

        if (!isLetter && !isSpace) {
          return "County can only contain letters and spaces.";
        }
      }
      
      if (!city) {
        return "City is required.";
      }

      if (city.length > 100) {
        return "City must be 100 characters or fewer.";
      }

      for (let i = 0; i < city.length; i++) {
        const char = city[i];

        const isLetter =
          (char >= 'A' && char <= 'Z') ||
          (char >= 'a' && char <= 'z');

        const isSpace = char === ' ';

        if (!isLetter && !isSpace) {
          return "City can only contain letters and spaces.";
        }
      }

      if (!basinName) {
        return "Basin is required.";
      }

      if (basinName.length > 100) {
        return "Basin name must be 100 characters or fewer.";
      }

      for (let i = 0; i < basinName.length; i++) {
        const char = city[i];

        const isLetter =
          (char >= 'A' && char <= 'Z') ||
          (char >= 'a' && char <= 'z');

        const isSpace = char === ' ';

        if (!isLetter && !isSpace) {
          return "Basin name can only contain letters and spaces.";
        }
      }

      return "";
    }

    const validateMaintenance = (maintenance) => {
      if (!maintenance || typeof maintenance !== "object") {
        return "Maintenance details are required.";
      }

      // Clean up and convert values first so the checks below are easier to write.
      const pumpId = Number(maintenance.waterPumpId);
      const date = typeof maintenance.maintenanceDate === "date" ? maintenance.maintenanceDate.trim() : "";
      const description = typeof maintenance.workDescription === "string" ? maintenance.workDescription.trim() : "";
      const status = typeof maintenance.maintenaceStatus === "string" ? maintenance.maintenaceStatus.trim() : "";
      const condition = typeof maintenance.pumpCondition === "string" ? maintenance.pumpCondition.trim() : "";

      if (!Number.isInteger(pumpId) || pumpId < 1) {
        return "Water Pump ID must be a whole number greater than 0.";
      }

      if (document.querySelector("#date").value === "") {
        return "Date is invalid.";
      }
 
      if (document.querySelector("#description").value.trim() === "") {
        return "Work description is required.";
      }

      return "";
    }


     const validateWaterPump = (waterPump) => {
      if (!waterPump || typeof waterPump !== "object") {
        return "Water Pump details are required.";
      }

      // Clean up and convert values first so the checks below are easier to write.
      const locationId = Number(waterPump.locationId);
      const pumpType = typeof waterPump.pumpType === "string" ? waterPump.pumpType.trim() : "";
      const waterQuality = typeof waterPump.waterQuality === "string" ? waterPump.waterQuality.trim() : "";
      const installationDate = typeof waterPump.installationDate === "string" ? waterPump.installationDate.trim() : "";
      const waterOutput = Number(waterPump.waterOutput);

      if (!Number.isInteger(locationId) || locationId < 1) {
        return "Location ID must be a whole number greater than 0.";
      }

      if (document.querySelector("#installDate").value === "") {
        return "Installation Date is required.";
      }
      
      if (!Number.isInteger(waterOutput) || waterOutput < 1) {
        return "Water Quality must be a whole number greater than 0.";
      }

      return "";
    }

    // Replace single quotes with two single quotes so they are safer inside SQL strings.
    // /'/g means "find every single quote in the text" (g = global, so not just the first one).
    const escapeSql = (value) => {
        return value.replace(/'/g, "''");
    }

function employeePumpAssignmentReport() {
  runQuery(`SELECT 
      wp.waterPumpId,
      wp.pumpType,
      l.country,
      l.city,
      COUNT(wpe.employeeId) AS employeeCount,
      GROUP_CONCAT(CONCAT(e.forename, ' ', e.surname) SEPARATOR ', ') AS employees
    FROM tblwaterpump wp
    JOIN tbllocation l ON wp.locationId = l.locationId
    LEFT JOIN tblwaterpumpsemployees wpe ON wp.waterPumpId = wpe.waterPumpId
    LEFT JOIN tblemployees e ON wpe.employeeId = e.employeeId
    GROUP BY wp.waterPumpId, wp.pumpType, l.country, l.city
    ORDER BY employeeCount DESC
    LIMIT 50
  `, function(json) {
    var tbody = document.getElementById('employee-pump-assignment-tbody');
    tbody.innerHTML = '';
    if (!json || !json.data || json.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No data found</td></tr>';
      return;
    }

    employeePumpData = json.data;

    populatePumpAssignmentFilters(employeePumpData);
    renderPumpAssignmentTable(employeePumpData);
  });
}

function populatePumpAssignmentFilters(data) {
  var pumpTypes = new Set();
  var countries = new Set();
  var cities = new Set();

  data.forEach(function(row) {
    if (row.pumpType) pumpTypes.add(row.pumpType);
    if (row.country) countries.add(row.country);
    if (row.city) cities.add(row.city);
  });

  fillPumpAssignmentSelect('filter-pumpType', pumpTypes);
  fillPumpAssignmentSelect('filter-country', countries);
  fillPumpAssignmentSelect('filter-city', cities);
}

function fillPumpAssignmentSelect(id, values) {
  var select = document.getElementById(id);

  // reset but keep "All"
  select.innerHTML = '<option value="">All</option>';

  values.forEach(function(val) {
    var option = document.createElement('option');
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
}

function renderPumpAssignmentTable(data) {
  var tbody = document.getElementById('employee-pump-assignment-tbody');
  tbody.innerHTML = '';

  data.forEach(function(l) {
    var row = document.createElement('tr');

    row.innerHTML =
      '<td>' + l.waterPumpId + '</td>' +
      '<td>' + (l.pumpType || '') + '</td>' +
      '<td>' + (l.country || '') + '</td>' +
      '<td>' + (l.city || '') + '</td>' +
      '<td>' + (l.employeeCount || 0) + '</td>' +
      '<td>' + (l.employees ? l.employees.split(', ').join('<br>') : 'None') + '</td>';

    tbody.appendChild(row);
  });
}

function filterPumpAssignmentTable() {
  var pumpType = document.getElementById('filter-pumpType').value;
  var country = document.getElementById('filter-country').value;
  var city = document.getElementById('filter-city').value;

  var filtered = employeePumpData.filter(function(row) {

    if (pumpType && row.pumpType !== pumpType) return false;
    if (country && row.country !== country) return false;
    if (city && row.city !== city) return false;

    return true;
  });

  renderPumpAssignmentTable(filtered);
}

var mostWaterTestsReportData = [];

function mostWaterTestsReport() {
  var selectPumpType = document.getElementById('filter-most-water-tests-pump-type');
  var selectCountry = document.getElementById('filter-most-water-tests-country');
  var selectCity = document.getElementById('filter-most-water-tests-city');
  selectPumpType.innerHTML = '<option value="">All Pump Types</option>';
  selectCountry.innerHTML = '<option value="">All Countries</option>';
  selectCity.innerHTML = '<option value="">All Cities</option>';
  
  var sql = 'SELECT wp.waterPumpId, wp.pumpType, l.country, l.city, COUNT(wt.watertestId) AS \'testCount\', MIN(wt.testDate) AS \'firstTest\', MAX(wt.testDate) AS \'latestTest\' FROM tblwaterpump wp JOIN tbllocation l ON wp.locationId = l.locationId LEFT JOIN tblwatertest wt ON wp.waterPumpId = wt.waterPumpId GROUP BY wp.waterPumpId, wp.pumpType, l.country, l.city ORDER BY COUNT(wt.watertestId) DESC LIMIT 20';
  runQuery(sql, function(json) {
    var tbody = document.getElementById('report-most-water-tests-tbody');
    if (!json.data || json.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">No data found</td></tr>';
      return;
    }
    mostWaterTestsReportData = json.data;
    var pumpTypes = [];
    json.data.forEach(function(row) {
      if (pumpTypes.indexOf(row.pumpType) === -1) pumpTypes.push(row.pumpType);
    });
    pumpTypes.forEach(function(p) {
      selectPumpType.innerHTML += '<option value="' + p + '">' + p + '</option>';
    });
    var countries = [];
    json.data.forEach(function(row) {
      if (countries.indexOf(row.country) === -1) countries.push(row.country);
    });
    countries.forEach(function(co) {
      selectCountry.innerHTML += '<option value="' + co + '">' + co + '</option>';
    });
    var cities = [];
    json.data.forEach(function(row) {
      if (cities.indexOf(row.city) === -1) cities.push(row.city);
    });
    cities.forEach(function(ci) {
      selectCity.innerHTML += '<option value="' + ci + '">' + ci + '</option>';
    });
    renderMostWaterTestsReport(mostWaterTestsReportData);
  });
}

function renderMostWaterTestsReport(data) {
  var tbody = document.getElementById('report-most-water-tests-tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No data found for selected filter</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(function(row) {
    return '<tr><td>' + row.pumpType + '</td><td>' + row.country + '</td><td>' + row.city + '</td><td>' + row.testCount + '</td><td>' + row.firstTest + '</td><td>' + row.latestTest + '</td></tr>';
  }).join('');
}

function filterMostWaterTestsReport(select) {
  var pumpType = document.getElementById('filter-most-water-tests-pump-type').value;
  var country = document.getElementById('filter-most-water-tests-country').value;
  var city = document.getElementById('filter-most-water-tests-city').value;

  var filtered = mostWaterTestsReportData.filter(function(row) {
    return (!pumpType || row.pumpType === pumpType) &&
           (!country || row.country === country) &&
           (!city || row.city === city);
  });

  renderMostWaterTestsReport(filtered);
}

// --- REPORT 1: Regional Maintenance Prioritization ---
var maintenanceReportData = [];

function loadMaintenanceReport() {
  var select = document.getElementById('filter-maintenance-country');
  select.innerHTML = '<option value="">All Countries</option>';
  var sql = 'SELECT l.country, l.city, ' +
          'COUNT(wp.waterPumpId) AS low_condition_count, ' +
          'MAX(m.maintenanceDate) AS last_maintenance_performed ' +
          'FROM tbllocation l ' +
          'INNER JOIN tblwaterpump wp ON l.locationId = wp.locationId ' +
          'LEFT JOIN tblmaintenance m ON wp.waterPumpId = m.waterPumpId ' +
          'WHERE wp.waterQuality = \'Low\' ' +
          'GROUP BY l.country, l.city ' +
          'ORDER BY low_condition_count DESC';
  runQuery(sql, function(json) {
    var tbody = document.getElementById('report-maintenance-tbody');
    if (!json.data || json.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">No data found</td></tr>';
      return;
    }
    maintenanceReportData = json.data;
    var countries = [];
    json.data.forEach(function(row) {
      if (countries.indexOf(row.country) === -1) countries.push(row.country);
    });
    countries.forEach(function(c) {
      select.innerHTML += '<option value="' + c + '">' + c + '</option>';
    });
    renderMaintenanceReport(maintenanceReportData);
  });
}

function renderMaintenanceReport(data) {
  var tbody = document.getElementById('report-maintenance-tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No data found for selected filter</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(function(row) {
    return '<tr><td>' + row.country + '</td><td>' + row.city + '</td><td>' + row.low_condition_count + '</td><td>' + (row.last_maintenance_performed || 'No record') + '</td></tr>';
  }).join('');
}

function filterMaintenanceReport() {
  var country = document.getElementById('filter-maintenance-country').value;
  var filtered = maintenanceReportData.filter(function(row) {
    return !country || row.country === country;
  });
  renderMaintenanceReport(filtered);
}

// --- REPORT 2: Staff Workload Distribution ---
var workloadReportData = [];

function loadWorkloadReport() {
  var select = document.getElementById('filter-workload-department');
  select.innerHTML = '<option value="">All Departments</option>';
  var sql = 'SELECT CONCAT(e.forename, " ", e.surname) AS employee_full_name, ' +
          'd.departmentName, ' +
          'COUNT(wpe.waterPumpId) AS total_assigned_pumps ' +
          'FROM tblemployees e ' +
          'INNER JOIN tbldepartment d ON e.departmentId = d.departmentId ' +
          'INNER JOIN tblwaterpumpsemployees wpe ON e.employeeId = wpe.employeeId ' +
          'GROUP BY e.employeeId, d.departmentName ' +
          'HAVING total_assigned_pumps > 3 ' +
          'ORDER BY total_assigned_pumps DESC';
  runQuery(sql, function(json) {
    var tbody = document.getElementById('report-workload-tbody');
    if (!json.data || json.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">No data found</td></tr>';
      return;
    }
    workloadReportData = json.data;
    var depts = [];
    json.data.forEach(function(row) {
      if (depts.indexOf(row.departmentName) === -1) depts.push(row.departmentName);
    });
    depts.forEach(function(d) {
      select.innerHTML += '<option value="' + d + '">' + d + '</option>';
    });
    renderWorkloadReport(workloadReportData);
  });
}

function renderWorkloadReport(data) {
  var tbody = document.getElementById('report-workload-tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3">No data found for selected filter</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(function(row) {
    return '<tr><td>' + row.employee_full_name + '</td><td>' + row.departmentName + '</td><td>' + row.total_assigned_pumps + '</td></tr>';
  }).join('');
}

function filterWorkloadReport() {
  var dept = document.getElementById('filter-workload-department').value;
  var filtered = workloadReportData.filter(function(row) {
    return !dept || row.departmentName === dept;
  });
  renderWorkloadReport(filtered);
}

// --- REPORT 3: High-Risk Basin Contamination ---
var contaminationReportData = [];

function loadContaminationReport() {
  var select = document.getElementById('filter-contamination-basin');
  select.innerHTML = '<option value="">All Basins (Top 10)</option>';

  var sql = 'SELECT l.basinName, ROUND(AVG(wt.arsenic), 4) AS avg_arsenic, ROUND(AVG(wt.fluoride), 4) AS avg_fluoride, COUNT(wt.watertestId) AS total_tests ' +
            'FROM tblwatertest wt ' +
            'JOIN tblwaterpump wp ON wt.waterPumpId = wp.waterPumpId ' +
            'JOIN tbllocation l ON wp.locationId = l.locationId ' +
            'GROUP BY l.basinName ' +
            'ORDER BY avg_arsenic DESC ' +
            'LIMIT 10';

  runQuery(sql, function (json) {
    var tbody = document.getElementById('report-contamination-tbody');
    if (!json.data || json.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">No data found</td></tr>';
      return;
    }
    contaminationReportData = json.data;
    json.data.forEach(function (row) {
      select.innerHTML += '<option value="' + row.basinName + '">' + row.basinName + '</option>';
    });
    renderContaminationReport(contaminationReportData);
  });
}
function renderContaminationReport(data) {
  var tbody = document.getElementById('report-contamination-tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No data found for selected filter</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(function (row) {
    return '<tr><td>' + row.basinName + '</td><td>' + row.avg_arsenic + '</td><td>' + row.avg_fluoride + '</td><td>' + row.total_tests + '</td></tr>';
  }).join('');
}
function filterContaminationReport() {
  var basin = document.getElementById('filter-contamination-basin').value;
  if (!basin) {
    renderContaminationReport(contaminationReportData);
    return;
  }
  var filtered = contaminationReportData.filter(function(row) {
    return row.basinName === basin;
  });
  renderContaminationReport(filtered);
}

// --- Employee Maintenance Assignment ---
function employeeMainAssignmentReport() {
  runQuery(`SELECT 
      m.maintenanceId,
      m.waterPumpId,
      l.country,
      l.city,
      m.workDescription,
      COUNT(me.employeeId) AS employeeCount,
      GROUP_CONCAT(CONCAT(e.forename, ' ', e.surname) SEPARATOR ', ') AS employees
    FROM tblmaintenance m
    JOIN tblwaterpump wp ON wp.waterPumpId = m.waterPumpId
    JOIN tbllocation l ON wp.locationId = l.locationId
    LEFT JOIN tblmaintenanceemployees me ON m.maintenanceId = me.maintenanceId
    LEFT JOIN tblemployees e ON me.employeeId = e.employeeId
    GROUP BY m.maintenanceId, m.waterPumpId, l.country, l.city
    ORDER BY employeeCount DESC
    LIMIT 50
  `, function(json) {
    var tbody = document.getElementById('employee-main-assignment-tbody');
    tbody.innerHTML = '';
    if (!json || !json.data || json.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No data found</td></tr>';
      return;
    }

    employeeMainData = json.data;

    populateMainAssignmentFilters(employeeMainData);
    renderMainAssignmentTable(employeeMainData);
  });
}

function populateMainAssignmentFilters(data) {
  var countries = new Set();
  var cities = new Set();

  data.forEach(function(row) {
    if (row.country) countries.add(row.country);
    if (row.city) cities.add(row.city);
  });

  fillMainAssignmentSelect('filter-main-country', countries);
  fillMainAssignmentSelect('filter-main-city', cities);
}

function fillMainAssignmentSelect(id, values) {
  var select = document.getElementById(id);

  // reset but keep "All"
  select.innerHTML = '<option value="">All</option>';

  values.forEach(function(val) {
    var option = document.createElement('option');
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
}

function renderMainAssignmentTable(data) {
  var tbody = document.getElementById('employee-main-assignment-tbody');
  tbody.innerHTML = '';

  data.forEach(function(l) {
    var row = document.createElement('tr');

    row.innerHTML =
      '<td>' + l.maintenanceId + '</td>' +
      '<td>' + l.waterPumpId + '</td>' +
      '<td>' + (l.country || '') + '</td>' +
      '<td>' + (l.city || '') + '</td>' +
      '<td>' + (l.workDescription || '') + '</td>' +
      '<td>' + (l.employeeCount || 0) + '</td>' +
      '<td>' + (l.employees ? l.employees.split(', ').join('<br>') : 'None') + '</td>';

    tbody.appendChild(row);
  });
}

function filterMainAssignmentTable() {
  var country = document.getElementById('filter-main-country').value;
  var city = document.getElementById('filter-main-city').value;

  var filtered = employeeMainData.filter(function(row) {

    if (country && row.country !== country) return false;
    if (city && row.city !== city) return false;

    return true;
  });

  renderMainAssignmentTable(filtered);
}

// --- Uncompleted / Ongoing Maintenance Report
function uncompletedMaintenanceReport() {
  runQuery(`SELECT 
    l.country, 
    l.city, 
    COUNT(m.maintenanceStatus) AS Num 
FROM tblmaintenance m 
JOIN tblwaterpump wp ON wp.waterPumpId = m.waterPumpId 
JOIN tbllocation l ON l.locationId = wp.waterPumpId 
WHERE (m.maintenanceStatus = 'Ongoing' OR m.maintenanceStatus = 'Uncompleted') AND DATEDIFF(CURRENT_DATE(),m.maintenanceDate)> 30
GROUP By l.country, l.city 
ORDER BY Num DESC
  `, function(json) {
    var tbody = document.getElementById('report-uncompleted-maintenance-tbody');
    tbody.innerHTML = '';
    if (!json || !json.data || json.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No data found</td></tr>';
      return;
    }

    uncompletedMainData = json.data;

    populateUncompletedMainFilters(uncompletedMainData);
    renderUncompletedMainTable(uncompletedMainData);
  });
}

function populateUncompletedMainFilters(data) {
  var countries = new Set();
  var cities = new Set();

  data.forEach(function(row) {
    if (row.country) countries.add(row.country);
    if (row.city) cities.add(row.city);
  });

  fillUncompletedMainSelect('filter-unc-main-country', countries);
  fillUncompletedMainSelect('filter-unc-main-city', cities);
}

function fillUncompletedMainSelect(id, values) {
  var select = document.getElementById(id);

  // reset but keep "All"
  select.innerHTML = '<option value="">All</option>';

  values.forEach(function(val) {
    var option = document.createElement('option');
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
}

function renderUncompletedMainTable(data) {
  var tbody = document.getElementById('report-uncompleted-maintenance-tbody');
  tbody.innerHTML = '';

  data.forEach(function(l) {
    var row = document.createElement('tr');

    row.innerHTML =
      '<td>' + (l.country || '') + '</td>' +
      '<td>' + (l.city || '') + '</td>' +
      '<td>' + (l.Num || 0) + '</td>';

    tbody.appendChild(row);
  });
}

function filterUncompletedMainTable() {
  var country = document.getElementById('filter-unc-main-country').value;
  var city = document.getElementById('filter-unc-main-city').value;

  var filtered = uncompletedMainData.filter(function(row) {

    if (country && row.country !== country) return false;
    if (city && row.city !== city) return false;

    return true;
  });

  renderUncompletedMainTable(filtered);
}

// --- Installed Water Pump Report
function installedPumpsReport() {
  runQuery(`SELECT 
    l.country, 
    l.city, 
    wp.pumpType, 
    COUNT(wp.pumpType) AS Num
FROM tblwaterpump wp
JOIN tbllocation l ON wp.locationId = l.locationId
WHERE DATEDIFF(CURRENT_DATE, wp.installationDate)<365
GROUP BY l.country, l.city, wp.PumpType
ORDER BY Num DESC
  `, function(json) {
    var tbody = document.getElementById('report-installed-waterpumps-tbody');
    tbody.innerHTML = '';
    if (!json || !json.data || json.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No data found</td></tr>';
      return;
    }

    installedPumpsData = json.data;

    populateInstalledPumpsFilters(installedPumpsData);
    renderInstalledPumpsTable(installedPumpsData);
  });
}

function populateInstalledPumpsFilters(data) {
  var countries = new Set();
  var cities = new Set();
  var pumpTypes = new Set();

  data.forEach(function(row) {
    if (row.country) countries.add(row.country);
    if (row.city) cities.add(row.city);
    if (row.pumpType) pumpTypes.add(row.pumpType);
  });

  fillInstalledPumpsSelect('filter-installed-country', countries);
  fillInstalledPumpsSelect('filter-installed-city', cities);
  fillInstalledPumpsSelect('filter-installed-pump-type', pumpTypes);
}

function fillInstalledPumpsSelect(id, values) {
  var select = document.getElementById(id);

  // reset but keep "All"
  select.innerHTML = '<option value="">All</option>';

  values.forEach(function(val) {
    var option = document.createElement('option');
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
}

function renderInstalledPumpsTable(data) {
  var tbody = document.getElementById('report-installed-waterpumps-tbody');
  tbody.innerHTML = '';

  data.forEach(function(l) {
    var row = document.createElement('tr');

    row.innerHTML =
      '<td>' + (l.country || '') + '</td>' +
      '<td>' + (l.city || '') + '</td>' +
      '<td>' + (l.pumpType || '') + '</td>' +
      '<td>' + (l.Num || 0) + '</td>';

    tbody.appendChild(row);
  });
}

function filterInstalledPumpsTable() {
  var pumpType = document.getElementById('filter-installed-pump-type').value;
  var country = document.getElementById('filter-installed-country').value;
  var city = document.getElementById('filter-installed-city').value;

  var filtered = installedPumpsData.filter(function(row) {

    if (pumpType && row.pumpType !== pumpType) return false;
    if (country && row.country !== country) return false;
    if (city && row.city !== city) return false;

    return true;
  });

  renderInstalledPumpsTable(filtered);
}


function loadMaintenanceCountries() {
  var sql = "SELECT DISTINCT country FROM tbllocation ORDER BY country";

  runQuery(sql, function (json) {
    if (!json || !json.data) return;

    var dropdown = document.getElementById("filter-maintenance-country");

    json.data.forEach(row => {
      var option = document.createElement("option");
      option.value = row.country;
      option.textContent = row.country;
      dropdown.appendChild(option);
    });
  });
}

var maintenanceHistoryData = [];
function loadMaintenanceHistoryReport() {
  const select = document.getElementById('filter-maintenance-history-country');
  const tbody = document.getElementById('report-maintenance-history-tbody');

  select.innerHTML = '<option value="">All Countries</option>';
  tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading...</td></tr>';

  var sql = `SELECT wp.waterPumpId, 
       l.country, 
       l.city, 
       wp.pumpType, 
       wp.installationDate 
FROM tblwaterpump wp 
JOIN tbllocation l ON wp.locationId = l.locationId 
WHERE wp.waterPumpId NOT IN (
  SELECT waterPumpId FROM tblmaintenance WHERE waterPumpId IS NOT NULL
)`;

  runQuery(sql, function (json) {
    console.log(json);

    if (json && json.error) {
      document.getElementById('report-maintenance-history-tbody').innerHTML =
        '<tr><td colspan="5">SQL error: ' + json.error + '</td></tr>';
      return;
    }

    if (!json || !json.data || json.data.length === 0) {
      document.getElementById('report-maintenance-history-tbody').innerHTML =
        '<tr><td colspan="5">No data found</td></tr>';
      return;
    }

    maintenanceHistoryData = json.data;

    const countries = new Set(json.data.map(row => row.country).filter(Boolean));
    countries.forEach(c => {
      const option = document.createElement('option');
      option.value = c;
      option.textContent = c;
      select.appendChild(option);
    });
    renderMaintenanceHistoryReport(maintenanceHistoryData);
  });
}

function renderMaintenanceHistoryReport(data) {
  var tbody = document.getElementById('report-maintenance-history-tbody');
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No data found for selected filter</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(function (row) {
    return '<tr><td>' + row.waterPumpId + '</td><td>' + row.country + '</td><td>' + row.city + '</td><td>' + row.pumpType + '</td><td>' + row.installationDate + '</td></tr>';
  }).join('');
}

function filterMaintenanceHistoryReport() {
  var country = document.getElementById('filter-maintenance-history-country').value;
  var filtered = maintenanceHistoryData.filter(function (row) {
    return !country || row.country === country;
  });
  renderMaintenanceHistoryReport(filtered);
}


function loadMaintenanceReliability() {
  runQuery(`SELECT 
    l.country,
    CASE 
        WHEN DATEDIFF(CURDATE(), rm.lastMaint) <= 180 THEN 'Recently Maintained'
        ELSE 'Not Recently Maintained'
    END AS maint_status,
    ROUND(AVG(wt.bacteria), 2) AS bacteria,
    ROUND(AVG(wt.arsenic), 2) AS arsenic,
    ROUND(AVG(wt.fluoride), 2) AS fluoride,
    COUNT(DISTINCT wp.waterPumpId) AS pump_count
FROM tblwaterpump wp
JOIN tbllocation l ON l.locationId = wp.locationId
LEFT JOIN (
    SELECT waterPumpId, MAX(maintenanceDate) AS lastMaint
    FROM tblmaintenance
    GROUP BY waterPumpId
) rm ON rm.waterPumpId = wp.waterPumpId
LEFT JOIN tblwatertest wt ON wt.waterPumpId = wp.waterPumpId
WHERE wt.waterPumpId IS NOT NULL
GROUP BY l.country, maint_status
ORDER BY l.country, maint_status`, function(json) {
    var tbody = document.getElementById('maintenance-reliability-tbody');
    tbody.innerHTML = '';

    console.log('maintenance reliability responce:', json);

    if (!json) {
      console.error('No response from server');
      tbody.innerHTML = '<tr><td colspan="5">Error: No response from server</td></tr>';
      return;
    }
    
    if (json.error) {
      console.error('Database error:', json.error);
      tbody.innerHTML = '<tr><td colspan="5">Error: ' + json.error + '</td></tr>';
      return;
    }
    
    let rows = [];

    // Handle different possible backend response formats
    if (Array.isArray(json)) {
      rows = json;
    } 
    else if (json && Array.isArray(json.data)) {
      rows = json.data;
    } 
    else {
      console.warn("Unexpected response format:", json);
      tbody.innerHTML = '<tr><td colspan="6">No data available (bad format)</td></tr>';
      return;
    }

    // If empty array
    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No data available</td></tr>';
      return;
    }
    
    console.log('Found ' + json.data.length + ' records');

    json.data.forEach(row => {
      var tr = document.createElement('tr');

      tr.innerHTML =
        '<td>' + row.country + '</td>' +
        '<td>' + row.maint_status + '</td>' +
        '<td>' + (row.bacteria ?? '-') + '</td>' +
        '<td>' + (row.arsenic ?? '-') + '</td>' +
        '<td>' + (row.fluoride ?? '-') + '</td>' +
        '<td>' + row.pump_count + '</td>';

      tbody.appendChild(tr);
    });
  });
}



function loadHighMaintenancePumps() {
  runQuery(`SELECT 
      wp.waterPumpId,
      l.country,
      l.city,
      COUNT(m.maintenanceId) AS maintenanceEvents,
      ROUND(
        DATEDIFF(
          MAX(m.maintenanceDate),
          MIN(m.maintenanceDate)
        ) / NULLIF(COUNT(m.maintenanceId) - 1, 0),
        1
      ) AS avgDaysBetweenMaintenance
  FROM tblwaterpump wp
  JOIN tbllocation l ON l.locationId = wp.locationId
  LEFT JOIN tblmaintenance m ON wp.waterPumpId = m.waterPumpId
  GROUP BY wp.waterPumpId, l.country, l.city
  HAVING COUNT(m.maintenanceId) > 1
  ORDER BY avgDaysBetweenMaintenance ASC, maintenanceEvents DESC
  LIMIT 20`, function(json) {
    var tbody = document.getElementById('high-maintenance-tbody');
    tbody.innerHTML = '';
    
    //logging the full response for debugging
    console.log('High Maintenance Pumps Response:', json);
    
    if (!json) {
      console.error('No response from server');
      tbody.innerHTML = '<tr><td colspan="5">Error: No response from server</td></tr>';
      return;
    }
    
    if (json.error) {
      console.error('Database error:', json.error);
      tbody.innerHTML = '<tr><td colspan="5">Error: ' + json.error + '</td></tr>';
      return;
    }
    
    if (!json.data) {
      console.warn('No data property in response. Response keys:', Object.keys(json));
      tbody.innerHTML = '<tr><td colspan="5">No data available (invalid response format)</td></tr>';
      return;
    }
    
    if (json.data.length === 0) {
      console.warn('Data array is empty - possibly no pumps with multiple maintenance records');
      tbody.innerHTML = '<tr><td colspan="5">No pumps found with multiple maintenance records</td></tr>';
      return;
    }
    
    console.log('Found ' + json.data.length + ' records');
    
    for (var i = 0; i < json.data.length; i++) {
      var p = json.data[i];
      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + p.waterPumpId + '</td>' +
        '<td>' + (p.country || '') + '</td>' +
        '<td>' + (p.city || '') + '</td>' +
        '<td>' + (p.avgDaysBetweenMaintenance || 'N/A') + '</td>' +
        '<td>' + (p.maintenanceEvents || 0) + '</td>';
      tbody.appendChild(row);
    }
  });
}

function loadWaterQualityConsistency() {
  runQuery(`SELECT 
      l.country AS label,
      ROUND(STDDEV(wt.arsenic), 2) AS arsenic_sd,
      ROUND(STDDEV(wt.fluoride), 2) AS fluoride_sd,
      ROUND(STDDEV(wt.bacteria), 2) AS bacteria_sd,
      ROUND(
          (STDDEV(wt.arsenic) + STDDEV(wt.fluoride) + STDDEV(wt.bacteria)) / 3,
          2
      ) AS value
  FROM tblwatertest wt
  JOIN tblwaterpump wp ON wp.waterPumpId = wt.waterPumpId
  JOIN tbllocation l ON l.locationId = wp.locationId
  GROUP BY l.country
  ORDER BY value DESC`, function(json) {
    if (!json || !json.data) return;

    const labels = [];
    const data = [];

    json.data.forEach(row => {
      labels.push(row.label);
      data.push(row.value);
    });

    const ctx = document.getElementById("waterQualityConsistencyChart");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Water Quality Variability",
          data: data,
          backgroundColor: "#d62828"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
}
