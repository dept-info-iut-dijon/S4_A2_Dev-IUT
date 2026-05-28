<?php
/**
* connexion à la base de données
* Database description.
* @version 1.0
* @author aguidet
*/
class Database
{    
    private $pdo;

    public function __construct()
    {
        $host = "localhost";
        $base = "opti";
        $user = "root";
        $pass = "";
        try{
            $this->pdo = new PDO("mysql:host=$host;dbname=$base",$user,$pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_PERSISTENT => true
        ]);            
            
            $this->pdo->exec("SET AUTOCOMMIT=1;");
        }        
        catch(PDOException $ex){
            ;
        }
    }

    /**
     * Effectue une requête renvoyant une valeur
     * @param string $req la requête, éventuellement paramétrée
     * @param array $params le tableau des paramètres
     * @return mixed la donnée récupérée, sous forme d'un tableau associatif
     */
    public function queryOne(string $req, array $params)
    {
        $data=null;
        $r = $this->pdo->prepare($req);
        $r->execute($params);
        $data = $r->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    /**
     * Effectue une requête renvoyant un ensemble de valeurs
     * @param string $req la requête, éventuellement paramétrée
     * @param array $params le tableau des paramètres
     * @return mixed les données, sous forme d'un tableau
     */
    public function queryAll(string $req, array $params)
    {
        $data=null;
        $r = $this->pdo->prepare($req);
        $r->execute($params);
        $data = $r->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    /**
     * Execute une requête SQL sans retour
     * @param string $req la requête (paramétrée)
     * @param array $params le tableau des paramètres
     */
    public function execute(string $req, array $params)
    {
        $r = $this->pdo->prepare($req);
        $r->execute($params);
    }
}