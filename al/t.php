<?php
session_start();
include_once "config.php";
$fname =mysqli_real_escape_string($conn,$_POST['fname'])
?>