<?php
require_once 'startup.php';

// Visualizza
if ($_POST["action"] == 1) {
    $result = $db->GetProductDetails($_POST["ProductId"]);
    $result["ImageName"] = UPLOAD_DIR.$result["ImageName"];
}
// Aggiungi al carrello
if ($_POST["action"] == 2) {
    $result = $db->AddProductToCart($_POST["ProductId"]);
}

header('Content-Type: application/json');
echo json_encode($result);
?>