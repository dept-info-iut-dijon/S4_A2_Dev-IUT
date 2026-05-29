<?php
/**
 * Point d'entrée API pour la gestion des filières.
 * Gère les opérations de lecture, insertion et suppression
 * des associations entre logiciels et filières.
 * Nécessite une session active (utilisateur connecté).
 *
 * Paramètres GET acceptés :
 * - action=delete & idlog : supprime toutes les filières liées à un logiciel
 * - action=insert & idlog & idf : associe une filière à un logiciel
 * - id : retourne les filières associées à un logiciel donné
 * - (aucun) : retourne la liste complète des filières
 */
require_once("database.php");
require_once("auth.php");

session_start();
require_login();

$database = new Database();
$liste    = array();

if(isset($_GET["action"]))
{
    require_admin();
    if($_GET["action"]=="delete")
    {
        $id = $_GET["idlog"];
        $req = "DELETE FROM Logiciel_Filiere WHERE LogicielID=?";
        $database->execute($req,array($id));
    }
    else if ($_GET["action"] === "insert") {
        $idLogiciel = $_GET["idlog"];
        $idFiliere  = $_GET["idf"];
        $database->executer(
            "INSERT INTO Logiciel_Filiere(FiliereID, LogicielID) VALUES(?,?);",
            [$idFiliere, $idLogiciel]
        );
    }
}
else if (isset($_GET["id"])) {
    $id    = $_GET["id"];
    $liste = $database->lireTous(
        "SELECT id, nom FROM Filiere
         JOIN Logiciel_Filiere ON Logiciel_Filiere.FiliereID = Filiere.id
         WHERE Logiciel_Filiere.LogicielID=?;",
        array($id)
    );
}
else {
    $liste = $database->lireTous("SELECT id, nom FROM Filiere;", array());
}

echo json_encode($liste);
?>
