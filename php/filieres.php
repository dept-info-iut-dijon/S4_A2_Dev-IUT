<?php
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
        $database->executer("DELETE FROM Logiciel_Filiere WHERE LogicielID=?", array($idLogiciel));
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
