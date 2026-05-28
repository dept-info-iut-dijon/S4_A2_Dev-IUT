"use strict";
/**
 * Permet de g�rer la persistance des donn�es de l'utilisateur
 */
class UtilisateurStorage {
    /**
     * Sauve l'utilisateur
     * @param user l'utilisateur
     */
    sauve(user) {
        let str = JSON.stringify(user);
        window.sessionStorage.setItem("connectedUser", str);
    }
    /**
     * Charge l'utilisateur
     * @returns l'utilisateur
     */
    charge() {
        var _a, _b, _c, _d, _e, _f;
        let str = window.sessionStorage.getItem("connectedUser");
        let user = new Utilisateur();
        if (str) {
            let obj = JSON.parse(str);
            user.nom = (_a = obj.nom) !== null && _a !== void 0 ? _a : obj._nom;
            user.statut = (_b = obj.statut) !== null && _b !== void 0 ? _b : obj._statut;
            user.login = (_c = obj.login) !== null && _c !== void 0 ? _c : obj._login;
            user.departement = (_d = obj.departement) !== null && _d !== void 0 ? _d : obj._departement;
            user.role = (_f = (_e = obj.role) !== null && _e !== void 0 ? _e : obj._role) !== null && _f !== void 0 ? _f : 2;
        }
        return user;
    }
}
