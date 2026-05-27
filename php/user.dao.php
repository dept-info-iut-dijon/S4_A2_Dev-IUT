<?php
require_once("database.php");

class UserDao
{
    private Database $bdd;

    public function __construct(Database $bdd)
    {
        $this->bdd = $bdd;
    }

    public function readUser($login)
    {
        $req = "SELECT * FROM Utilisateur WHERE login=?";
        return $this->bdd->queryOne($req, [$login]);
    }

    public function addUser($user)
    {
        $hash = password_hash($user["password"], PASSWORD_BCRYPT);
        $req  = "INSERT INTO Utilisateur(login, nom, statut, departement, role, hashpass) VALUES(?,?,?,?,1,?);";
        $this->bdd->execute($req, [$user["login"], $user["nom"], $user["statut"], $user["departement"], $hash]);
        return true;
    }
}

if (isset($_POST["action"])) {
    $bdd = new Database();
    $dao = new UserDao($bdd);

    if ($_POST["action"] === "read" && isset($_POST["login"])) {
        echo json_encode($dao->readUser($_POST["login"]));
    }
    else if ($_POST["action"] === "add") {
        try {
            $ret = $dao->addUser($_POST);
            echo json_encode(["response" => "ok", "message" => $ret]);
        }
        catch (Exception $e) {
            echo json_encode(["response" => "error", "message" => $e->getMessage()]);
        }
    }
}
