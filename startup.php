<?php
session_start();
define("UPLOAD_DIR", "./upload/");

// require_once("utils/functions.php");
require_once("api-database.php");

$db = new DatabaseAPI("localhost", "root", "", "elab", 3306);
?>