-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 30 mars 2026 à 15:00
-- Version du serveur : 8.0.42
-- Version de PHP : 8.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS softs CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE softs;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


-- --------------------------------------------------------

--
-- Structure de la table `filiere`
--

CREATE TABLE `filiere` (
  `ID` int NOT NULL,
  `nom` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `filiere`
--

INSERT INTO `filiere` (`ID`, `nom`) VALUES
(1, 'BUT INFO 1A'),
(2, 'BUT INFO 2A'),
(5, 'BUT INFO 3A');

-- --------------------------------------------------------

--
-- Structure de la table `logiciel`
--

CREATE TABLE `logiciel` (
  `ID` int NOT NULL,
  `nom` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `version` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `urlsetup` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `urltuto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `comment` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `visible` int NOT NULL,
  `Utilisateurlogin` varchar(16) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(128) COLLATE utf8mb4_general_ci NOT NULL,
  `urlPort` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `urlImage` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `obsolete` int NOT NULL DEFAULT '0',
  `date_ajout` date NOT NULL,
  `numero_serie` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `logiciel`
--

INSERT INTO `logiciel` (`ID`, `nom`, `version`, `urlsetup`, `urltuto`, `comment`, `visible`, `Utilisateurlogin`, `type`, `urlPort`, `urlImage`, `obsolete`, `date_ajout`, `numero_serie`) VALUES
(3, 'Visual Studio', '2022', 'https://portal.azure.com', 'files/vs.pdf', 'Visual Studio 2022 est un EDI spécialisé pour l\'environnement Windows, mais il est également utilisable pour Android, Linux, macOS, iOS... Nombreuses possibilités d\'extension, nombreux langages disponibles...', 1, 'aguidet', 'EDI', '', 'files/vs.jpg', 0, '2022-06-01', NULL),
(5, 'Anaconda', '2023.03.01', 'files/anaconda.zip', 'files/anaconda.pdf', 'Anaconda est un ensemble d\'outils pour le calcul, basé sur Python et de nombreuses bibliothèques.', 1, 'aguidet', 'EDI', '', '', 0, '2022-06-01', NULL),
(6, 'Android Studio', '2022.2.1', 'files/android.zip', 'files/astudio.pdf', 'Android Studio est un EDI pour le développement d\'applications pour Android.', 1, 'aguidet', 'EDI', '', 'files/astudio.PNG', 0, '2022-06-01', NULL),
(7, 'Lazarus', '2', 'files/lazarus.zip', 'files/lazarus.pdf', 'Lazarus est un EDI permettant d\'utiliser la version \"free\" du langage Pascal. Il contient en outre un framework applicatif graphique (LCL) compatible avec Delphi (Borland).', 1, 'aguidet', 'EDI', 'files/LazarusPortable.zip', 'files/lazarus.jpg', 1, '2022-06-01', ''),
(11, 'BaseX', '9.7.2', 'files/basex.zip', 'files/basex.pdf', 'Outil XML', 1, 'aguidet', 'Editeur XML', 'files/baseXport.zip', '', 1, '2022-06-01', NULL),
(12, 'Cordova', '10', '', 'files/cordova.pdf', 'Ensemble d\'outils pour le développement mobile multiplateforme (Android, iOS, Windows UWP) en utilisant les langages du web (HTML, CSS, JavaScript). Nécessite certains prérequis (Node.JS, Android SDK, SDK Windows 10…).', 1, 'aguidet', 'Développement mobile', '', '', 1, '2022-06-01', NULL),
(13, 'Doxygen', '1.9.7', 'files/doxygen.zip', 'files/doxygen.pdf', 'Générateur de documentation', 1, 'aguidet', 'Utilitaire de développement', 'files/doxygen_portable.zip', '', 0, '2022-06-01', NULL),
(14, 'Flutter', '3.0', 'files/flutter.zip', 'files/flutter.pdf', 'Développement mobile multiplateforme (langage Dart)', 1, 'aguidet', 'Framework mobile', '', '', 1, '2022-06-01', NULL),
(15, 'Freeplane', '1.10.2', 'files/freeplane.zip', 'files/freeplane.pdf', 'Cartes mentales', 1, 'aguidet', 'Carte mentale', '', '', 1, '2022-06-01', NULL),
(16, 'Git', '2.41.1', 'files/git4win.zip', 'files/git4win.pdf', 'Outil de suivi de version', 1, 'aguidet', 'Suivi de versions', 'files/gitportable.zip', 'files/git.png', 0, '2022-06-01', NULL),
(17, 'Hex editor neo', '6.54', 'files/free-hex-editor-neo.zip', 'files/hex_editor.pdf', 'éditeur hexa', 1, 'aguidet', 'Editeur hexadécimal', '', '', 1, '2022-06-01', NULL),
(18, 'IntelliJ IDEA education', '2022', 'files/idea.zip', 'files/idea.pdf', 'EDI Java. Version éducation, gratuite (la version standard est payante).', 1, 'aguidet', 'EDI Java', '', '', 0, '2022-06-01', NULL),
(19, 'Java JDK', '17', 'files/jdk-17.zip', 'files/jdk12.pdf', 'Un Java Development Kit est indispensable pour le développement Java', 1, 'aguidet', 'Kit de développement Java Standard', '', 'files/java.jpg', 0, '2022-06-01', NULL),
(21, 'MongoDB', '', '', '', 'Serveur NoSQL, en version portable.', 1, 'aguidet', 'Serveur de base de données', 'files/mongodb.zip', '', 0, '2022-06-01', ''),
(22, 'MonoGame', '3.7', '', 'files/monogame.pdf', 'Bibliothèque multiplateforme (Windows, Android, iOS, Xbox, Switch…) pour création de jeux vidéos en C#/.NET', 1, 'aguidet', 'Bibiliothèque', '', '', 1, '2022-06-01', NULL),
(23, 'MS Office', '2021', '', 'files/office365.pdf', 'Suite bureautique complète, comprenant traitement de texte (Word), tableur (Excel), PréAO (Powerpoint), PAO (Publisher), courrier (Outlook) et bases de données (Access).', 1, 'aguidet', 'Bureautique', '', 'files/office.png', 0, '2022-06-01', NULL),
(24, 'MySQL', '8.0.33', 'files/mysql.zip', 'files/mysql.pdf', 'Ensemble d\'outils pour base de données MySQL (serveur, workbench, connecteurs, etc.).\nLa version portable ne contient que le MySQL Workbench (le client). Pour un serveur portable, voir Uwamp.', 1, 'aguidet', 'SGBDR', 'files/MySQLWorkbenchPortable.zip', 'files/mysql.png', 0, '2022-06-01', NULL),
(25, 'Netbeans', '8.2', 'files/netbeans8.zip', 'files/netbeans.pdf', 'Environnement de développement intégré, spécialisé dans le langage Java mais pouvant également servir pour HTML5/JavaScript, PHP, ou d\'autres (avec plugins). Contient Java SE et Java EE.', 1, 'aguidet', 'EDI Java', 'files/NetbeansPortable.zip', '', 1, '2022-06-01', NULL),
(26, 'Node.JS', '18.16', 'files/node.zip', 'files/node.pdf', 'Serveur d\'exécution Javascript.', 1, 'aguidet', 'Environnement d\'exécution JS ', '', 'files/nodejs.png', 0, '2022-06-01', NULL),
(27, 'Octave', '4.4.0', 'files/octave.zip', '', 'Logiciel calcul numérique', 1, 'aguidet', 'Calcul numérique', '', '', 1, '2022-06-01', NULL),
(28, 'Open Cobol IDE', '4.7.3', 'files/opencobol.zip', 'files/opencobol.pdf', 'Environnement de développement intégré pour le langage Cobol.', 1, 'aguidet', 'EDI Cobol', 'files/OpenCobolIDE.zip', '', 1, '2022-06-01', NULL),
(29, 'OpenCV', '', 'files/opencv.zip', 'files/opencv.pdf', 'OpenCV (pour Open Computer Vision) est une bibliothèque graphique libre, initialement développée par Intel, spécialisée dans le traitement d\'images en temps réel.', 1, 'aguidet', 'Bibiliothèque', '', '', 1, '2022-06-01', NULL),
(30, 'Oracle instant client', '19.11', 'files/oracle.zip', 'files/oracle.pdf', 'Client pour la base de données Oracle; contient également les outils comme SQL*Plus', 1, 'aguidet', 'Utilitaire de bases de données', '', '', 1, '2022-06-01', NULL),
(31, 'Pencil', '3.1', 'files/pencil.zip', 'files/pencil.pdf', 'Pencil permet d\'éditer simplement des maquettes d\'IHM, soit en mode \"fil de fer\" soit en mode \"réel\". Des modèles pour le web, le développement mobile (Android et iOS) et le bureau (windows) sont fournis.', 1, 'aguidet', 'Editeur de maquettes', NULL, NULL, 0, '2022-06-01', NULL),
(32, 'PostgreSQL', '', 'files/pgsql.zip', '#', 'Ensemble d\'outils pour PostgreSQL, notamment le client PGAdmin, l\'installateur standard PostgreSQL, une version portable du serveur.', 1, 'aguidet', 'Utilitaire de bases de données', '', '', 1, '2022-06-01', NULL),
(33, 'Project', '2021', 'https://portal.azure.com', 'https://iutdijon.u-bourgogne.fr/siav/acces-a-microsoft-azure-dev-tools-for-teaching-de-liut-de-dijon-auxerre/', 'Gestion de projet', 1, 'aguidet', 'Gestion de projet', '', '', 0, '2022-06-01', NULL),
(34, 'Protégé', '5.5', 'files/protege.zip', 'files/protege.pdf', 'Outil de web sémantique', 1, 'aguidet', 'Editeur d\'ontologies', '', '', 1, '2022-06-01', NULL),
(35, 'Qt', '6.3.2', 'files/qt.zip', 'files/qt.pdf', 'Qt est un framework multiplateforme (Windows, macOS, iOS, Android, Linux…) permettant de développer, en C++ notamment, des applications complètes. L\'EDI QtCreator et le compilateur MinGW sont compris.', 1, 'aguidet', 'Framework et EDI', '', 'files/qt-logo.svg', 1, '2022-06-01', NULL),
(37, 'Studio 3T', '1.4.3', 'files/studio-3t-x64.zip', '#', 'Client pour MongoDB (ancien Robot3T)', 1, 'aguidet', 'Client SGBD ', '', '', 0, '2022-06-01', NULL),
(38, 'SciLab', '2023.1.0', 'files/scilab.zip', 'files/scilab.pdf', 'Logiciel calcul numérique', 1, 'aguidet', 'Calcul numérique', '', '', 0, '2022-06-01', NULL),
(39, 'SQLDeveloper', '23.1', 'files/sqldeveloper.zip', 'files/sqldeveloper.pdf', 'Client Oracle - JDK 11 inclus', 1, 'aguidet', 'Utilitaire de bases de données', 'files/sqldeveloper.zip', 'files/oracle.png', 0, '2022-06-01', NULL),
(40, 'SublimeText', '4.1', 'files/stext.zip', '#', 'Editeur de texte', 1, 'aguidet', 'Editeur de texte', '', '', 1, '2022-06-01', NULL),
(41, 'Talend Open Studio', '8.0', 'files/tos.zip', '#', 'ETL open source et intégration de données.', 1, 'aguidet', 'Utilitaire de bases de données', '', '', 1, '2022-06-01', NULL),
(42, 'VirtualBox', '7.0.8', 'files/virtualbox.zip', '#', 'Logiciel permettant d\'excuter des machines virtuelles, avec différents systèmes d\'exploitation.', 1, 'aguidet', 'Hyperviseur', '', 'files/virtualbox.jpg', 0, '2022-06-01', NULL),
(43, 'Visio', '2021', 'https://portal.azure.com', 'https://iutdijon.u-bourgogne.fr/siav/acces-a-microsoft-azure-dev-tools-for-teaching-de-liut-de-dijon-auxerre/', 'Utilitaire de dessin vectoriel; permet notamment de réaliser des diagrammes UML, des plans de réseau, des diagrammes divers.', 1, 'aguidet', 'Dessin vectoriel', '', 'files/visio.jpg', 0, '2022-06-01', NULL),
(44, 'Visual Paradigm', '17.1', 'files/vp.zip', 'files/vp.pdf', 'Editeur complet UML pour l\'analyse, la conception et le maquettage de projet informatique. Comprend tous les diagrammes UML, plus des diagrammes de maquettage, de gestion de projet, etc.', 1, 'aguidet', 'Editeur UML', 'files/vp-portable.zip', 'files/vp.jpg', 0, '2022-06-01', 'Z5DY8-G9H3Y-64XU2-6EUDK-6J98S'),
(45, 'VMWare Player', '17.0.2', 'files/vmware.zip', '#', 'Logiciel permettant d\'excuter des machines virtuelles, avec différents systèmes d\'exploitation.', 1, 'aguidet', 'Hyperviseur', '', '', 0, '2022-06-01', NULL),
(46, 'WinDesign', '16.1', 'files/windesign.zip', 'files/windesign.pdf', 'Editeur de modèle conceptuel de données (méthode Merise)', 1, 'aguidet', 'Utilitaire de bases de données', '', '', 1, '2022-06-01', NULL),
(47, 'WireShark', '3.6.6', 'files/wireshark.zip', '#', 'Utilitaire réseau permettant de lire les différentes trames échangées.', 1, 'aguidet', 'Utilitaire réseau', 'files/wireshark-portable.zip', 'files/wireshark_logo.png', 0, '2022-06-01', NULL),
(49, 'Visual Studio Code', '1.67.2', 'https://code.visualstudio.com/', '#', 'Editeur de texte orienté programmation, avec de (très) nombreuses extensions permettant de coder avec de nombreux langages. Coloration syntaxique, extraits de code, pilotage de la chaîne de compilation et de déboguage, etc.', 1, 'aguidet', 'Editeur de code', 'files/vscode-portable.zip', 'files/vscode.jpg', 0, '2022-06-01', NULL),
(57, 'PHP', '8.2.6', 'files/php.zip', 'files/php.pdf', 'PHP est un langage spécialisé dans la programmation web coté client. L\'installation portable permet de tester rapidement son code directement avec VSCode, par exemple.', 0, 'aguidet', 'Interpréteur', 'files/php.zip', 'files/php.svg', 0, '2022-06-01', NULL),
(58, 'Color Contrast Analyser', '1.1', 'files/cca.zip', '', 'Appli de calcul de ratio de contraste. Prérequis : .NET 6.0', 1, NULL, 'Accessoire', 'files/cca-portable.zip', 'files/picker.png', 0, '2022-06-01', ''),
(59, 'WSL', '2', '', 'files/wsl2.pdf', 'Windows Subsystem for Linux : intégration à Windows 10 d\'un système basé sur le noyau Linux.', 0, NULL, 'Utilitaire système', '', 'files/wsl.jpg', 0, '2022-06-01', NULL),
(60, 'Neo4J Desktop', '1.5.8', 'files/neo4j.zip', 'files/neo4j.pdf', '<p>Ensemble d\'outils pour les bases de données orientée Graphes. <br>Clé à utiliser pour activer : </p><code>eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ii4rQC4rIiwibWl4cGFuZWxJZCI6IiRkZXZpY2U6MTg4YWYwMTU4MDcyMTctMGQ4MGRlMGM1ZGM3MDUtN2U1NjU0NzktMWFlYWEwLTE4OGFmMDE1ODA3MjE3IiwibWl4cGFuZWxQcm9qZWN0SWQiOiI0YmZiMjQxNGFiOTczYzc0MWI2ZjA2N2JmMDZkNTU3NSIsIm9yZyI6Ii4qIiwicHViIjoibmVvNGouY29tIiwicmVnIjoiICIsInN1YiI6Im5lbzRqLWRlc2t0b3AiLCJleHAiOjE3MTgxODU2ODIsInZlciI6IioiLCJpc3MiOiJuZW80ai5jb20iLCJuYmYiOjE2ODY1NjMyODIsImlhdCI6MTY4NjU2MzI4MiwianRpIjoiNDNhMkw5TXZZIn0.F90n0RAgwi8XJ59PIW4rJk6uEQvywNjIlBh7pg3BRxoeU1bm-rQQjHl5Ibbd_CBp1QX44TtlTs9cv1xuhnusPMdZJ0HkEk8Qytc-171vOrPYUFJoGPpBQ8X_NvCOldWIvpI897gAqpNher8JoOcLKpZCpqrL8fdRrUdzBaVvuETJBtWUl0s5qCA8edIF4L9my5qAJ2TCITVnoLkI4asbMMz70xjyM--HwkmdDamfOKOGZDfJpCGVdeSoEtQM3bmhPV1r_ZzQ5JHC9xO1uhsnQB8Lcl70EVQ7bgjHt4O4WqyjZXaKusc9mmA0qAkou_UJdUT7qYMwbLN1fXzwAY7Tgw</code>', 0, NULL, '', '', 'files/neo4J.png', 0, '2022-06-01', NULL),
(61, 'UWAMP', '3.1.0', 'files/UwAmp.zip', '', 'UWAMP contient un ensemble d\'outils pour le développement web et/ou la gestion des bases de données. Le logiciel comprend : un serveur web (Apache 2.4), un interpréteur PHP (5.0 et 7.0) avec xDebug, un système de gestion de bases de données (MySQL 5.7) , SQLiteBrowser (client SQLite).', 0, NULL, 'Gestion de BDD', 'files/UwAmp-portable.zip', 'files/uwamp.png', 1, '2022-06-01', ''),
(63, 'R studio', '2022.02.3', 'files/RStudio.zip', '', 'analyse de données, visualisation. R Studio est un EDI pour R. L\'archive contient R et R Studio (R doit être installé avant)', 0, NULL, 'analyse de données, statistique', '', 'files/logo_R.svg', 0, '2022-06-01', NULL),
(64, 'ADOBE', 'CS6', '', '', 'Attention : peu de licences disponibles à l\'IUT, 1 seule salle possible, pas d\'installation à la maison possible.', 0, NULL, 'Photoshop, illustrator', '', '', 1, '2022-06-01', NULL),
(65, 'The GIMP', '2.10.32', '', '', 'Utilitaire permettant le traitement d\'images', 0, NULL, 'Accessoire', '', '', 0, '2022-06-01', NULL),
(66, 'Paint .NET', '', '', '', 'Logiciel léger permettant le traitement des images', 0, NULL, 'Accessoire', '', '', 0, '2022-06-01', NULL),
(67, 'Openshot video editor', '2.6.1', 'files/openshot.zip', '', 'Logiciel de montage vidéo', 0, NULL, 'Accessoire', '', '', 0, '2022-06-01', NULL),
(68, 'Audacity', '', '', '', 'Logiciel d\'édition Audio', 0, NULL, 'Accessoire', '', 'files/cpu.png', 0, '2022-06-01', NULL),
(69, 'PHPStorm', '', '', '', 'https://www.jetbrains.com/community/education/#classrooms', 0, NULL, 'EDI', '', '', 0, '2022-06-01', NULL),
(70, 'Inno Setup', '6.2.1', 'files/isetup.zip', 'files/InnoSetup.pdf', 'Permet de réaliser des scripts d\'installation (<i>setup wizard</i>) pour des logiciels.', 0, NULL, 'Gestion de projet', '', '', 0, '2022-06-01', NULL),
(71, 'Dbeaver', '23.1', 'files/dbeaver.zip', 'files/DBeaver.pdf', 'client bdd universel', 0, NULL, 'Gestion de BDD', 'files/dbeaver-portable.zip', 'files/beaver-head.png', 0, '2022-06-01', NULL),
(72, 'HxD Hex Editor', '2.5', 'files/HxDSetup.zip', '', 'Editeur hexadécimal simple', 0, NULL, 'Utilitaire système', 'files/HxDPortableSetup.zip', '', 0, '2022-06-01', NULL),
(73, 'Vagrant', '2.2.19', 'files/vagrant.zip', '', 'Outil de virtualisation', 0, NULL, 'Utilitaire système', '', '', 1, '2023-06-01', NULL),
(74, 'XMing', '6.9', 'files/xming.zip', '', 'Serveur X pour Windows, permet notamment d\'utiliser des applications graphiques en WSL.', 0, NULL, 'Utilitaire système', '', '', 1, '2023-06-01', NULL),
(75, 'Looping', '4.0', '', '', 'Petit logiciel simple permettant d\'éditer des MCD (Merise), des MLD, des diagrammes E/R', 0, NULL, 'Accessoire', 'files/Looping.zip', '', 0, '2023-06-01', NULL),
(76, 'DB Browser for SQLite', '3.12.2', 'files/sqlite.zip', '', 'Client simple pour administrer des bases de données SQLite', 0, NULL, 'Gestion de BDD', 'files/DB.Browser.for.SQLite-3.12.2-win64.zip', 'files/sqlitebrowser.svg', 0, '2023-06-01', NULL),
(77, 'SharpDevelop', '4.2.1', '', '', 'EDI très simple, permettant de développer en C# pour Windows. Attention : utilise des versions assez anciennes du langage C# et du framework .NET. Son principal interêt (outre la légèreté) est d\'être portable.', 0, NULL, 'EDI', 'files/SharpDevelopPortable.zip', '', 0, '2023-06-01', NULL),
(78, 'PowerBI Desktop', '', 'files/powerbi.zip', '', 'Logiciel pour gestion des tableaux de bord.\nUtiliser le compte \"uB\" (MS 365) pour la connexion\n', 0, NULL, 'Gestion de BDD', '', 'files/powerbi.png', 0, '2023-06-01', NULL),
(79, 'MiniZinc', '2.7.5', 'files/minizic.zip', '', 'Compilateur et IDE pour programmation par contraintes, utilisé en Recherche Opérationnelle', 0, NULL, 'EDI', '', '', 0, '2023-06-01', NULL),
(80, 'Datagrip', '2023.1.2', 'files/datagrip-2023.1.2.exe', '', 'DataGrip, un IDE de base de données conçu pour répondre aux besoins spécifiques des développeurs SQL professionnels.', 0, NULL, 'Gestion de BDD', '', 'files/1024px-DataGrip.svg.png', 0, '2023-06-01', NULL),
(81, 'Docker for Windows', '4.20.1', 'files/docker.zip', 'files/docker.pdf', 'Conteneurisation de logiciels.\nUtilise WSL2 pour l\'exécution des conteneurs (qui est donc prérequis).\n', 0, NULL, 'Utilitaire système', '', 'files/docker.png', 0, '2023-06-01', NULL),
(82, 'Arduino IDE', '2.1.0', 'files/arduino-ide_2.1.0_Windows_64bit.zip', '', 'a installer avec le driver USB pour le téléchargement sur les cartes. Extraire le contenu de l\'archive, puis exécuter l\'IDE : à la première exécution l\'installation des drivers se finalisera.', 0, NULL, 'Compilateur', '', '', 0, '2023-06-01', NULL),
(83, 'Delphi Rad Studio', '11 CE', 'files/delphi.zip', 'files/delphi.pdf', 'EDI Pascal.\nLa version community est gratuite mais nécessite, sur un poste hors-IUT, une inscription sur Embarcadero.', 0, NULL, 'EDI', '', 'files/delphi-logo-1024.png', 1, '2023-06-01', ''),
(84, 'SQL Server', '2022 Express', 'files/SQL2022-SSEI-Expr.exe', '', 'Serveur de bases de données.', 0, NULL, 'Gestion de BDD', '', '', 0, '2023-06-01', NULL),
(85, 'SQL Server Management Studio', '19.1', 'files/SSMS-Setup-ENU.zip', '', '', 0, NULL, 'Gestion de BDD', '', '', 0, '2023-06-01', NULL),
(88, 'GitHub CLI', '', 'files/gh_cli.zip', '', 'Utilisation de GitHub en ligne de commande; permet de réaliser différents scripts d\'administration.', 0, 'aguidet', 'Accessoire', '', '', 0, '2024-01-19', '');

-- --------------------------------------------------------

--
-- Structure de la table `logiciel_filiere`
--

CREATE TABLE `logiciel_filiere` (
  `LogicielID` int NOT NULL,
  `FiliereID` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `logiciel_filiere`
--

INSERT INTO `logiciel_filiere` (`LogicielID`, `FiliereID`) VALUES
(3, 1),
(3, 2),
(5, 1),
(5, 2),
(6, 2),
(6, 5),
(7, 1),
(12, 2),
(13, 1),
(13, 2),
(15, 1),
(16, 1),
(16, 2),
(16, 5),
(18, 2),
(19, 2),
(21, 2),
(21, 5),
(23, 1),
(23, 2),
(23, 5),
(24, 1),
(24, 2),
(25, 2),
(26, 2),
(26, 5),
(31, 1),
(33, 1),
(35, 2),
(37, 2),
(38, 1),
(39, 2),
(42, 1),
(43, 1),
(43, 2),
(43, 5),
(44, 1),
(44, 2),
(44, 5),
(45, 2),
(45, 5),
(47, 1),
(49, 1),
(49, 2),
(49, 5),
(57, 2),
(58, 1),
(58, 2),
(59, 1),
(59, 2),
(60, 2),
(61, 1),
(61, 2),
(63, 1),
(63, 2),
(69, 2),
(71, 2),
(72, 1),
(76, 2),
(77, 1),
(78, 1),
(79, 5),
(80, 1),
(80, 2),
(80, 5),
(81, 5),
(82, 5),
(83, 1),
(84, 1),
(85, 1);

-- --------------------------------------------------------

--
-- Structure de la table `logiciel_matiere`
--

CREATE TABLE `logiciel_matiere` (
  `LogicielID` int NOT NULL,
  `MatiereID` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `logiciel_matiere`
--

INSERT INTO `logiciel_matiere` (`LogicielID`, `MatiereID`) VALUES
(3, 1),
(3, 2),
(5, 1),
(5, 4),
(6, 1),
(7, 1),
(7, 2),
(12, 1),
(13, 1),
(15, 5),
(15, 6),
(16, 1),
(16, 5),
(16, 6),
(18, 1),
(19, 1),
(21, 1),
(21, 4),
(22, 1),
(22, 2),
(23, 5),
(23, 6),
(24, 4),
(25, 1),
(26, 1),
(31, 1),
(33, 5),
(35, 1),
(35, 2),
(37, 4),
(38, 2),
(38, 4),
(39, 4),
(40, 1),
(42, 3),
(43, 1),
(43, 3),
(43, 6),
(44, 1),
(44, 5),
(44, 6),
(45, 3),
(47, 3),
(49, 1),
(57, 1),
(58, 1),
(59, 3),
(60, 4),
(61, 1),
(61, 4),
(63, 4),
(64, 5),
(65, 1),
(65, 6),
(66, 1),
(66, 6),
(67, 6),
(68, 1),
(68, 6),
(69, 1),
(70, 1),
(70, 5),
(71, 4),
(72, 3),
(73, 3),
(74, 3),
(75, 4),
(76, 1),
(76, 4),
(77, 1),
(78, 4),
(79, 2),
(80, 1),
(80, 4),
(81, 1),
(81, 3),
(82, 1),
(83, 1),
(84, 4),
(85, 4);

-- --------------------------------------------------------

--
-- Structure de la table `matiere`
--

CREATE TABLE `matiere` (
  `ID` int NOT NULL,
  `Code` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
  `Nom` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `matiere`
--

INSERT INTO `matiere` (`ID`, `Code`, `Nom`) VALUES
(1, 'C1', 'Développement d\'applications'),
(2, 'C2', 'Optimiser des applications'),
(3, 'C3', 'Administrer des systèmes'),
(4, 'C4', 'Gérer des données'),
(5, 'C5', 'Conduire un projet'),
(6, 'C6', 'Travailler dans une équipe');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `login` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
  `role` int NOT NULL,
  `nom` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `departement` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `statut` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hashpass` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mail` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`login`, `role`, `nom`, `departement`, `statut`, `hashpass`, `mail`) VALUES
('admin', 1, 'Administrator', 'INFO', 'administrateur', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin@iut-dijon.u-bourgogne.fr'),
('prof', 2, 'Enseignant INFO', 'INFO', 'enseignant', '31f7a65e315586ac198bd798b6629ce4903d0899476d5741a9f32e2e521b6a66', 'prof@iut-dijon.u-bourgogne.fr');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `filiere`
--
ALTER TABLE `filiere`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nom` (`nom`);

--
-- Index pour la table `logiciel`
--
ALTER TABLE `logiciel`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `nom` (`nom`),
  ADD KEY `idx_obsolete` (`obsolete`),
  ADD KEY `idx_visible` (`visible`);

--
-- Index pour la table `logiciel_filiere`
--
ALTER TABLE `logiciel_filiere`
  ADD PRIMARY KEY (`LogicielID`,`FiliereID`),
  ADD KEY `FKLogiciel_F972294` (`FiliereID`);

--
-- Index pour la table `logiciel_matiere`
--
ALTER TABLE `logiciel_matiere`
  ADD PRIMARY KEY (`LogicielID`,`MatiereID`),
  ADD KEY `FKLogiciel_M909644` (`MatiereID`);

--
-- Index pour la table `matiere`
--
ALTER TABLE `matiere`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Code` (`Code`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`login`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `filiere`
--
ALTER TABLE `filiere`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `logiciel`
--
ALTER TABLE `logiciel`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT pour la table `matiere`
--
ALTER TABLE `matiere`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


CREATE USER IF NOT EXISTS 'softs_app'@'localhost' IDENTIFIED BY '1Mot_De_Passe_Fort*';
GRANT SELECT, INSERT, UPDATE ON softs.* TO 'softs_app'@'localhost';
FLUSH PRIVILEGES;
