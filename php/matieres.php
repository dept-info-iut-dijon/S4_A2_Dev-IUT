<?php
/**
 * Point d'entrée API pour la gestion des matières.
 * Gère les opérations de lecture, insertion et suppression
 * des associations entre logiciels et matières.
 * Nécessite une session active (utilisateur connecté).
 *
 * Paramètres GET acceptés :
 * - action=delete & idlog : supprime toutes les matières liées à un logiciel
 * - action=insert & idlog & idm : associe une matière à un logiciel
 * - idlog : retourne les matières associées à un logiciel donné
 * - (aucun) : retourne la liste complète des matières
 */

// Vérification que l'utilisateur est connecté
session_start();
if (!isset($_SESSION["login"])) {
    http_response_code(401);
    echo json_encode(["error" => "Non authentifié"]);
    exit;
}

require_once("database.php");
$database = new Database();
$liste    = array();

if (isset($_GET["action"])) {
    if ($_GET["action"] === "delete") {
        $idLogiciel = $_GET["idlog"];
        $database->executer("DELETE FROM Logiciel_Matiere WHERE LogicielID=?", array($idLogiciel));
    }
    else if ($_GET["action"] === "insert") {
        $idLogiciel = $_GET["idlog"];
        $idMatiere  = $_GET["idm"];
        $database->executer(
            "INSERT INTO Logiciel_Matiere(MatiereID, LogicielID) VALUES(?,?);",
            [$idMatiere, $idLogiciel]
        );
    }
}
else if (isset($_GET["idlog"])) {
    $id    = $_GET["idlog"];
    $liste = $database->lireTous(
        "SELECT id, code, nom FROM Matiere
         JOIN Logiciel_Matiere ON MatiereID = id
         WHERE Logiciel_Matiere.LogicielID=?;",
        array($id)
    );
}
else {
    $liste = $database->lireTous("SELECT id, code, nom FROM Matiere;", array());
}

echo json_encode($liste);
