/**
 * Lien entre la vue et le modèle, pour la vue logiciels
 * */
class VueLogicielsVM
{
    private fdao: FiliereDAO;
    private mdao: MatiereDAO;
    private ldao: LogicielDAO;

    /**
     * Initialise le lien
     * @param fdao DAO pour les filières
     * @param mdao DAO pour les matières
     * @param ldao DAO pour les logiciels
     */
    constructor(fdao: FiliereDAO, mdao: MatiereDAO, ldao: LogicielDAO)
    {
        this.fdao = fdao;
        this.mdao = mdao;
        this.ldao = ldao;
    }

    /**
     * Fournit la liste des filières
     * @returns Array<Filiere> les filières existantes
     * */
    async listeFilieres(): Promise<Array<Filiere>>
    {
        return await this.fdao.liste(); 
    }

    /**
     * Fournit la liste des matières
     * @returns Array<Matiere> les matières existantes
     * */
    async listeMatieres(): Promise<Array<Matiere>>
    {
        return await this.mdao.liste();
    }

    /**
     * Liste tous les logiciels
     * @returns tous les logiciels
     * @param portableOnly pour indiquer si on ne conserve que les logiciels portables ou non
     * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * */
    async listeTousLogiciels(portableOnly:boolean = false, cacherObsolete:boolean=false): Promise<Array<Logiciel>>
    {
        return await this.ldao.listAll(portableOnly, cacherObsolete);
    }

    /**
     * Liste les logiciels par filière
     * @param idfiliere l'ID de la filière
     * @returns les logiciels de la filière
     * @param portable indique si l'on ne conserve que les portables ou non
     * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     */
    async listeLogicielsFiliere(idfiliere: number, portable: boolean, obsolete:boolean): Promise<Array<Logiciel>>
    {
        return await this.ldao.listFiliere(idfiliere, portable, obsolete);
    }

    /**
     * Liste les logiciels par matière     
     * @param idmatiere l'ID de la matière
     * @param portable indique si l'on filtre sur l'état portable
     * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @returns les logiciels de la matière
     */
    async listeLogicielsMatiere(idmatiere: number, portable: boolean, cacherObsolete:boolean): Promise<Array<Logiciel>>
    {
        return await this.ldao.listMatiere(idmatiere, portable, cacherObsolete);
    }

    /**
     * Liste les logiciels par nom (incomplet)
     * @param name le nom à retrouver
     * @param portable indique si l'on filtre sur les portables ou non
     * @param boolean $cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @returns les logiciels dont le nom correspond
     */
    async listeLogicielsNom(name: string, portable:boolean, cacherObsolete:boolean): Promise<Array<Logiciel>>
    {
        return await this.ldao.listNom(name, portable, cacherObsolete);
    }

}