<?php
require_once("database.php");
require_once("auth.php");

session_start();
if (!isset($_SESSION["login"])) {
    http_response_code(401);
    echo json_encode(["error" => "Non authentifié"]);
    exit;
}

$database = new Database();
$liste    = array();

if (isset($_GET["action"])) {
    require_admin();
    if ($_GET["action"] == "delete") {
        $id = $_GET["idlog"];
        $database->executer("DELETE FROM Logiciel_Matiere WHERE LogicielID=?", array($id));
    }
    else if ($_GET["action"] === "insert") {
        $database->executer(
            "INSERT INTO Logiciel_Matiere(MatiereID, LogicielID) VALUES(?,?);",
            [$_GET["idm"], $_GET["idlog"]]
        );
    }
}
else if (isset($_GET["idlog"])) {
    $liste = $database->lireTous(
        "SELECT id, code, nom FROM Matiere
         JOIN Logiciel_Matiere ON MatiereID = id
         WHERE Logiciel_Matiere.LogicielID=?;",
        array($_GET["idlog"])
    );
}
else {
    $liste = $database->lireTous("SELECT id, code, nom FROM Matiere;", array());
}

echo json_encode($liste);
