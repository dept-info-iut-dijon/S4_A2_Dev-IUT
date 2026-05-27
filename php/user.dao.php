<?php
require_once("database.php");


class UserDao
{
    private Database $bdd;
    /**
     * Initialise l'objet
     * @param Database $bdd la base de donn�es li�e
     */
    public function __construct(Database $bdd)
    {
        $this->bdd = $bdd;
    }

    /**
     * Read a user
     * @param string $login the login
     * @return mixed user on array
     */
    public function readUser($login){
        $req = "SELECT * FROM Utilisateur WHERE login=?";
        return $this->bdd->queryOne($req,[$login]);
    }
    
    /**
     * Add a user, if not exists, in BDD
     * @param mixed $user
     * @return bool true if the user has been added
     */
    public function addUser($user){
        $added=false;
        $req = "INSERT INTO Utilisateur(login,nom,statut,departement,role) VALUES(?,?,?,?,1);";
        $this->bdd->execute($req,[$user["login"],$user["nom"],$user["statut"],$user["departement"]]);
        $added=true;
        return $added;
    }

    /**
     * Supprime le compte d'un utilisateur .
     * On vérifie le mot de passe avant de supprimer.
     * @param string $login le login à supprimer
     * @param string $password le mot de passe fourni pour confirmation
     * @return bool true si supprimé, false si mot de passe incorrect
     */
    public function deleteUser($login, $password)
    {
        $utilisateur = $this->readUser($login);

        if (!isset($utilisateur["hashpass"])) {
            return false;
        }

        if ($utilisateur["hashpass"] !== $password) {
            return false;
        }

        $req = "DELETE FROM Utilisateur WHERE login=?";
        $this->bdd->execute($req, [$login]);
        return true;
    }
}
if(isset($_POST["action"]))
{
    $bdd = new Database();
    $dao = new UserDao($bdd);

    $action=$_POST["action"];
    if($action=="read" && isset($_POST["login"]))
    {
        echo json_encode($dao->readUser($_POST["login"]));
    }
    else if($action=="add")
    {
        try{
            $ret=$dao->addUser($_POST);
            echo json_encode(["response"=>"ok","message"=>$ret]);
        }
        catch(Exception $e){
            $msg = $e->getMessage();
            echo json_encode(["response"=>"ok", "message"=>$msg]);
        }
    }
    else if ($action === "delete" && isset($_POST["login"], $_POST["password"]))
    {
        // RGPD : l'utilisateur confirme avec son mot de passe avant suppression
        $supprime = $dao->deleteUser($_POST["login"], $_POST["password"]);

        if ($supprime) {
            session_start();
            session_destroy();
            echo json_encode(["response" => "ok"]);
        } else {
            echo json_encode(["response" => "error", "message" => "Mot de passe incorrect"]);
        }
    }
}
?>