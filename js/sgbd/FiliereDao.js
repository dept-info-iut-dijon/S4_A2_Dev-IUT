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
 * Lien avec le coté serveur pour les filières
 * */
class FiliereDAO {
    /**
     * Modifie dans la BDD les liens entre un logiciel et les filières l'utilisant
     * @param currentLog le logiciel
     * @param filieres la liste des ID des filières liées
     */
    lierFilieres(currentLog, filieres) {
        return __awaiter(this, void 0, void 0, function* () {
            // supprimer les filières anciennes
            let data = yield $.ajax({
                method: "get",
                url: "php/filieres.php",
                dataType: "json",
                data: { "action": "delete", "idlog": currentLog.id },
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            console.log(data);
            // lier les nouvelles
            filieres.forEach((id) => __awaiter(this, void 0, void 0, function* () {
                let test = yield $.ajax({
                    method: "get",
                    url: "php/filieres.php",
                    dataType: "json",
                    data: { "action": "insert", "idlog": currentLog.id, "idf": id },
                    error: (obj, status, error) => { console.log(error); } // todo better
                });
                console.log(test);
            }));
        });
    }
    /* utile ? get(id: number): Filiere
     {
         // todo read from database
         let filiere = new Filiere();
         filiere.id = id;
         filiere.nom = "BUT 1A";
         return filiere;
     } */
    /**
     * Liste toutes les filières
     * @returns les filières
     * */
    liste() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield $.ajax({
                method: "get",
                dataType: "json",
                url: "php/filieres.php",
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            return this.getData(data);
        });
    }
    getData(data) {
        let list = new Array();
        data.forEach((obj) => {
            let filiere = new Filiere();
            filiere.id = obj.id;
            filiere.nom = obj.nom;
            list.push(filiere);
        });
        return list;
    }
    /**
     * Liste les filières utilisant un logiciel
     * @param log le logiciel utilisé
     * @returns la liste des filières
     */
    listeLog(log) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield $.ajax({
                method: "get",
                dataType: "json",
                data: { "id": log.id },
                url: "php/filieres.php",
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            return this.getData(data);
        });
    }
}
