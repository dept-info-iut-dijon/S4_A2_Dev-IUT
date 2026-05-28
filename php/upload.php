<?php

session_start();
if (!isset($_SESSION['login'])) {
    http_response_code(401);
    echo json_encode(["error" => "Non authentifié"]);
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

    // Location
    $path = __DIR__;
    $location = $path."/../files/".$filename;

    $src = $_FILES['file']['tmp_name'];
    if(is_uploaded_file($src))
    {
        $reponse = "upload dans tmp ok ";
        if(move_uploaded_file($src,$location))
        {
            $reponse = $reponse . "copie $filename ok";
        }
        else
        {
            $reponse = $reponse . "erreur copie $src dans $location";
        }
        
    }
    else
    {
        $reponse = "pas upload dans tmp ";        
    }    
    
    echo $reponse;
}
?>