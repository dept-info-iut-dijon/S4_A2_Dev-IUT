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
}
?>