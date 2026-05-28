/**
 * Tests unitaires de la classe Logiciel
 *
 * estRecent dépend de new Date() en interne.
 * On utilise jest.useFakeTimers() pour figer la date courante
 * et rendre les tests indépendants du jour d'exécution.
 *
 * Logique de estRecent (date fixée au 15 mars 2026) :
 *   - getMonth() retourne 2 (mars), donc month = 2 - 1 = 1
 *   - 1 n'est pas >= 9, donc year = 2026 - 1 = 2025
 *   - Seuil = 1er octobre 2025
 *   - estRecent = true si date_ajout > 1er octobre 2025
 */

describe('Logiciel', () => {

    // --- estNouveau ---

    describe('estNouveau', () => {
        test('est true pour un logiciel dont l\'id vaut 0 (jamais enregistré)', () => {
            const l = new Logiciel();
            expect(l.estNouveau).toBe(true);
        });

        test('est false une fois qu\'un id est attribué', () => {
            const l = new Logiciel();
            l.id = 42;
            expect(l.estNouveau).toBe(false);
        });
    });

    // --- nomVersion ---

    describe('nomVersion', () => {
        test('retourne "nom version" pour un logiciel non obsolète', () => {
            const l = new Logiciel();
            l.nom     = 'IntelliJ';
            l.version = '2024.1';
            l.obsolete = false;
            expect(l.nomVersion).toBe('IntelliJ 2024.1');
        });

        test('ajoute " (obsolete)" pour un logiciel obsolète', () => {
            const l = new Logiciel();
            l.nom     = 'IntelliJ';
            l.version = '2024.1';
            l.obsolete = true;
            expect(l.nomVersion).toBe('IntelliJ 2024.1 (obsolete)');
        });
    });

    // --- estRecent ---

    describe('estRecent', () => {
        beforeEach(() => {
            // Date figée au 15 mars 2026 → seuil = 1er octobre 2025
            jest.useFakeTimers();
            jest.setSystemTime(new Date(2026, 2, 15));
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('est true pour un logiciel ajouté après le seuil (1er décembre 2025)', () => {
            const l = new Logiciel();
            l.date_ajout = new Date(2025, 11, 1);
            expect(l.estRecent).toBe(true);
        });

        test('est false pour un logiciel ajouté avant le seuil (30 septembre 2025)', () => {
            const l = new Logiciel();
            l.date_ajout = new Date(2025, 8, 30);
            expect(l.estRecent).toBe(false);
        });

        test('est false le jour exact du seuil (1er octobre 2025, borne exclue)', () => {
            const l = new Logiciel();
            l.date_ajout = new Date(2025, 9, 1);
            expect(l.estRecent).toBe(false);
        });

        test('est true le lendemain du seuil (2 octobre 2025)', () => {
            const l = new Logiciel();
            l.date_ajout = new Date(2025, 9, 2);
            expect(l.estRecent).toBe(true);
        });

        test('est false pour un logiciel très ancien (juin 2023)', () => {
            const l = new Logiciel();
            l.date_ajout = new Date(2023, 5, 1);
            expect(l.estRecent).toBe(false);
        });
    });

    // --- Constructeur ---

    describe('constructeur', () => {
        test('id vaut 0 par défaut', () => {
            const l = new Logiciel();
            expect(l.id).toBe(0);
        });

        test('obsolete vaut false par défaut', () => {
            const l = new Logiciel();
            expect(l.obsolete).toBe(false);
        });

        test('toutes les URLs sont des chaînes vides par défaut', () => {
            const l = new Logiciel();
            expect(l.urlSetup).toBe('');
            expect(l.urlTuto).toBe('');
            expect(l.urlPort).toBe('');
            expect(l.urlImage).toBe('');
        });
    });
});
