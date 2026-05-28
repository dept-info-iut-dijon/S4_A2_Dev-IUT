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
$database = new Database();
$daoLogiciels = new LogicielsDao($database);

$liste = array();
$portable = isset($_GET["portable"]) ? filter_var($_GET["portable"], FILTER_VALIDATE_BOOLEAN) : false;
$cacherObsolete = isset($_GET["obsolete"]) ? filter_var($_GET["obsolete"], FILTER_VALIDATE_BOOLEAN) : false;

try {
if (isset($_GET["action"])) {
    if ($_GET["action"] === "update") {
        $daoLogiciels->mettreAJourLogiciel($_GET);
    }
    else if ($_GET["action"] === "insert") {
        $liste["id"] = $daoLogiciels->ajouterLogiciel($_GET);
    }
    else if ($_GET["action"] === "delete") {
        $daoLogiciels->supprimerLogiciel($_GET);
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
    $liste = $daoLogiciels->listerParMatiere($id, $portable, $cacherObsolete);
}
else if (isset($_GET["idfil"])) {
    // Filtrage par filière — validation de l'entier
    $id = filter_var($_GET["idfil"], FILTER_VALIDATE_INT);
    if ($id === false) {
        http_response_code(400);
        echo json_encode(["error" => "Paramètre idfil invalide"]);
        exit;
    }
    $liste = $daoLogiciels->listerParFiliere($id, $portable, $cacherObsolete);
}
else if (isset($_GET["nom"])) {
    $nom   = strip_tags($_GET["nom"]);
    $liste = $daoLogiciels->listerParNom($nom, $portable, $cacherObsolete);
}
else if (isset($_GET["id"])) {
    $id = filter_var($_GET["id"], FILTER_VALIDATE_INT);
    if ($id === false) {
        http_response_code(400);
        echo json_encode(["error" => "Paramètre id invalide"]);
        exit;
    }
    $liste = $daoLogiciels->listerParId($id);
}
else {
    $liste = $daoLogiciels->listerTous($portable, $cacherObsolete);
}
} catch (Exception $e) {
    error_log('[logiciels] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Erreur du serveur"]);
    exit;
}

echo json_encode($liste);
