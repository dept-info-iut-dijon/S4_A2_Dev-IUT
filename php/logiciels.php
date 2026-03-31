<?php

require_once("logiciels.dao.php");
$bdd = new Database();
$dao = new LogicielsDao($bdd);

$list=array();
if(isset($_GET["portable"]))            
    $portable = filter_var($_GET["portable"],FILTER_VALIDATE_BOOLEAN);
else
    $portable=false;

if(isset($_GET["obsolete"]))
    $cacherObs = filter_var($_GET["obsolete"],FILTER_VALIDATE_BOOLEAN);
else
    $cacherObs = false;

if(isset($_GET["action"]))
{
    if($_GET["action"]=="update")
    {
        $dao->majLogiciel($_GET);
    }
    else if($_GET["action"]=="insert")
    {
       $list["id"] = $dao->addLogiciel($_GET);
    }
    else if($_GET["action"]=="delete")
    {
        $dao->delLogiciel($_GET);
    }
}
else if(isset($_GET["idmat"]))
{
    $id = $_GET["idmat"];
    $list = $dao->listByMatiere($id, $portable, $cacherObs);
}
else if(isset($_GET["idfil"]))
{
    $id = $_GET["idfil"];
    $list = $dao->listByFiliere($id, $portable, $cacherObs);

}
else if(isset($_GET["nom"]))
{
    $nom = $_GET["nom"];
    $list = $dao->listByName($nom, $portable, $cacherObs);
}
else if(isset($_GET["id"]))
{
    $id = $_GET["id"];
    $list = $dao->listById($id);
}

else
{
    $list = $dao->listAll($portable, $cacherObs);
}
echo json_encode($list);
?>