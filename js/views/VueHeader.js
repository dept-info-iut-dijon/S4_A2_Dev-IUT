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
class VueHeader {
    constructor(user) {
        $("#user").html(user.nom);
        $("#role").html(user.statut);
        if (!user.nom || user.nom == "") {
            $("header *").addClass("hide");
        }
        else {
            $("header *").removeClass("hide");
        }
        if (user.estProf) {
            $(".teacher").removeClass("hide");
        }
        else {
            $(".teacher").addClass("hide");
        }
        if (user.estAdmin) {
            $(".admin").removeClass("hide");
        }
        else {
            $(".admin").addClass("hide");
        }
        $("#disconnect").on("click", () => __awaiter(this, void 0, void 0, function* () { yield this.logOut(); }));
        $("#delete-account").on("click", () => { this.ouvrirModale(); });
        $("#annuler-suppression").on("click", () => { this.fermerModale(); });
        $("#confirmer-suppression").on("click", () => __awaiter(this, void 0, void 0, function* () { yield this.supprimerCompte(user); }));
    }
    logOut() {
        return __awaiter(this, void 0, void 0, function* () {
            let log = new Login();
            yield log.logout();
            window.location.href = "index.html";
        });
    }
    ouvrirModale() {
        $("#confirm-password").val("");
        $("#erreur-suppression").hide();
        document.getElementById("modale-suppression").showModal();
    }
    fermerModale() {
        document.getElementById("modale-suppression").close();
    }
    supprimerCompte(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let password = $("#confirm-password").val();
            let dao = new UtilisateurDao();
            let supprime = yield dao.supprimerCompte(user.login, password);
            if (supprime) {
                window.location.href = "index.html";
            }
            else {
                $("#erreur-suppression").show();
            }
        });
    }
}
function initHeader() {
    return __awaiter(this, void 0, void 0, function* () {
        let dao = new UtilisateurDao();
        let user = yield dao.LireUtilisateurConnecté();
        let storage = new UtilisateurStorage();
        storage.sauve(user);
        let vue = new VueHeader(user);
    });
}
