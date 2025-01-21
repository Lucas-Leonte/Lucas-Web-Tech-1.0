<?php
require_once 'startup.php';

// Visualizza i dati del budget dell'utente
if ($_POST["action"] == 1) {
    $result = $db->GetUserBudgetDetails();
}
// Carica soldi dal conto dell'utente sul wallet del sito
if ($_POST["action"] == 2) {
    $result = $db->ChargeUserWallet($_POST["Money"]);
}
// Preleva soldi dal wallet del sito sul conto dell'utente
if ($_POST["action"] == 3) {
    $result = $db->WithdrawUserWallet($_POST["Money"]);;
}

header('Content-Type: application/json');
echo json_encode($result);
?>