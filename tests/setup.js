/**
 * Chargement des classes TypeScript compilées dans le scope global de Jest.
 */
const fs   = require('fs');
const path = require('path');

function chargerClasse(cheminRelatif, nomClasse) {
    const cheminAbsolu = path.join(__dirname, '..', cheminRelatif);
    const code = fs.readFileSync(cheminAbsolu, 'utf8');
    // new Function exécute le code dans un scope qui a accès à global,
    // puis retourne la classe pour qu'on puisse l'assigner à global[nomClasse].
    global[nomClasse] = new Function(code + `\nreturn ${nomClasse};`)();
}

// Ordre important : Utilisateur doit être chargé avant les classes qui en dépendent
chargerClasse('js/models/Utilisateur.js',        'Utilisateur');
chargerClasse('js/models/Logiciel.js',           'Logiciel');
chargerClasse('js/models/Matiere.js',            'Matiere');
chargerClasse('js/models/Filiere.js',            'Filiere');
chargerClasse('js/sgbd/UtilisateurStorage.js',   'UtilisateurStorage');
