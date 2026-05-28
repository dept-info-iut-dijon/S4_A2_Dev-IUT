<?php
require_once("database.php");
require_once("user.dao.php");

session_start();

$database = new Database();
$daoUtilisateur = new UserDao($database);
$utilisateur = $daoUtilisateur->lireUtilisateur($_POST["login"]);
$resultat = "error";

if (isset($utilisateur["hashpass"]) && password_verify($_POST["password"], $utilisateur["hashpass"])) {
    $_SESSION["login"]       = $_POST["login"];
    $_SESSION["name"]        = $utilisateur["nom"];
    $_SESSION["statut"]      = $utilisateur["statut"];
    $_SESSION["departement"] = $utilisateur["departement"];
    $resultat = "ok";
}

echo json_encode(["result" => $resultat]);
