<?php
// ============================================================
// Database Configuration — XAMPP MySQL
// ============================================================
// Update these values if your XAMPP setup uses different
// credentials. Default XAMPP has no root password.
// ============================================================

define('DB_HOST', '127.0.0.1');
define('DB_PORT', 3306);
define('DB_USER', 'root');
define('DB_PASS', '');           // XAMPP default: empty password
define('DB_NAME', 'sdg6_water');

/**
 * Create and return a MySQLi connection to the sdg6_water database.
 *
 * @return mysqli
 */
function getDbConnection(): mysqli
{
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error . "\n"
          . "Make sure XAMPP MySQL is running and that you have created the database:\n"
          . "  mysql -u root < sql/schema.sql\n");
    }

    // Use UTF-8 for proper character handling
    $conn->set_charset('utf8mb4');

    return $conn;
}
