<?php
require_once("database.php");
require_once("constants.php");

class UserDao
{
    private Database $database;

    /**
     * Initialise l'objet
     * @param Database $bdd la base de données liée
     */
    public function __construct(Database $database)
    {
        $this->database = $database;
    }

     /**
     * Read a user
     * @param string $login the login
     * @return mixed user on array
     */
    public function lireUtilisateur($login)
    {
        $requete = "SELECT * FROM Utilisateur WHERE login=?";
        return $this->database->lireUn($requete, [$login]);
    }

    public function ajouterUtilisateur($utilisateur)
    {
        $empreinte = password_hash($utilisateur["password"], PASSWORD_BCRYPT);
        $requete = "INSERT INTO Utilisateur(login, nom, statut, departement, role, hashpass) VALUES(?,?,?,?," . ROLE_PROF . ",?)";
        $this->database->executer($requete, [
            $utilisateur["login"], $utilisateur["nom"],
            $utilisateur["statut"], $utilisateur["departement"], $empreinte
        ]);
        return true;
    }
}

if (isset($_POST["action"])) {
    $database = new Database();
    $daoUtilisateur = new UserDao($database);

    if ($_POST["action"] === "read" && isset($_POST["login"])) {
        echo json_encode($daoUtilisateur->lireUtilisateur($_POST["login"]));
    }
    else if ($_POST["action"] === "add") {
        try {
            $resultat = $daoUtilisateur->ajouterUtilisateur($_POST);
            echo json_encode(["response" => "ok", "message" => $resultat]);
        }
        catch (Exception $exception) {
            echo json_encode(["response" => "error", "message" => $exception->getMessage()]);
        }
    }
}
