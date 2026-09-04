# AquaTrack – SDG 6 Water Pump Database

AquaTrack is a water pump management dashboard supporting UN SDG Goal 6: Clean Water and Sanitation.  
Developed as part of a group project for the BEng Software Engineering Data Driven Systems module, the system connects a web front-end to a relational database, using a provided `dbConnector.php` script to handle data processing and interactive visualization.

## Key Features

- **Interactive Dashboard** – Visualizes average water quality metrics, maintenance statuses, and top employee workload distributions using Chart.js.
- **Data Management** – Full create, read, update, and delete (CRUD) operations for water pumps, locations, water tests, maintenance records, employees, and departments.
- **Analytics & Reporting** – Dynamically generates filtered reports covering high-risk basin contamination, uncompleted maintenance, and regional maintenance prioritization.

## Repository Structure

- `sdg6-database` – Contains the SQL script (`schema.sql`) to build the database structure, and a PHP script (`generate_synthetic_data.php`) to populate it with randomized synthetic data.
- `sdg6-website` – Contains the website's HTML, CSS, and JavaScript files, which must be served from the XAMPP `htdocs` folder to operate correctly.

## Setup and Installation

1. Install and launch XAMPP, ensuring both the Apache and MySQL modules are actively running.
2. Open your terminal, navigate to the correct directory, and run the following command to create the database:
   ```
   /c/xampp/mysql/bin/mysql -u root < sdg6-database/sql/schema.sql
   ```
3. Run the following command to populate the database with synthetic data (note: data generation is random, so specific query results will vary):
   ```
   /c/xampp/php/php sdg6-database/php/generate_synthetic_data.php
   ```
4. Move or copy the entire `sdg6-website` folder into your XAMPP `htdocs` directory. If you edit the files in your code editor, you'll need to copy the updated files to `htdocs` again for the changes to appear in the browser.

## Usage

Once the database has been created and the frontend files are in place in the `htdocs` directory, you can view the dashboard by navigating to:

```
http://localhost/sdg6-website/index.html
```

in your preferred web browser.
