<?php
require_once 'startup.php';

// Visualizza
if ($_POST["action"] == 1) {
    $result = $db->GetUserCartProducts();
    for($i = 0; $i < count($result); $i++){
        $result[$i]["ImageName"] = UPLOAD_DIR.$result[$i]["ImageName"];
    }
}
// Aumenta quantita'
if ($_POST["action"] == 2) {
    $result = $db->IncreaseUserCartProduct($_POST["productId"]);
}
// Diminuisci quantita'
if ($_POST["action"] == 3) {
    $result = $db->DecreaseUserCartProduct($_POST["productId"]);
}
// Acquista
if ($_POST["action"] == 4) {
    $result = $db->CheckoutUserCart();
}

header('Content-Type: application/json');
echo json_encode($result);
?>