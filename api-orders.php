<?php
require_once 'startup.php';

// Visualizza tutti gli ordini
if ($_POST["action"] == 1) {
    $result = $db->GetAllOrders();
}
// Visualizza gli ordini dell'utente
if ($_POST["action"] == 2) {
    $result = $db->GetUserOrders();
}
// Visualizza i dettagli degli ordini
if ($_POST["action"] == 3) {
    $result = $db->GetOrderDetails($_POST["OrderId"]);
}

header('Content-Type: application/json');
echo json_encode($result);
?>