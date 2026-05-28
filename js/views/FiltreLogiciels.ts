/**
 * SRP : responsabilité unique — déterminer quel filtre est actif et appeler le bon DAO.
 * OCP : pour ajouter un filtre, on étend cette classe ou on ajoute une entrée dans la map,
 *       sans modifier la méthode filtrer() elle-même.
 */
type ResultatPage = { logiciels: Logiciel[], total: number, page: number, limite: number };

class FiltreLogiciels {
    private vm: VueLogicielsVM;

    constructor(vm: VueLogicielsVM) {
        this.vm = vm;
    }

    /**
     * OCP : chaque type de filtre est une entrée dans cette map.
     * Ajouter un filtre = ajouter une entrée, sans toucher à filtrer().
     */
    private readonly filtres: Record<string, (params: any) => Promise<ResultatPage>> = {
        "all":    (p) => this.vm.listeTousLogicielsPagine(p.portable, p.obsolete, p.page, p.limite),
        "year":   (p) => this.vm.listeLogicielsFilierePagine(p.id, p.portable, p.obsolete, p.page, p.limite),
        "course": (p) => this.vm.listeLogicielsMatierePagine(p.id, p.portable, p.obsolete, p.page, p.limite),
        "name":   (p) => this.vm.listeLogicielsNomPagine(p.id, p.portable, p.obsolete, p.page, p.limite),
    };

    async filtrer(
        typeFiltreActif: string,
        idFiltreActif: any,
        portable: boolean,
        obsolete: boolean,
        page: number,
        limite: number
    ): Promise<ResultatPage> {
        const fn = this.filtres[typeFiltreActif];
        if (!fn) throw new Error("Filtre inconnu : " + typeFiltreActif);
        return fn({ id: idFiltreActif, portable, obsolete, page, limite });
    }
}
