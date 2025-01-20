<?php
require_once 'startup.php';

if (isset($_POST["email"]) && isset($_POST["password"])) {
    $result = $db->SecureLogin($_POST["email"], $_POST["password"]);
}

header('Content-Type: application/json');
echo json_encode($result);
?>