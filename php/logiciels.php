<?php
// A3 : vérification que l'utilisateur est connecté
session_start();
if (!isset($_SESSION["login"])) {
    http_response_code(401);
    echo json_encode(["error" => "Non authentifié"]);
    exit;
}

require_once("logiciels.dao.php");
$bdd = new Database();
$dao = new LogicielsDao($bdd);

$list = array();

$portable  = isset($_GET["portable"])  ? filter_var($_GET["portable"],  FILTER_VALIDATE_BOOLEAN) : false;
$cacherObs = isset($_GET["obsolete"])  ? filter_var($_GET["obsolete"],  FILTER_VALIDATE_BOOLEAN) : false;

try {
if (isset($_GET["action"])) {
    if ($_GET["action"] === "update") {
        $dao->majLogiciel($_GET);
    }
    else if ($_GET["action"] === "insert") {
        $list["id"] = $dao->addLogiciel($_GET);
    }
    else if ($_GET["action"] === "delete") {
        $dao->delLogiciel($_GET);
    }
}
else if (isset($_GET["idmat"])) {
    // A4 : on vérifie que idmat est bien un entier
    $id = filter_var($_GET["idmat"], FILTER_VALIDATE_INT);
    if ($id === false) {
        http_response_code(400);
        echo json_encode(["error" => "Paramètre idmat invalide"]);
        exit;
    }
    $list = $dao->listByMatiere($id, $portable, $cacherObs);
}
else if (isset($_GET["idfil"])) {
    // A4 : on vérifie que idfil est bien un entier
    $id = filter_var($_GET["idfil"], FILTER_VALIDATE_INT);
    if ($id === false) {
        http_response_code(400);
        echo json_encode(["error" => "Paramètre idfil invalide"]);
        exit;
    }
    $list = $dao->listByFiliere($id, $portable, $cacherObs);
}
else if (isset($_GET["nom"])) {
    // A4 : on nettoie la chaîne de recherche
    $nom  = strip_tags($_GET["nom"]);
    $list = $dao->listByName($nom, $portable, $cacherObs);
}
else if (isset($_GET["id"])) {
    // A4 : on vérifie que id est bien un entier
    $id = filter_var($_GET["id"], FILTER_VALIDATE_INT);
    if ($id === false) {
        http_response_code(400);
        echo json_encode(["error" => "Paramètre id invalide"]);
        exit;
    }
    $list = $dao->listById($id);
}
else {
    $list = $dao->listAll($portable, $cacherObs);
}
} catch (Exception $e) {
    error_log('[logiciels] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Erreur du serveur"]);
    exit;
}

echo json_encode($list);
