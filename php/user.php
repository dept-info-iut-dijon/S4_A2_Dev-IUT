<?php
    session_start();
    require_once("auth.php");
    require_login();
    $retour = array("login"=>$_SESSION["login"],"nom"=>$_SESSION["name"], "statut"=>$_SESSION["statut"], "departement"=>$_SESSION["departement"] );
    echo json_encode($retour);
?>
