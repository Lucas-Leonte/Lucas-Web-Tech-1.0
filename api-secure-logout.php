<?php
require_once 'startup.php';

$result = $db->SecureLogout();

header('Content-Type: application/json');
echo json_encode($result);
?>