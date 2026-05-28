<?php
require_once("logiciels.dao.php");
require_once("auth.php");

session_start();
if (!isset($_SESSION["login"])) {
    http_response_code(401);
    echo json_encode(["error" => "Non authentifié"]);
    exit;
}

$database     = new Database();
$daoLogiciels = new LogicielsDao($database);

$portable       = isset($_GET["portable"]) ? filter_var($_GET["portable"], FILTER_VALIDATE_BOOLEAN) : false;
$cacherObsolete = isset($_GET["obsolete"]) ? filter_var($_GET["obsolete"], FILTER_VALIDATE_BOOLEAN) : false;

try {
    if (isset($_GET["action"])) {
        if ($_GET["action"] === "update") {
            require_admin();
            $daoLogiciels->mettreAJourLogiciel($_GET);
            echo json_encode(["result" => "ok"]);
        }
        else if ($_GET["action"] === "insert") {
            $id = $daoLogiciels->ajouterLogiciel($_GET);
            echo json_encode(["id" => $id]);
        }
        else if ($_GET["action"] === "delete") {
            $daoLogiciels->supprimerLogiciel($_GET);
            echo json_encode(["result" => "ok"]);
        }
    }
    else if (isset($_GET["idmat"])) {
        $id = filter_var($_GET["idmat"], FILTER_VALIDATE_INT);
        if ($id === false) { http_response_code(400); echo json_encode(["error" => "idmat invalide"]); exit; }
        if (isset($_GET["page"])) {
            $page   = intval($_GET["page"]);
            $limite = isset($_GET["limite"]) ? intval($_GET["limite"]) : 20;
            echo json_encode($daoLogiciels->listByMatierePagine($id, $portable, $cacherObsolete, $page, $limite));
        } else {
            echo json_encode($daoLogiciels->listerParMatiere($id, $portable, $cacherObsolete));
        }
    }
    else if (isset($_GET["idfil"])) {
        $id = filter_var($_GET["idfil"], FILTER_VALIDATE_INT);
        if ($id === false) { http_response_code(400); echo json_encode(["error" => "idfil invalide"]); exit; }
        if (isset($_GET["page"])) {
            $page   = intval($_GET["page"]);
            $limite = isset($_GET["limite"]) ? intval($_GET["limite"]) : 20;
            echo json_encode($daoLogiciels->listByFilierePagine($id, $portable, $cacherObsolete, $page, $limite));
        } else {
            echo json_encode($daoLogiciels->listerParFiliere($id, $portable, $cacherObsolete));
        }
    }
    else if (isset($_GET["nom"])) {
        $nom = strip_tags($_GET["nom"]);
        if (isset($_GET["page"])) {
            $page   = intval($_GET["page"]);
            $limite = isset($_GET["limite"]) ? intval($_GET["limite"]) : 20;
            echo json_encode($daoLogiciels->listByNamePagine($nom, $portable, $cacherObsolete, $page, $limite));
        } else {
            echo json_encode($daoLogiciels->listerParNom($nom, $portable, $cacherObsolete));
        }
    }
    else if (isset($_GET["id"])) {
        $id = filter_var($_GET["id"], FILTER_VALIDATE_INT);
        if ($id === false) { http_response_code(400); echo json_encode(["error" => "id invalide"]); exit; }
        echo json_encode($daoLogiciels->listerParId($id));
    }
    else {
        if (isset($_GET["page"])) {
            $page   = intval($_GET["page"]);
            $limite = isset($_GET["limite"]) ? intval($_GET["limite"]) : 20;
            echo json_encode($daoLogiciels->listAllPagine($portable, $cacherObsolete, $page, $limite));
        } else {
            echo json_encode($daoLogiciels->listerTous($portable, $cacherObsolete));
        }
    }
} catch (Exception $e) {
    error_log('[logiciels] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Erreur du serveur"]);
    exit;
}
