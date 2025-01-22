<?php
    require_once 'startup.php';

    $result = $db->AddSellerItem($_POST['name'], $_POST['price'], $_POST['file']);

    header('Content-Type: application/json');
    echo json_encode($result)


?>