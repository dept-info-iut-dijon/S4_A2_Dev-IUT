<?php
require_once("auth.php");
session_start();
require_login();

/* liste les matières */
require_once("database.php");
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
    else if($_GET["action"]=="insert")
    {
        $idlog = $_GET["idlog"];
        $idm = $_GET["idm"];
        $req = "INSERT INTO Logiciel_Matiere(MatiereID,LogicielID) VALUES(?,?);";
        $bdd->execute($req,[$idm,$idlog]);
    }
}
else if(isset($_GET["idlog"]))
{
    $id = $_GET["idlog"];
    $list = $bdd->queryAll("SELECT id,code,nom FROM Matiere JOIN Logiciel_Matiere ON MatiereID=id WHERE Logiciel_Matiere.LogicielID=?;",array($id));
}
else
{
    $list = $bdd->queryAll("SELECT id,code,nom FROM Matiere;",array());
}
echo json_encode($list);
?>
