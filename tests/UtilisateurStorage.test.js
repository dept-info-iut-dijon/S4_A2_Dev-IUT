/**
 * Tests unitaires de la classe UtilisateurStorage
 *
 * UtilisateurStorage utilise window.sessionStorage (API navigateur).
 * Comme Jest tourne en Node.js, on simule sessionStorage avec un objet
 * qui se comporte de la même façon.
 */

// Simulation de sessionStorage
const sessionStorageMock = (() => {
    let store = {};
    return {
        getItem:  (key)      => store[key] ?? null,
        setItem:  (key, val) => { store[key] = String(val); },
        clear:    ()         => { store = {}; },
    };
})();

global.window = { sessionStorage: sessionStorageMock };

describe('UtilisateurStorage', () => {
    let storage;

    beforeEach(() => {
        sessionStorageMock.clear();
        storage = new UtilisateurStorage();
    });

    // --- Round-trip sauve / charge ---

    test('sauve puis charge conserve toutes les propriétés', () => {
        const u = new Utilisateur('jdupont');
        u.nom         = 'Jean Dupont';
        u.statut      = 'enseignant';
        u.departement = 'informatique';

        storage.sauve(u);
        const chargé = storage.charge();

        expect(chargé.login).toBe('jdupont');
        expect(chargé.nom).toBe('Jean Dupont');
        expect(chargé.statut).toBe('enseignant');
        expect(chargé.departement).toBe('informatique');
    });

    // --- Comportement sans sauvegarde préalable ---

    test('charge retourne un Utilisateur par défaut si rien n\'a été sauvegardé', () => {
        const u = storage.charge();
        expect(u).toBeInstanceOf(Utilisateur);
        expect(u.login).toBe('');
    });

    // --- Cohérence entre deux appels ---

    test('deux appels successifs à charge() retournent les mêmes données', () => {
        const u = new Utilisateur('mdurand');
        u.nom = 'Marie Durand';
        storage.sauve(u);

        const u1 = storage.charge();
        const u2 = storage.charge();

        expect(u1.login).toBe(u2.login);
        expect(u1.nom).toBe(u2.nom);
    });

    // --- Écrasement ---

    test('sauvegarder un deuxième utilisateur écrase le premier', () => {
        const u1 = new Utilisateur('user1');
        u1.nom = 'Premier';
        const u2 = new Utilisateur('user2');
        u2.nom = 'Deuxième';

        storage.sauve(u1);
        storage.sauve(u2);

        const chargé = storage.charge();
        expect(chargé.login).toBe('user2');
        expect(chargé.nom).toBe('Deuxième');
    });
});
