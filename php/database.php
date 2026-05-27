<?php
/**
 * Connexion à la base de données
 */

function gestionErreur(Throwable $e) {
    error_log('[erreur] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur interne du serveur']);
    exit;
}
set_exception_handler('gestionErreur');

function chargerEnv($chemin) {
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

chargerEnv(__DIR__ . '/../.env');

class Database
{
    private $pdo;

    public function __construct()
    {
        $host = isset($_ENV['DB_HOST']) ? $_ENV['DB_HOST'] : 'localhost';
        $base = isset($_ENV['DB_NAME']) ? $_ENV['DB_NAME'] : 'softs';
        $user = isset($_ENV['DB_USER']) ? $_ENV['DB_USER'] : 'root';
        $pass = isset($_ENV['DB_PASS']) ? $_ENV['DB_PASS'] : '';

        try {
            $this->pdo = new PDO(
                "mysql:host=$host;dbname=$base",
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
            $this->pdo->exec("SET AUTOCOMMIT=1;");
        }
        catch (PDOException $ex) {
            // A7 : on logue l'erreur au lieu de l'ignorer
            error_log('[database] Connexion échouée : ' . $ex->getMessage());
            throw $ex;
        }
    }

    /**
     * Retourne une seule ligne résultat
     */
    public function queryOne(string $req, array $params)
    {
        $r = $this->pdo->prepare($req);
        $r->execute($params);
        return $r->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Retourne toutes les lignes résultat
     */
    public function queryAll(string $req, array $params)
    {
        $r = $this->pdo->prepare($req);
        $r->execute($params);
        return $r->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Exécute une requête sans retour (INSERT, UPDATE, DELETE)
     */
    public function execute(string $req, array $params)
    {
        $r = $this->pdo->prepare($req);
        $r->execute($params);
    }
}
