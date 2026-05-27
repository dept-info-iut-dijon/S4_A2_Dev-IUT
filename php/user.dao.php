<?php
require_once("database.php");


class UserDao
{
    private Database $bdd;
    /**
     * Initialise l'objet
     * @param Database $bdd la base de données liée
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
    session_start();
    if (!isset($_SESSION['login'])) 
    {
        http_response_code(401);
        echo json_encode(["error" => "Non authentifié"]);
        exit;
    }

    $bdd = new Database();
    $dao = new UserDao($bdd);

    $action=$_POST["action"];
    if($action=="read" && isset($_POST["login"]))
    {
        $result = $dao->readUser($_POST["login"]);
        if ($result) {
            unset($result['hashpass']); // pour ne pas exposer le hash et donc eviter les rainbow table
        }
        echo json_encode($result);
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