<?php
require_once("database.php");
require_once("user.dao.php");

    //if(isset($_POST["login"]))
    {
        $bdd = new Database();
        $dao = new UserDao($bdd);
        $userArray = $dao->readUser($_POST["login"]);
        $connected = "error";
        if(isset($userArray["hashpass"]) && $userArray["hashpass"] == $_POST["password"])
            {
                session_start();
                $_SESSION["login"]=$_POST["login"];
                $_SESSION["name"] = $userArray["nom"] ;
                $_SESSION["statut"] = $userArray["statut"];
                $_SESSION["departement"]=$userArray["departement"];
                $_SESSION["role"] = $userArray["role"];
                $connected="ok";
            }
        echo json_encode(["result"=>$connected]);
    }
    
?>