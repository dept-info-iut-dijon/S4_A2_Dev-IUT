/**
 * Tests unitaires de la classe Utilisateur
 * On teste uniquement la logique métier : estAdmin et estProf.
 * Les getters/setters simples ne sont pas testés.
 */

describe('Utilisateur', () => {

    // --- estAdmin ---

    describe('estAdmin', () => {
        test('retourne true pour le login "aguidet"', () => {
            const u = new Utilisateur('aguidet');
            expect(u.estAdmin).toBe(true);
        });

        test('retourne true même si le login est en majuscules (insensible à la casse)', () => {
            const u = new Utilisateur('AGUIDET');
            expect(u.estAdmin).toBe(true);
        });

        test('retourne false pour un login quelconque', () => {
            const u = new Utilisateur('dupont');
            expect(u.estAdmin).toBe(false);
        });

        test('retourne false pour une chaîne vide', () => {
            const u = new Utilisateur('');
            expect(u.estAdmin).toBe(false);
        });
    });

    // --- estProf ---

    describe('estProf', () => {
        test('retourne true si le statut est "enseignant"', () => {
            const u = new Utilisateur();
            u.statut = 'enseignant';
            expect(u.estProf).toBe(true);
        });

        test('retourne true si le statut commence par "ens" en majuscules', () => {
            const u = new Utilisateur();
            u.statut = 'ENSeignant';
            expect(u.estProf).toBe(true);
        });

        test('retourne false pour le statut "etudiant"', () => {
            const u = new Utilisateur();
            u.statut = 'etudiant';
            expect(u.estProf).toBe(false);
        });

        test('retourne false pour le statut "vacataire"', () => {
            const u = new Utilisateur();
            u.statut = 'vacataire';
            expect(u.estProf).toBe(false);
        });
    });

    // --- Constructeur ---

    describe('constructeur', () => {
        test('le login est vide par défaut', () => {
            const u = new Utilisateur();
            expect(u.login).toBe('');
        });

        test('le login passé en paramètre est bien stocké', () => {
            const u = new Utilisateur('jmartin');
            expect(u.login).toBe('jmartin');
        });

        test('le statut par défaut est "enseignant"', () => {
            const u = new Utilisateur();
            expect(u.statut).toBe('enseignant');
        });
    });
});
