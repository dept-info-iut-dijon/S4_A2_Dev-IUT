<?php
session_start();
if (!isset($_SESSION["login"])) {
    http_response_code(401);
    echo "Non authentifiÃ©";
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


session_start();
if (!isset($_SESSION['login'])) {
    http_response_code(401);
    echo json_encode(["error" => "Non authentifié"]);
    exit;
}
if (!isset($_FILES['file']['name'])) {
    echo "Aucun fichier reÃ§u";
    exit;
}

$extensions = ['jpg', 'jpeg', 'png', 'ico', 'gif', 'pdf', 'docx', '7z', 'zip', 'tgz', 'exe'];

if(isset($_FILES['file']['name'])){
    $ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $extensions)) 
    {
        http_response_code(400);
        echo json_encode(["error" => "Extension non autorisée"]);
        exit;
    }
    // file name
    $filename = $_FILES['file']['name'];

$src      = $_FILES['file']['tmp_name'];
$filename = basename($_FILES['file']['name']);
$location = __DIR__ . "/../files/" . $filename;

// A5 : vÃ©rification de la taille
if ($_FILES['file']['size'] > $tailleMax) {
    echo "Fichier trop volumineux (maximum 200 Mo)";
    exit;
}

// A5 : vÃ©rification du type MIME rÃ©el (pas juste l'extension)
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($src);
if (!in_array($mime, $typesAutorises)) {
    echo "Type de fichier non autorisÃ©";
    exit;
}

if (!is_uploaded_file($src)) {
    echo "Erreur lors de la rÃ©ception du fichier";
    exit;
}

if (move_uploaded_file($src, $location)) {
    echo "Fichier $filename uploadÃ© avec succÃ¨s";
} else {
    echo "Erreur lors de la copie du fichier";
}
