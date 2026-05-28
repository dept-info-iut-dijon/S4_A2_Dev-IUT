# Softs

Application interne au département informatique pour gérer les logiciels installés et utilisables par les étudiants.

L'application permet notamment aux étudiants d'installer la version exacte utilisée à l'IUT sur leur ordinateur personnel, en fournissant :

* une archive contenant l'assistant d'installation
* un tutoriel au format PDF
* si existe, une archive contenant une version portable de l'application
* si nécessaire, un numéro de série ou une clé d'activation


## Fonctionnalités et rôles utilisateurs

L'application distingue trois rôles utilisateurs :

- **Étudiant** : consultation de la liste des logiciels, téléchargement des archives et tutoriels, copie du numéro de série.
- **Enseignant** : mêmes droits que l'étudiant, plus la possibilité de proposer un nouveau logiciel soumis à validation.
- **Administrateur** : mêmes droits que l'enseignant, plus la possibilité de modifier et supprimer des fiches logiciel.

Les fonctionnalités principales sont :
- Connexion avec authentification par login et mot de passe hashé
- Liste des logiciels filtrables par filière, matière, nom ou portabilité
- Fiche détaillée par logiciel avec description, fichiers et numéro de série
- Éditeur de fiche logiciel avec gestion des filières et matières associées
- Téléversement de fichiers (archive, tutoriel, version portable, image)

## Plateformes d'exécution

L'application nécessite simplement un navigateur récent pour le client, avec JavaScript d'activé.
Pour le serveur, il est nécessaire d'avoir un interpréteur PHP (8.1 ou supérieur) et une base de données MySQL (8.0 ou supérieur, MariaDB 10.4 compatible), plus un serveur web Apache 2.4 ou supérieur.
Un espace de stockage suffisant pour les fichiers téléversés, avec les droits d'écriture par le serveur web, est nécessaire.

## Technologies utilisées

Côté serveur : PHP 8.1, MySQL 8.0 / MariaDB 10.4
Coté client : HTML 5 / CSS 3 / TypeScript (transpilé en ES6) 


## Environnement de développement

- **IDE** : Visual Studio Code
- **Node.js** : 18.x ou supérieur (requis pour la compilation TypeScript)
- **TypeScript** : 5.x — transpilé en ES6 via `tsc`
- **XAMPP** : 8.2 (Apache 2.4 + MariaDB 10.4 + PHP 8.1)
- **Navigateur de test** : Chrome / Edge récent

Pour compiler le TypeScript :
```bash
tsc
```


## Architecture de l'application

L'application suit une architecture en couches séparées côté client et côté serveur. Les vues JavaScript communiquent avec le serveur via des appels AJAX vers les scripts PHP, qui retournent des données au format JSON.
php/ — Scripts serveur PHP. Points d'entrée API, DAOs, authentification, gestion des uploads.

js/ : Code client TypeScript transpilé en ES6. Divisé en trois sous-dossiers :

js/models/ : Interfaces TypeScript représentant les entités métier (Logiciel, Filiere, Matiere, Utilisateur).
js/sgbd/ : DAO client. Appels AJAX vers les endpoints PHP, désérialisation JSON.
js/views/ : Composants d'affichage. Rendu de la liste, de la fiche détail, de l'éditeur, du header.
css/ : Feuilles de style de l'application.

files/ : Fichiers téléversés : archives d'installation, tutoriels PDF, versions portables, images. Écrit par upload.php, référencé par les fiches logiciel.

install/ : Script SQL d'initialisation de la base de données.

## Dépendances

### Côté client (CDN)
- **Bootstrap 4.3.1** mise en page et composants UI
- **jQuery 3.3.1**  manipulation DOM et appels AJAX
- **Font Awesome 6.5.1** icônes (contact.html uniquement)

### Côté client (local)
- **jQuery** — version locale dans `js/lib/jquery.js`

### Côté développement (npm)
Voir `package.json` pour la liste complète.

## Installation

Créer une base de données MySQL (choisir le nom, par exemple "softs") sur votre serveur
Importer le fichier install/init_db.sql qui contient la structure de la base et des données exemple (attention : les fichiers téléversés ne sont pas fournis par la base de test et donneront donc lieu à des erreurs 404)
L'installation crée 2 utilisateurs de type enseignant : admin (mot de passe "admin") et prof (mot de passe "toto").
Editez le fichier php/database.php et configurez avec les valeurs de votre base.
Recopiez les fichiers (en respectant l'arborescence) sur votre serveur.












