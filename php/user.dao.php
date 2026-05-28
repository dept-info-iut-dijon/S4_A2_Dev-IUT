<?php
require_once("database.php");
require_once("constants.php");

// SRP : le hashage est isolé ici, séparé du DAO
class PasswordService
{
    public function hasher(string $motDePasse): string
    {
        return password_hash($motDePasse, PASSWORD_BCRYPT);
    }

    public function verifier(string $motDePasse, string $empreinte): bool
    {
        return password_verify($motDePasse, $empreinte);
    }
}

class UserDao
{
    private Database $database;
    private PasswordService $passwordService;

    // DIP : les dépendances sont injectées, pas créées en interne
    public function __construct(Database $database, PasswordService $passwordService)
    {
        $this->database = $database;
        $this->passwordService = $passwordService;
    }

    public function lireUtilisateur(string $login): mixed
    {
        $requete = "SELECT * FROM Utilisateur WHERE login=?";
        return $this->database->lireUn($requete, [$login]);
    }

    public function supprimerUtilisateur(string $login, string $password): bool
    {
        $utilisateur = $this->lireUtilisateur($login);
        if (!isset($utilisateur["hashpass"])) {
            return false;
        }
        if (!$this->passwordService->verifier($password, $utilisateur["hashpass"])) {
            return false;
        }
        $this->database->executer("DELETE FROM Utilisateur WHERE login=?", [$login]);
        return true;
    }

    public function ajouterUtilisateur(array $utilisateur): bool
    {
        $empreinte = $this->passwordService->hasher($utilisateur["password"]);
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
    $daoUtilisateur = new UserDao($database, new PasswordService());

    if ($_POST["action"] === "read" && isset($_POST["login"])) {
        echo json_encode($daoUtilisateur->lireUtilisateur($_POST["login"]));
    }
    else if ($_POST["action"] === "delete" && isset($_POST["login"], $_POST["password"])) {
        session_start();
        $login = $_SESSION["login"] ?? "";
        // on ne peut supprimer que son propre compte
        if ($login !== $_POST["login"]) {
            echo json_encode(["response" => "error", "message" => "Interdit"]);
            exit;
        }
        $supprime = $daoUtilisateur->supprimerUtilisateur($_POST["login"], $_POST["password"]);
        if ($supprime) {
            session_destroy();
            echo json_encode(["response" => "ok"]);
        } else {
            echo json_encode(["response" => "error", "message" => "Mot de passe incorrect"]);
        }
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
