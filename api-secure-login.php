<?php
require_once 'startup.php';

$result["success"] = false;

if (isset($_POST["email"]) && isset($_POST["password"])) {
    $checkLoginResult = $db->SecureLogin($_POST["email"], $_POST["password"]);

    if ($checkLoginResult) {
        $result["success"] = true;
    }
}
<<<<<<< HEAD
//test git Lucas conflitto
=======
//test di git
>>>>>>> 4875aec31c57800629e32def243b81ffc69338dd

header('Content-Type: application/json');
echo json_encode($result);
?>