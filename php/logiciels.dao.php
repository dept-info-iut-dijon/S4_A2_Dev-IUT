<?php

require_once("database.php");
require_once("constants.php");

class LogicielsDao
{
    private Database $database;

    /**
     * Initialise l'objet
     * @param Database $database la base de données liée
     */
    public function __construct(Database $database)
    {
        $this->database = $database;
    }

    private function listerParRequete(string $requete, array $parametres)
    {
        $donnees = $this->database->lireTous($requete, $parametres);
        return $donnees;
    }

    private function construireRequeteBase()
    {
        $requete = "SELECT Logiciel.ID as id, Logiciel.nom as nom, 
        Logiciel.version as version, Logiciel.urlsetup as urlSetup, 
        Logiciel.urltuto as urlTuto, Logiciel.comment as comment, 
        Logiciel.type as type, Logiciel.visible as visible,
        Logiciel.urlport as urlPort, Logiciel.urlImage as urlImage, 
        Logiciel.obsolete as obsolete, Logiciel.Utilisateurlogin as utilisateur,
        Logiciel.date_ajout as date_ajout, Logiciel.numero_serie as numero_serie FROM Logiciel ";
        return $requete;
    }

    private function filtrePortable()
    {
        return "((urlPort is not null) and (urlPort<>''))";
    }

    private function filtreObsolete()
    {
        return "obsolete=0";
    }

    /**
     * Liste tous les logiciels de la base
     * @param boolean $portable indique si l'on souhaite ne garder que les portables ou non
     * @param boolean $cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @return mixed un tableau associatif avec le retour de la requête
     */
    public function listerTous($portable, $cacherObsolete)
    {
        $requete = $this->construireRequeteBase() . "WHERE 1=1 ";
        if ($portable) {
            $requete = $requete . "AND " . $this->filtrePortable();
        }
        if ($cacherObsolete) {
            $requete = $requete . " AND " . $this->filtreObsolete();
        }
        $requete = $requete . " ORDER BY Logiciel.nom;";
        return $this->listerParRequete($requete, array());
    }

    /**
     * Liste les logiciels liés à une filière
     * @param mixed $id la clé primaire de la filière
     * @param boolean $portable indique si l'on doit ne conserver que les logiciels portables ou non
     * @param boolean $cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @return mixed un tableau associatif avec le retour de la requête
     */
    public function listerParFiliere($id, $portable, $cacherObsolete)
    {
        $requete = $this->construireRequeteBase() . "JOIN Logiciel_Filiere ON Logiciel_Filiere.LogicielID=Logiciel.ID WHERE Logiciel_Filiere.FiliereID=? ";
        if ($portable) {
            $requete = $requete . " AND " . $this->filtrePortable();
        }
        if ($cacherObsolete) {
            $requete = $requete . " AND " . $this->filtreObsolete();
        }
        $requete = $requete . " ORDER BY Logiciel.nom;";
        return $this->listerParRequete($requete, array($id));
    }

    /**
     * Liste les logiciels liés à une matière
     * @param mixed $id la clé primaire de la matière
     * @param boolean $portable indique si l'on filtre sur les portables
     * @param boolean $cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @return mixed un tableau associatif avec le retour de la requête
     */
    public function listerParMatiere($id, $portable, $cacherObsolete)
    {
        $requete = $this->construireRequeteBase() . "JOIN Logiciel_Matiere ON Logiciel_Matiere.LogicielID=Logiciel.ID WHERE Logiciel_Matiere.MatiereID=? ";
        if ($portable) {
            $requete = $requete . " AND " . $this->filtrePortable();
        }
        if ($cacherObsolete) {
            $requete = $requete . " AND " . $this->filtreObsolete();
        }
        $requete = $requete . " ORDER BY Logiciel.nom;";
        return $this->listerParRequete($requete, array($id));
    }

    /**
     * Liste les logiciels dont le nom contient la chaîne fournie
     * @param string $nom le nom partiel
     * @param boolean $portable indique si l'on filtre sur les portables
     * @param boolean $cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @return mixed un tableau associatif avec le retour de la requête
     */
    public function listerParNom($nom, $portable, $cacherObsolete)
    {
        $requete = $this->construireRequeteBase() . "WHERE Logiciel.nom LIKE ? ";
        if ($portable) {
            $requete = $requete . " AND " . $this->filtrePortable();
        }
        if ($cacherObsolete) {
            $requete = $requete . " AND " . $this->filtreObsolete();
        }
        $requete = $requete . " ORDER BY Logiciel.nom, Logiciel.version;";
        return $this->listerParRequete($requete, array("%$nom%"));
    }

    /**
     * Liste le logiciel répondant à l'ID fourni
     * @param int $id identifiant du logiciel
     * @return mixed un tableau associatif avec le retour de la requête
     */
    public function listerParId($id)
    {
        $requete = $this->construireRequeteBase() . "WHERE id=? ORDER BY Logiciel.nom, Logiciel.version";
        return $this->listerParRequete($requete, array("$id"));
    }

