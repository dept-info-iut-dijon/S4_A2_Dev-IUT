<?php
require_once("auth.php");
session_start();

/* liste les matières */
$bdd = new Database();
$list = array();
if(isset($_GET["action"]))
{
    require_admin();
    if($_GET["action"]=="delete")
    {
        $id = $_GET["idlog"];
        $req = "DELETE FROM Logiciel_Matiere WHERE LogicielID=?";
        $bdd->execute($req,array($id));

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
