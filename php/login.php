<?php
/**
 * Point d'entrée pour l'authentification des utilisateurs.
 * Vérifie les identifiants transmis via POST et ouvre une session
 * si l'authentification réussit.
 *
 * Paramètres POST acceptés :
 * - login : identifiant de l'utilisateur
 * - password : mot de passe hashé en SHA-256 côté client
 *
 * Retourne un JSON : {"result":"ok"} ou {"result":"error"}
 */
require_once("database.php");
require_once("user.dao.php");

session_start();

    if(isset($_POST["login"]))
    {
        $bdd = new Database();
        $passwordService = new PasswordService();
        $dao = new UserDao($bdd, $passwordService);
        $userArray = $dao->lireUtilisateur($_POST["login"]);
        $connected = "error";
        if (isset($userArray["hashpass"]) && $passwordService->verifier($_POST["password"], $userArray["hashpass"]))
        {
            $_SESSION["login"] = $_POST["login"];
            $_SESSION["name"] = $userArray["nom"];
            $_SESSION["statut"] = $userArray["statut"];
            $_SESSION["departement"]= $userArray["departement"];
            $_SESSION["role"]  = $userArray["role"];
            $connected = "ok";
        }
        echo json_encode(["result" => $connected]);
    }

?>
