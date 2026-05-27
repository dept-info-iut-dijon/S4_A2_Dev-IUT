<?php
session_start();
if (!isset($_SESSION["login"])) {
    http_response_code(401);
    echo json_encode(["error" => "Non authentifié"]);
    exit;
}

require_once("database.php");
$bdd  = new Database();
$list = array();

try {
    if (isset($_GET["action"])) {
        if ($_GET["action"] === "delete") {
            $id  = $_GET["idlog"];
            $req = "DELETE FROM Logiciel_Filiere WHERE LogicielID=?";
            $bdd->execute($req, array($id));
        }
        else if ($_GET["action"] === "insert") {
            $idlog = $_GET["idlog"];
            $idf   = $_GET["idf"];
            $req   = "INSERT INTO Logiciel_Filiere(FiliereID, LogicielID) VALUES(?,?);";
            $bdd->execute($req, [$idf, $idlog]);
        }
    }
    else if (isset($_GET["id"])) {
        $id   = $_GET["id"];
        $list = $bdd->queryAll(
            "SELECT id, nom FROM Filiere
             JOIN Logiciel_Filiere ON Logiciel_Filiere.FiliereID = Filiere.id
             WHERE Logiciel_Filiere.LogicielID=?;",
            array($id)
        );
    }
    else {
        $list = $bdd->queryAll("SELECT id, nom FROM Filiere;", array());
    }
} catch (Exception $e) {
    error_log('[filieres] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Erreur du serveur"]);
    exit;
}

echo json_encode($list);
