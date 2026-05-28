<?php
function require_login() {
    if (!isset($_SESSION['login'])) {
        http_response_code(401);
        echo json_encode(["error" => "Non authentifié"]);
        exit;
    }
}

function require_admin() {
    require_login();
    if (!isset($_SESSION['role']) || $_SESSION['role'] != 1) {
        http_response_code(403);
        echo json_encode(["error" => "Accès refusé"]);
        exit;
    }
}
