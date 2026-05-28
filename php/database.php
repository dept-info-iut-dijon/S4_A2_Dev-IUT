<?php
/**
 * Connexion à la base de données
 */

function gererErreur(Throwable $exception) {
    error_log('[erreur] ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur interne du serveur']);
    exit;
}
set_exception_handler('gererErreur');

function chargerEnvironnement($chemin) {
    if (!file_exists($chemin)) return;
    $lignes = file($chemin, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lignes as $ligne) {
        if ($ligne[0] === '#') continue;
        $parties = explode('=', $ligne, 2);
        if (count($parties) === 2) {
            $_ENV[trim($parties[0])] = trim($parties[1]);
        }
    }
}

chargerEnvironnement(__DIR__ . '/../.env');

class Database
{
    private $pdo;

    public function __construct()
    {
        $hote = isset($_ENV['DB_HOST']) ? $_ENV['DB_HOST'] : 'localhost';
        $base = isset($_ENV['DB_NAME']) ? $_ENV['DB_NAME'] : 'softs';
        $utilisateur = isset($_ENV['DB_USER']) ? $_ENV['DB_USER'] : 'root';
        $motDePasse = isset($_ENV['DB_PASS']) ? $_ENV['DB_PASS'] : '';

        try {
            $this->pdo = new PDO(
                "mysql:host=$hote;dbname=$base",
                $utilisateur,
                $motDePasse,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
            $this->pdo->exec("SET AUTOCOMMIT=1;");
        }
        catch (PDOException $exception) {
            error_log('[database] Connexion échouée : ' . $exception->getMessage());
            throw $exception;
        }
    }

    /**
     * Retourne une seule ligne résultat
     */
    public function lireUn(string $requete, array $parametres)
    {
        $declaration = $this->pdo->prepare($requete);
        $declaration->execute($parametres);
        return $declaration->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Retourne toutes les lignes résultat
     */
    public function lireTous(string $requete, array $parametres)
    {
        $declaration = $this->pdo->prepare($requete);
        $declaration->execute($parametres);
        return $declaration->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Exécute une requête sans retour (INSERT, UPDATE, DELETE)
     */
    public function executer(string $requete, array $parametres)
    {
        $declaration = $this->pdo->prepare($requete);
        $declaration->execute($parametres);
    }
}
