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
 * Lien avec le back, pour les matières
 * */
class MatiereDAO {
    /**
     * Modifie dans la BD les matières liées au logiciel
     * @param currentLog le logiciel
     * @param matieres les ID des matières
     */
    lierMatieres(currentLog, matieres) {
        return __awaiter(this, void 0, void 0, function* () {
            // supprime les anciennes
            let data = yield $.ajax({
                method: "get",
                url: "php/matieres.php",
                dataType: "json",
                data: { "action": "delete", "idlog": currentLog.id },
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            // rajoute les nouvelles
            matieres.forEach((id) => __awaiter(this, void 0, void 0, function* () {
                yield $.ajax({
                    method: "get",
                    url: "php/matieres.php",
                    dataType: "json",
                    data: { "action": "insert", "idlog": currentLog.id, "idm": id },
                    error: (obj, status, error) => { console.log(error); } // todo better
                });
            }));
        });
    }
    /* utile ?
    public get(id: number): Matiere
    {
        // todo utiliser la BD
        let mat = new Matiere();
        mat.id = 1;
        mat.nom = "UE1-Développement";
        return mat;
    }*/
    /**
     * Liste toutes les matières
     * @returns les matières
     * */
    liste() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield $.ajax({
                method: "get",
                dataType: "json",
                url: "php/matieres.php",
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            return this.getData(data);
        });
    }
    /**
     * Liste les matières utilisant ce logiciel
     * @param log le logiciel
     * @returns la liste des matières
     */
    listLog(log) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield $.ajax({
                method: "get",
                dataType: "json",
                data: { "idlog": log.id },
                url: "php/matieres.php",
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            return this.getData(data);
        });
    }
    getData(data) {
        let list = new Array();
        data.forEach((obj) => {
            let mat = new Matiere();
            mat.id = obj.id;
            mat.nom = obj.nom;
            mat.code = obj.code;
            list.push(mat);
        });
        return list;
    }
}
