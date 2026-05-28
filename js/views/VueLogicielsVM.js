"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Lien entre la vue et le modèle, pour la vue logiciels
 * */
class VueLogicielsVM {
    /**
     * Initialise le lien
     * @param fdao DAO pour les filières
     * @param mdao DAO pour les matières
     * @param ldao DAO pour les logiciels
     */
    constructor(fdao, mdao, ldao) {
        this.fdao = fdao;
        this.mdao = mdao;
        this.ldao = ldao;
    }
    /**
     * Fournit la liste des filières
     * @returns Array<Filiere> les filières existantes
     * */
    listeFilieres() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fdao.liste();
        });
    }
    /**
     * Fournit la liste des matières
     * @returns Array<Matiere> les matières existantes
     * */
    listeMatieres() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mdao.liste();
        });
    }
    /**
     * Liste tous les logiciels
     * @returns tous les logiciels
     * @param portableOnly pour indiquer si on ne conserve que les logiciels portables ou non
     * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * */
    listeTousLogiciels() {
        return __awaiter(this, arguments, void 0, function* (portableOnly = false, cacherObsolete = false) {
            return yield this.ldao.listAll(portableOnly, cacherObsolete);
        });
    }
    /**
     * Liste les logiciels par filière
     * @param idfiliere l'ID de la filière
     * @returns les logiciels de la filière
     * @param portable indique si l'on ne conserve que les portables ou non
     * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     */
    listeLogicielsFiliere(idfiliere, portable, obsolete) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ldao.listFiliere(idfiliere, portable, obsolete);
        });
    }
    /**
     * Liste les logiciels par matière
     * @param idmatiere l'ID de la matière
     * @param portable indique si l'on filtre sur l'état portable
     * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @returns les logiciels de la matière
     */
    listeLogicielsMatiere(idmatiere, portable, cacherObsolete) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ldao.listMatiere(idmatiere, portable, cacherObsolete);
        });
    }
    /**
     * Liste les logiciels par nom (incomplet)
     * @param name le nom à retrouver
     * @param portable indique si l'on filtre sur les portables ou non
     * @param boolean $cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @returns les logiciels dont le nom correspond
     */
    listeLogicielsNom(name, portable, cacherObsolete) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ldao.listNom(name, portable, cacherObsolete);
        });
    }
    listeLogicielsFilierePagine(idfiliere, portable, obsolete, page, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ldao.listFilierePagine(idfiliere, portable, obsolete, page, limite);
        });
    }
    listeLogicielsMatierePagine(idmatiere, portable, cacherObsolete, page, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ldao.listMatierePagine(idmatiere, portable, cacherObsolete, page, limite);
        });
    }
    listeLogicielsNomPagine(name, portable, cacherObsolete, page, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ldao.listNomPagine(name, portable, cacherObsolete, page, limite);
        });
    }
    /**
     * Liste tous les logiciels avec pagination
     * @param portableOnly pour indiquer si on ne conserve que les portables
     * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes
     * @param page numéro de page
     * @param limite nombre par page
     */
    listeTousLogicielsPagine() {
        return __awaiter(this, arguments, void 0, function* (portableOnly = false, cacherObsolete = false, page = 1, limite = 20) {
            return yield this.ldao.listAllPagine(portableOnly, cacherObsolete, page, limite);
        });
    }
}
