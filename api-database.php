<?php
class DatabaseAPI {
    private $db;

    public function __construct($servername, $username, $password, $dbname, $port) {
        $this->db = new mysqli($servername, $username, $password, $dbname, $port);
        if ($this->db->connect_error) {
            die("Connection failed: " . $this->db->connect_error);
        }        
    }

    public function SecureLogin($email, $password){
        $stmt = $this->db->prepare("SELECT UserId, Email, Password, PasswordSalt FROM users WHERE Email = ? LIMIT 1");
        $stmt->bind_param('s', $email); // esegue il bind del parametro '$email'.
        $stmt->execute(); // esegue la query appena creata.
        $stmt->store_result();
        $stmt->bind_result($user_id, $username, $db_password, $salt); // recupera il risultato della query e lo memorizza nelle relative variabili.
        $stmt->fetch();
        $password = hash('sha512', $password.$salt); // codifica la password usando una chiave univoca.

        if($stmt->num_rows == 1) { // se l'utente esiste
            // verifichiamo che non sia disabilitato in seguito all'esecuzione di troppi tentativi di accesso errati.
            if(false) { //checkbrute($user_id, $mysqli) == true) { 
                // Account disabilitato
                // Invia un e-mail all'utente avvisandolo che il suo account è stato disabilitato.
                return false;
            } else {
                if($db_password == $password) { // Verifica che la password memorizzata nel database corrisponda alla password fornita dall'utente.
                // Password corretta!            
                    $user_browser = $_SERVER['HTTP_USER_AGENT']; // Recupero il parametro 'user-agent' relativo all'utente corrente.
    
                    $user_id = preg_replace("/[^0-9]+/", "", $user_id); // ci proteggiamo da un attacco XSS
                    $_SESSION['user_id'] = $user_id; 
                    $username = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $username); // ci proteggiamo da un attacco XSS
                    $_SESSION['email'] = $email;
                    $_SESSION['login_string'] = hash('sha512', $password.$user_browser);
                    // Login eseguito con successo.
                    return true;    
                } else {
                    // Password incorretta.
                    // Registriamo il tentativo fallito nel database.
                    $now = time();
                    // $mysqli->query("INSERT INTO login_attempts (user_id, time) VALUES ('$user_id', '$now')");
                    return false;
                }
            }
        } else {
            // L'utente inserito non esiste.
            return false;
        }
    }

    public function SecureSignup($email, $password, $phoneNum) {
        $stmt = $this->db->prepare("SELECT UserId FROM users WHERE Email = ? LIMIT 1");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows == 1) {
            return false;
        }

        $userRole = 1;

        // Crea una chiave casuale
        $random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
        // Crea una password usando la chiave appena creata.
        $securePassword = hash('sha512', $password.$random_salt);

        $stmt = $this->db->prepare("INSERT INTO users (`Email`, `Role`, `Password`, `PasswordSalt`, `PhoneNum`) VALUES (?,?,?,?,?)");
        $stmt->bind_param('sssss', $email, $userRole, $securePassword, $random_salt, $phoneNum);
        
        return $stmt->execute();
    }

    public function GetProducts() {
        $stmt = $this->db->prepare("SELECT ProductId, Name, ShortDesc, LongDesc, Price, PlayerNumFrom, PlayerNumTo, Category, StockQuantity, ImageName FROM products");

        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    public function GetUserCartProducts() {
        $stmt = $this->db->prepare("SELECT p.ProductId, p.Name, p.LongDesc, p.Price, p.PlayerNumFrom, p.PlayerNumTo, p.Category, p.ImageName, c.Quantity FROM carts AS c INNER JOIN products AS p ON c.Product = p.ProductId WHERE c.User = ?");
        $stmt->bind_param('s', $_SESSION['user_id']);

        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function IncreaseUserCartProduct($productId) {
        try {
        $stmt = $this->db->prepare("SELECT Quantity FROM carts WHERE User = ? AND Product = ?");
        $stmt->bind_param('ss', $_SESSION['user_id'], $productId);
        $stmt->execute();
        
        $currentQuantity = $stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0]["Quantity"];
        $newQuantity = $currentQuantity + 1;

        $stmt = $this->db->prepare("UPDATE carts SET Quantity = ? WHERE User = ? AND Product = ?");
        $stmt->bind_param('sss', $newQuantity, $_SESSION['user_id'], $productId);
        $stmt->execute();

        return $newQuantity;
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

    public function DecreaseUserCartProduct($productId) {
        $stmt = $this->db->prepare("SELECT Quantity FROM carts WHERE User = ? AND Product = ?");
        $stmt->bind_param('ss', $_SESSION['user_id'], $productId);
        $stmt->execute();
        
        $currentQuantity = $stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0]["Quantity"];
        $newQuantity = $currentQuantity - 1;

        if ($newQuantity <= 0) {
            $stmt = $this->db->prepare("DELETE FROM carts WHERE User = ? AND Product = ?");
            $stmt->bind_param('ss', $_SESSION['user_id'], $productId);
            $stmt->execute();
        } else {
            $stmt = $this->db->prepare("UPDATE carts SET Quantity = ? WHERE User = ? AND Product = ?");
            $stmt->bind_param('sss', $newQuantity, $_SESSION['user_id'], $productId);
            $stmt->execute();
        }

        return $newQuantity;
    }

    public function CheckoutUserCart() {
        // Ottenimento prodotti del carrello
        $cartProducts = $this->GetUserCartProducts();

        if (count($cartProducts) == 0) {
            return "noProducts";
        }

        // Check prezzo totale del carrello
        $stmt = $this->db->prepare("SELECT SUM(p.Price * c.Quantity) AS Total FROM products AS p INNER JOIN carts AS c ON p.ProductId = c.Product WHERE c.User = ?");
        $stmt->bind_param('s', $_SESSION['user_id'],);
        $stmt->execute();

        $totalPrice = $stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0]['Total'];

        // Check budget utente
        $stmt = $this->db->prepare("SELECT Budget FROM users WHERE UserId = ?");
        $stmt->bind_param('s', $_SESSION['user_id'],);
        $stmt->execute();

        $userBudget = $stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0]['Budget'];

        if ($userBudget < $totalPrice) {
            return "notEnoughBudget";
        }

        // Acquisto
        $remainingBudget = $userBudget - $totalPrice;

        // Aggiornamento budget utente
        $stmt = $this->db->prepare("UPDATE users SET Budget = ? WHERE UserId = ?");
        $stmt->bind_param('ss', $remainingBudget, $_SESSION['user_id'],);
        $stmt->execute();

        // Creazione ordine
        $orderStatus = 1;

        $stmt = $this->db->prepare("INSERT INTO orders (`User`, `Status`) VALUES (?,?)");
        $stmt->bind_param('ss', $_SESSION['user_id'], $orderStatus);
        $stmt->execute();

        // Creazione dettaglio ordine
        $orderId = $stmt->insert_id;

        for ($i = 0; $i < count($cartProducts); $i++) {
            $currentProduct = $cartProducts[$i];
            $rowNum = $i + 1;

            $price = $currentProduct['Price'];
            $quantity = $currentProduct['Quantity'];

            $totalPrice = $price * $quantity;

            $stmt = $this->db->prepare("INSERT INTO order_details (`Order`, `RowNum`, `Product`, `Quantity`, `TotalPrice`) VALUES (?,?,?,?,?)");
            $stmt->bind_param('sssss', $orderId, $rowNum, $currentProduct["ProductId"], $quantity, $totalPrice);
            $stmt->execute();
        }

        // Pulizia del carrello
        $stmt = $this->db->prepare("DELETE FROM carts WHERE User = ?");
        $stmt->bind_param('s', $_SESSION['user_id'],);
        $stmt->execute();

        return "ok";
    }

    public function GetProductDetails($productId) {
        $stmt = $this->db->prepare("SELECT ProductId, Name, ShortDesc, LongDesc, Price, PlayerNumFrom, PlayerNumTo, Category, StockQuantity, ImageName FROM products WHERE ProductId = ?");
        $stmt->bind_param('s', $productId);
        $stmt->execute();

        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0];
    }

    public function AddProductToCart($productId) {
        $quantity = 1;

        $stmt = $this->db->prepare("INSERT INTO carts (`User`,`Product`,`Quantity`) VALUES (?,?,?)");
        $stmt->bind_param('sss', $_SESSION['user_id'], $productId, $quantity);
        $stmt->execute();

        return true;
        // return $stmt->get_result()->fetch_all(MYSQLI_ASSOC)[0];
    }
}
?>