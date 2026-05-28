<?php
/**
 * Point d'entrée API pour la gestion des logiciels.
 * Gère les opérations CRUD sur les logiciels ainsi que
 * les différents modes de filtrage de la liste.
 * Nécessite une session active (utilisateur connecté).
 *
 * Paramètres GET acceptés :
 * - action=update : met à jour un logiciel existant
 * - action=insert : crée un nouveau logiciel
 * - action=delete : supprime un logiciel
 * - idmat : filtre les logiciels par matière (entier requis)
 * - idfil : filtre les logiciels par filière (entier requis)
 * - nom : filtre les logiciels par nom
 * - id : retourne un logiciel par son identifiant (entier requis)
 * - portable (bool) : filtre les logiciels portables uniquement
 * - obsolete (bool) : masque les logiciels obsolètes
 * - (aucun) : retourne tous les logiciels
 */

// Vérification que l'utilisateur est connecté
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

// Récupération des filtres d'affichage
$portable  = isset($_GET["portable"]) ? filter_var($_GET["portable"], FILTER_VALIDATE_BOOLEAN) : false;
$cacherObs = isset($_GET["obsolete"]) ? filter_var($_GET["obsolete"], FILTER_VALIDATE_BOOLEAN) : false;

if (isset($_GET["action"])) {
    if ($_GET["action"] === "update") {
        // Mise à jour d'un logiciel existant
        $dao->majLogiciel($_GET);
    }
    else if ($_GET["action"] === "insert") {
        // Création d'un nouveau logiciel
        $list["id"] = $dao->addLogiciel($_GET);
    }
    else if ($_GET["action"] === "delete") {
        // Suppression d'un logiciel
        $dao->delLogiciel($_GET);
    }
}
else if (isset($_GET["idmat"])) {
    // Filtrage par matière — validation de l'entier
    $id = filter_var($_GET["idmat"], FILTER_VALIDATE_INT);
    if ($id === false) {
        http_response_code(400);
        echo json_encode(["error" => "Paramètre idmat invalide"]);
        exit;
    }
    $list = $dao->listByMatiere($id, $portable, $cacherObs);
}
else if (isset($_GET["idfil"])) {
    // Filtrage par filière — validation de l'entier
    $id = filter_var($_GET["idfil"], FILTER_VALIDATE_INT);
    if ($id === false) {
        http_response_code(400);
        echo json_encode(["error" => "Paramètre idfil invalide"]);
        exit;
    }
    $list = $dao->listByFiliere($id, $portable, $cacherObs);
}
else if (isset($_GET["nom"])) {
    // Filtrage par nom — nettoyage de la chaîne
    $nom  = strip_tags($_GET["nom"]);
    $list = $dao->listByName($nom, $portable, $cacherObs);
}
else if (isset($_GET["id"])) {
    // Récupération par identifiant — validation de l'entier
    $id = filter_var($_GET["id"], FILTER_VALIDATE_INT);
    if ($id === false) {
        http_response_code(400);
        echo json_encode(["error" => "Paramètre id invalide"]);
        exit;
    }
    $list = $dao->listById($id);
}
else {
    // Liste complète des logiciels
    $list = $dao->listAll($portable, $cacherObs);
}

echo json_encode($list);
?>