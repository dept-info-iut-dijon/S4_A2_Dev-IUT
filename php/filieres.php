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
session_start();
if (!isset($_SESSION["login"])) {
    http_response_code(401);
    echo json_encode(["error" => "Non authentifié"]);
    exit;
}

require_once("database.php");
$bdd  = new Database();
$list = array();

if (isset($_GET["action"])) {
    if ($_GET["action"] === "delete") {
        // Suppression de toutes les filières associées à un logiciel
        $id  = $_GET["idlog"];
        $req = "DELETE FROM Logiciel_Filiere WHERE LogicielID=?";
        $bdd->execute($req, array($id));
    }
    else if ($_GET["action"] === "insert") {
        // Association d'une filière à un logiciel
        $idlog = $_GET["idlog"];
        $idf   = $_GET["idf"];
        $req   = "INSERT INTO Logiciel_Filiere(FiliereID, LogicielID) VALUES(?,?);";
        $bdd->execute($req, [$idf, $idlog]);
    }
}
else if (isset($_GET["id"])) {
    // Retourne les filières associées à un logiciel donné
    $id   = $_GET["id"];
    $list = $bdd->queryAll(
        "SELECT id, nom FROM Filiere
         JOIN Logiciel_Filiere ON Logiciel_Filiere.FiliereID = Filiere.id
         WHERE Logiciel_Filiere.LogicielID=?;",
        array($id)
    );
}
else {
    // Retourne la liste complète des filières
    $list = $bdd->queryAll("SELECT id, nom FROM Filiere;", array());
}

echo json_encode($list);
?>