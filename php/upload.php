<?php
require_once("auth.php");
session_start();
require_login();

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
    http_response_code(400);
    echo json_encode(["error" => "Aucun fichier reçu"]);
    exit;
}

$extensions = ['jpg', 'jpeg', 'png', 'ico', 'gif', 'pdf', 'docx', '7z', 'zip', 'tgz', 'exe'];
$ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $extensions)) {
    http_response_code(400);
    echo json_encode(["error" => "Extension non autorisée"]);
    exit;
}

$src      = $_FILES['file']['tmp_name'];
$filename = basename($_FILES['file']['name']);
$location = __DIR__ . "/../files/" . $filename;

if ($_FILES['file']['size'] > $tailleMax) {
    http_response_code(400);
    echo json_encode(["error" => "Fichier trop volumineux (maximum 200 Mo)"]);
    exit;
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($src);
if (!in_array($mime, $typesAutorises)) {
    http_response_code(400);
    echo json_encode(["error" => "Type de fichier non autorisé"]);
    exit;
}

if (!is_uploaded_file($src)) {
    http_response_code(400);
    echo json_encode(["error" => "Erreur lors de la réception du fichier"]);
    exit;
}

if (move_uploaded_file($src, $location)) {
    echo json_encode(["success" => "Fichier $filename uploadé avec succès"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la copie du fichier"]);
}
