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
 * Lien avec le code serveur pour les logiciels
 * */
class LogicielDAO {
    constructor() {
        this.userDao = new UtilisateurDao();
    }
    /**
     * Supprime de la base le logiciel donné
     * @param currentLog le logiciel à supprimer
     */
    delLogiciel(currentLog) {
        return __awaiter(this, void 0, void 0, function* () {
            let retour = yield $.ajax({
                method: "get",
                dataType: "json",
                data: {
                    "action": "delete",
                    "id": currentLog.id
                },
                url: "php/logiciels.php",
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            console.log(retour);
        });
    }
    getData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = new Array();
            for (let obj of data) {
                let logiciel = new Logiciel();
                logiciel.id = obj.id;
                logiciel.comment = obj.comment;
                logiciel.nom = obj.nom;
                logiciel.type = obj.type;
                logiciel.urlSetup = obj.urlSetup;
                logiciel.urlTuto = obj.urlTuto;
                logiciel.version = obj.version;
                logiciel.visible = obj.visible;
                logiciel.urlPort = obj.urlPort;
                logiciel.urlImage = obj.urlImage;
                logiciel.obsolete = obj.obsolete == 1;
                logiciel.date_ajout = new Date(obj.date_ajout);
                logiciel.numero_serie = obj.numero_serie;
                let user = new Utilisateur();
                user.login = obj.utilisateur;
                user.nom = obj.utilisateurNom;
                user.statut = obj.utilisateurStatut;
                user.departement = obj.utilisateurDepartement;
                logiciel.utilisateur = user;
                list.push(logiciel);
            }
            return list;
        });
    }
    /**
     * Liste les logiciels suivant leur nom
     * @param name le nom approximatif
     * @parma portable indique si l'on filtre sur les portables
     * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @returns les logiciels
     */
    listNom(name, portable, cacherObsolete) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield $.ajax({
                method: "get",
                dataType: "json",
                data: {
                    "nom": name,
                    "portable": portable,
                    "obsolete": cacherObsolete
                },
                url: "php/logiciels.php",
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            let list = yield this.getData(data);
            return list;
        });
    }
    getLogiciel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield $.ajax({
                method: "get",
                dataType: "json",
                data: { "id": id },
                url: "php/logiciels.php",
                error: (obj, status, error) => { console.log(error); }
            });
            let list = yield this.getData(data);
            return list[0];
        });
    }
    /**
     *
     * Liste les logiciels suivant la matière spécifiée
     * @param idmatiere l'ID de la matière
     * @param portable indique si l'on filtre sur l'état portable
     * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @returns les logiciels
     */
    listMatiere(idmatiere, portable, cacherObsolete) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield $.ajax({
                method: "get",
                dataType: "json",
                data: {
                    "idmat": idmatiere,
                    "portable": portable,
                    "obsolete": cacherObsolete
                },
                url: "php/logiciels.php",
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            let list = yield this.getData(data);
            return list;
        });
    }
    /**
     * liste les logiciels suivant la filière
     * @param idfiliere l'ID de la filière
     * @param portable indique si l'on ne conserve que les portables ou non
     * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @returns les logiciels
     */
    listFiliere(idfiliere, portable, obsolete) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield $.ajax({
                method: "get",
                dataType: "json",
                data: {
                    "idfil": idfiliere,
                    "portable": portable,
                    "obsolete": obsolete
                },
                url: "php/logiciels.php",
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            let list = yield this.getData(data);
            return list;
        });
    }
    /**
     * Liste tous les logiciels
     * @returns les logiciels
     * @param portableOnly indique si l'on ne souhaite que les portables
     * * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * */
    listAll(portableOnly, cacherObsolete) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield $.ajax({
                method: "get",
                data: {
                    "portable": portableOnly,
                    "obsolete": cacherObsolete
                },
                dataType: "json",
                url: "php/logiciels.php",
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            let list = yield this.getData(data);
            return list;
        });
    }
    /**
     * Met à jour le logiciel depuis le SGBD
     * @param log le logiciel à mettre à jour
     */
    majLogiciel(log) {
        return __awaiter(this, void 0, void 0, function* () {
            let action = log.estNouveau ? "insert" : "update";
            let retour = yield $.ajax({
                method: "get",
                dataType: "json",
                data: {
                    "action": action,
                    "id": log.id,
                    "nom": log.nom,
                    "version": log.version,
                    "type": log.type,
                    "urlTuto": log.urlTuto,
                    "urlSetup": log.urlSetup,
                    "comment": log.comment,
                    "urlPort": log.urlPort,
                    "urlImage": log.urlImage,
                    "obsolete": log.obsolete ? 1 : 0,
                    "user": log.utilisateur.login,
                    "numero_serie": log.numero_serie
                },
                url: "php/logiciels.php",
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            if (log.estNouveau) {
                log.id = parseInt(retour["id"].AUTO_INCREMENT, 10);
            }
        });
    }
    /**
     * Liste les logiciels avec pagination
     * @param portableOnly indique si l'on ne souhaite que les portables
     * @param cacherObsolete pour indiquer si on cache les logiciels obsolètes ou non
     * @param page numéro de page (commence à 1)
     * @param limite nombre de résultats par page
     * @returns les logiciels de la page + le total
     */
    listAllPagine(portableOnly, cacherObsolete, page, limite) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield $.ajax({
                method: "get",
                data: {
                    "portable": portableOnly,
                    "obsolete": cacherObsolete,
                    "page": page,
                    "limite": limite
                },
                dataType: "json",
                url: "php/logiciels.php",
                error: (obj, status, error) => { console.log(error); }
            });
            let logiciels = yield this.getData(data.logiciels);
            return { logiciels, total: data.total, page: data.page, limite: data.limite };
        });
    }
}
