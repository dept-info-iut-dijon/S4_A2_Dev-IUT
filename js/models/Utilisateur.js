"use strict";
/**
 * Représente l'utilisateur connecté
 * */
class Utilisateur {
    get login() {
        return this._login;
    }
    set login(value) {
        this._login = value;
    }
    get nom() {
        return this._nom;
    }
    set nom(value) {
        this._nom = value;
    }
    get statut() {
        return this._statut;
    }
    set statut(value) {
        this._statut = value;
    }
    get departement() {
        return this._departement;
    }
    set departement(value) {
        this._departement = value;
    }
    get role() {
        return this._role;
    }
    set role(value) {
        this._role = value;
    }
    get estAdmin() {
        return this._role === 1;
    }
    get estProf() {
        return this._statut.toLowerCase().substr(0, 3) == "ens";
    }
    constructor(login = "") {
        this._login = login;
        this._statut = "enseignant";
        this._role = 2;
    }
}