    /**
     * Modifie le logiciel dans la base de données
     * @param mixed $logiciel le logiciel sous forme d'un tableau associatif
     */
    public function mettreAJourLogiciel($logiciel)
    {
        $requete = "UPDATE Logiciel SET nom=?, version=?, urlSetup=?, urlTuto=?, comment=?, type=?, urlPort=?, urlImage=?, obsolete=?, numero_serie=? WHERE id=?";
        $this->database->executer($requete, array(
            $logiciel["nom"], $logiciel["version"], $logiciel["urlSetup"], $logiciel["urlTuto"],
            $logiciel["comment"], $logiciel["type"], $logiciel["urlPort"], $logiciel["urlImage"],
            $logiciel["obsolete"], $logiciel["numero_serie"], $logiciel["id"]
        ));
    }

    /**
     * Ajoute un logiciel à la base de données
     * @param mixed $logiciel le logiciel sous forme d'un tableau associatif
     * @return mixed un tableau contenant l'AUTO_INCREMENT du logiciel inséré
     */
    public function ajouterLogiciel($logiciel)
    {
        $requeteAutoIncrement = "SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_NAME=?;";
        $nomBase       = isset($_ENV['DB_NAME']) ? $_ENV['DB_NAME'] : 'softs';
        $autoIncrement = $this->database->lireUn($requeteAutoIncrement, [$nomBase, "Logiciel"]);
        $requeteInsert = "INSERT INTO Logiciel(id, nom, version, urlSetup, urlTuto, urlPort, comment, type, visible, urlImage, obsolete, Utilisateurlogin, numero_serie) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);";
        $this->database->executer($requeteInsert, [
            $autoIncrement["AUTO_INCREMENT"], $logiciel["nom"], $logiciel["version"],
            $logiciel["urlSetup"], $logiciel["urlTuto"], $logiciel["urlPort"],
            $logiciel["comment"], $logiciel["type"], 0, $logiciel["urlImage"],
            $logiciel["obsolete"], $logiciel["user"], $logiciel["numero_serie"]
        ]);
        return $autoIncrement;
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
        return $this->pagineResult($countReq, array(), $this->selectBaseListe() . $where, array(), $page, $limite);
    }

    public function listByFilierePagine($id, $portable, $cacherObs, $page, $limite)
    {
        $join = "JOIN Logiciel_Filiere ON Logiciel_Filiere.LogicielID=Logiciel.ID WHERE Logiciel_Filiere.FiliereID=? ";
        if ($portable) $join .= "AND " . $this->FiltrePortable() . " ";
        if ($cacherObs) $join .= "AND " . $this->FiltreObsolete() . " ";
        $countReq = "SELECT COUNT(*) as total FROM Logiciel " . $join;
        return $this->pagineResult($countReq, array($id), $this->selectBaseListe() . $join, array($id), $page, $limite);
    }

    public function listByMatierePagine($id, $portable, $cacherObs, $page, $limite)
    {
        $join = "JOIN Logiciel_Matiere ON Logiciel_Matiere.LogicielID=Logiciel.ID WHERE Logiciel_Matiere.MatiereID=? ";
        if ($portable) $join .= "AND " . $this->FiltrePortable() . " ";
        if ($cacherObs) $join .= "AND " . $this->FiltreObsolete() . " ";
        $countReq = "SELECT COUNT(*) as total FROM Logiciel " . $join;
        return $this->pagineResult($countReq, array($id), $this->selectBaseListe() . $join, array($id), $page, $limite);
    }

    public function listByNamePagine($nom, $portable, $cacherObs, $page, $limite)
    {
        $where = "WHERE Logiciel.nom LIKE ? ";
        if ($portable) $where .= "AND " . $this->FiltrePortable() . " ";
        if ($cacherObs) $where .= "AND " . $this->FiltreObsolete() . " ";
        $countReq = "SELECT COUNT(*) as total FROM Logiciel " . $where;
        return $this->pagineResult($countReq, array("%$nom%"), $this->selectBaseListe() . $where, array("%$nom%"), $page, $limite);
    }

    /**
     * Supprime le logiciel de la base de données
     * @param mixed $logiciel le logiciel à supprimer, sous forme d'un tableau associatif
     */
    public function supprimerLogiciel($logiciel)
    {
        $id = $logiciel["id"];
        $this->database->executer("DELETE FROM Logiciel_Filiere WHERE LogicielID=?;", [$id]);
        $this->database->executer("DELETE FROM Logiciel_Matiere WHERE LogicielID=?;", [$id]);
        $this->database->executer("DELETE FROM Logiciel WHERE ID=?;",                [$id]);
    }
}
