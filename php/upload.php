<?php

$response = "paramètre script incorrect";
if(isset($_FILES['file']['name'])){
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