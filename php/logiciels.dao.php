<?php

require_once("database.php");

class LogicielsDao
{
    private Database $bdd ;

    /**
     * Initialise l'objet
     * @param Database $bdd la base de données liée
     */
    public function __construct(Database $bdd)
    {
        $this->bdd = $bdd;
    }

    private function listByReq(string $req, array $params )
    {
        $data = $this->bdd->queryAll($req,$params);
        return $data;
    }

    private function selectBase()
    {
        $req = "SELECT Logiciel.ID as id, Logiciel.nom as nom, 
        Logiciel.version as version, Logiciel.urlsetup as urlSetup, 
        Logiciel.urltuto as urlTuto, Logiciel.comment as comment, 
        Logiciel.type as type, Logiciel.visible as visible, 
        Logiciel.urlport as urlPort, Logiciel.urlImage as urlImage, 
        Logiciel.obsolete as obsolete, Logiciel.Utilisateurlogin as utilisateur,
        Logiciel.date_ajout as date_ajout, Logiciel.numero_serie as numero_serie,
        Utilisateur.nom as utilisateurNom, 
        Utilisateur.statut as utilisateurStatut, 
        Utilisateur.departement as utilisateurDepartement
        FROM Logiciel 
        LEFT JOIN Utilisateur ON Utilisateur.login = Logiciel.Utilisateurlogin ";
        return $req;
    }

    private function FiltrePortable()
    {
        return "((urlPort is not null) and (urlPort<>''))";
    }
    private function FiltreObsolete()
    {
        return "obsolete=0";
    }

    /**
     * Liste tous les logiciels de la base
     * @return mixed un tableau associatif avec le retour de la requête
     * @param boolean $portable indique si l'on souhaite ne garder que les portables ou non
     * @param boolean $cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     */
    public function listAll($portable, $cacherObs)
    {
        $req = $this->selectBase()."WHERE 1=1 ";
        if($portable)
        {
            $req = $req."AND  ".$this->FiltrePortable();
        }
        if($cacherObs)
        {
            $req = $req." AND ".$this->FiltreObsolete();
        }
        $req=$req." ORDER BY Logiciel.nom;";
        return $this->listByReq($req,array());
    }

    /**
     * Liste les logiciels liés à une filière
     * @param mixed $id la clé primaire de la filière
     * @param boolean $portable indique si l'on doit ne conserver que les logiciels portables ou non
     * @return mixed un tableau associatif avec le retour de la requête
     * @param boolean $cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     */
    public function listByFiliere($id, $portable, $cacherObsolete)
    {
        $req = $this->selectBase()."JOIN Logiciel_Filiere ON Logiciel_Filiere.LogicielID=Logiciel.ID WHERE Logiciel_Filiere.FiliereID=? ";
        if($portable)
        {
            $req = $req." AND ".$this->FiltrePortable();
        }
        if($cacherObsolete)
        {
            $req = $req." AND ".$this->FiltreObsolete();
        }
        $req = $req." ORDER BY Logiciel.nom;";
        return $this->listByReq($req,array($id));
    }

    /**
     * Liste les logiciels liés à une matière
     * @param mixed $id la clé primaire de la matière
     * @param boolean $portable indique si l'on filtre sur les portables
     * @param boolean $cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @return mixed un tableau associatif avec le retour de la requête
     */
    public function listByMatiere($id, $portable, $cacherObsolete)
    {
        $req = $this->selectBase()."JOIN Logiciel_Matiere ON Logiciel_Matiere.LogicielID=Logiciel.ID WHERE Logiciel_Matiere.MatiereID=? ";
        if($portable)
            $req = $req." AND ".$this->FiltrePortable();
        if($cacherObsolete)
            $req = $req." AND ".$this->FiltreObsolete();
        $req = $req." ORDER BY Logiciel.nom;";
        return $this->listByReq($req, array($id));
    }

    /**
     * Liste les logiciels dont le nom contient la chaîne fournie
     * @param string $nom le nom partiel
     * @param boolean $portable indique si l'on filtre sur les portables
     * @param boolean $cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @return mixed un tableau associatif avec le retour de la requête
     */
    public function listByName($nom, $portable, $cacherObsolete)
    {
        $req = $this->selectBase()."WHERE Logiciel.nom LIKE ? ";
        if($portable)
            $req = $req." AND ".$this->FiltrePortable();
        if($cacherObsolete)
            $req = $req." AND ".$this->FiltreObsolete();
        $req = $req." ORDER BY Logiciel.nom, Logiciel.version;";
        return $this->listByReq($req,array("%$nom%"));
    }

    /**
     * Liste le logiciel répondant à l'ID fournie
     * @param number $id
     * @return mixed un tableau associatif avec le retour de la requête
     */
    public function listById($id)
    {
        $req = $this->selectBase()."WHERE id=? ORDER BY Logiciel.nom, Logiciel.version";
        return $this->listByReq($req,array("$id"));
    }

