# Softs

Application interne au département informatique pour gérer les logiciels installés et utilisables par les étudiants.

L'application permet notamment aux étudiants d'installer la version exacte utilisée à l'IUT sur leur ordinateur personnel, en fournissant :

* une archive contenant l'assistant d'installation
* un tutoriel au format PDF
* si existe, une archive contenant une version portable de l'application
* si nécessaire, un numéro de série ou une clé d'activation

## Plateformes d'exécution

L'application nécessite simplement un navigateur récent pour le client, avec JavaScript d'activé.
Pour le serveur, il est nécessaire d'avoir un interpréteur PHP (7 ou supérieur) et une base de données MySql (5 ou supérieur), plus un serveur web (Apache, IIS, etc.) compatible.
Un espace de stockage suffisant pour les fichiers téléversés, avec les droits d'écriture par le serveur web, est nécessaire.

## Technologies utilisées

Coté serveur : PHP 7, MySQL 5
Coté client : HTML 5 / CSS 3 / TypeScript (transpilé en ES6) 

## Installation

Créer une base de données MySQL (choisir le nom, par exemple "softs") sur votre serveur
Importer le fichier install/init_db.sql qui contient la structure de la base et des données exemple (attention : les fichiers téléversés ne sont pas fournis par la base de test et donneront donc lieu à des erreurs 404)
L'installation crée 2 utilisateurs de type enseignant : admin (mot de passe "admin") et prof (mot de passe "toto").
Editez le fichier php/database.php et configurez avec les valeurs de votre base.
Recopiez les fichiers (en respectant l'arborescence) sur votre serveur.












