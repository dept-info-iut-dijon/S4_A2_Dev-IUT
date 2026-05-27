<?php
session_start();
if (!isset($_SESSION["login"])) {
    http_response_code(401);
    echo "Non authentifié";
    exit;
}

$typesAutorises = [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/gif',
    'text/plain',
];
$tailleMax = 200 * 1024 * 1024;

if (!isset($_FILES['file']['name'])) {
    echo "Aucun fichier reçu";
    exit;
}

$src      = $_FILES['file']['tmp_name'];
$filename = basename($_FILES['file']['name']);
$location = __DIR__ . "/../files/" . $filename;

// A5 : vérification de la taille
if ($_FILES['file']['size'] > $tailleMax) {
    echo "Fichier trop volumineux (maximum 200 Mo)";
    exit;
}

// A5 : vérification du type MIME réel (pas juste l'extension)
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($src);
if (!in_array($mime, $typesAutorises)) {
    echo "Type de fichier non autorisé";
    exit;
}

if (!is_uploaded_file($src)) {
    echo "Erreur lors de la réception du fichier";
    exit;
}

if (move_uploaded_file($src, $location)) {
    echo "Fichier $filename uploadé avec succès";
} else {
    echo "Erreur lors de la copie du fichier";
}