    /**
     * Modifie le logiciel dans la BDD
     * @param mixed $log le logiciel sous forme d'un tableau associatif
     */
    public function majLogiciel($log)
    {
        $req = "UPDATE Logiciel SET nom=?, version=?, urlSetup=?, urlTuto=?, comment=?, type=?, urlPort=?, urlImage=?, obsolete=?,numero_serie=?  WHERE id=?";
        $this->bdd->execute($req,array($log["nom"],$log["version"],$log["urlSetup"],$log["urlTuto"],$log["comment"],$log["type"],$log["urlPort"],$log["urlImage"],$log["obsolete"],$log["numero_serie"],$log["id"]));
    }

    /**
     * AJoute un logiciel à la base
     * @param mixed $log le logiciel sous forme d'un tableau associatif
     * @return mixed un objet contenant un champ id qui contient un champ AUTO_INCREMENT, contenant l'id du logiciel
     */
    public function addLogiciel($log)
    {
        $req = "SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_NAME=?;";
        if(constant("mode_dev"))
            $bdname="softs";
        else
            $bdname="softs_dev";
        $val = $this->bdd->queryOne($req,["$bdname","Logiciel"]);
        $req = "INSERT INTO Logiciel(id,nom,version, urlSetup, urlTuto, urlPort,comment,type,visible, urlImage, obsolete, Utilisateurlogin, numero_serie) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);";
        $this->bdd->execute($req,[$val["id"],$log["nom"],$log["version"],$log["urlSetup"],$log["urlTuto"],$log["urlPort"],$log["comment"],$log["type"],0,$log["urlImage"], $log["obsolete"],$log["user"],$log["numero_serie"]]);
        return $val;
    }

    private function pagineResult(string $countReq, array $countParams, string $dataReq, array $dataParams, int $page, int $limite): array
    {
        $total = intval($this->bdd->queryOne($countReq, $countParams)["total"]);
        $offset = ($page - 1) * $limite;
        $logiciels = $this->bdd->queryAll($dataReq . " ORDER BY Logiciel.nom LIMIT " . intval($limite) . " OFFSET " . intval($offset) . ";", $dataParams);
        return array("logiciels" => $logiciels, "total" => $total, "page" => $page, "limite" => $limite);
    }

    public function listAllPagine($portable, $cacherObs, $page, $limite)
    {
        $where = "WHERE 1=1 ";
        if ($portable) $where .= "AND " . $this->FiltrePortable() . " ";
        if ($cacherObs) $where .= "AND " . $this->FiltreObsolete() . " ";
        $countReq = "SELECT COUNT(*) as total FROM Logiciel " . $where;
        return $this->pagineResult($countReq, array(), $this->selectBase() . $where, array(), $page, $limite);
    }

    public function listByFilierePagine($id, $portable, $cacherObs, $page, $limite)
    {
        $join = "JOIN Logiciel_Filiere ON Logiciel_Filiere.LogicielID=Logiciel.ID WHERE Logiciel_Filiere.FiliereID=? ";
        if ($portable) $join .= "AND " . $this->FiltrePortable() . " ";
        if ($cacherObs) $join .= "AND " . $this->FiltreObsolete() . " ";
        $countReq = "SELECT COUNT(*) as total FROM Logiciel " . $join;
        return $this->pagineResult($countReq, array($id), $this->selectBase() . $join, array($id), $page, $limite);
    }

    public function listByMatierePagine($id, $portable, $cacherObs, $page, $limite)
    {
        $join = "JOIN Logiciel_Matiere ON Logiciel_Matiere.LogicielID=Logiciel.ID WHERE Logiciel_Matiere.MatiereID=? ";
        if ($portable) $join .= "AND " . $this->FiltrePortable() . " ";
        if ($cacherObs) $join .= "AND " . $this->FiltreObsolete() . " ";
        $countReq = "SELECT COUNT(*) as total FROM Logiciel " . $join;
        return $this->pagineResult($countReq, array($id), $this->selectBase() . $join, array($id), $page, $limite);
    }

    public function listByNamePagine($nom, $portable, $cacherObs, $page, $limite)
    {
        $where = "WHERE Logiciel.nom LIKE ? ";
        if ($portable) $where .= "AND " . $this->FiltrePortable() . " ";
        if ($cacherObs) $where .= "AND " . $this->FiltreObsolete() . " ";
        $countReq = "SELECT COUNT(*) as total FROM Logiciel " . $where;
        return $this->pagineResult($countReq, array("%$nom%"), $this->selectBase() . $where, array("%$nom%"), $page, $limite);
    }

    /**
     * Supprime le logiciel de la BDD
     * @param mixed $log le logiciel à supprimer, sous forme d'un [] associatif
     */
    public function delLogiciel($log)
    {
        $id = $log["id"];
        $req = "DELETE FROM Logiciel_Filiere WHERE LogicielID=?;";
        $this->bdd->execute($req,[$id]);
        $req = "DELETE FROM Logiciel_Matiere WHERE LogicielID=?;";
        $this->bdd->execute($req,[$id]);
        $req = "DELETE FROM Logiciel WHERE ID=?;";
        $this->bdd->execute($req,[$id]);
    }
}

?>

