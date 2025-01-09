<?php
require_once 'startup.php';

$products = $db->GetUserCartProducts();

for($i = 0; $i < count($products); $i++){
    $products[$i]["ImageName"] = UPLOAD_DIR.$products[$i]["ImageName"];
}

header('Content-Type: application/json');
echo json_encode($products);
?>