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
 * Vue pour la fiche d'édition d'un logiciel.
 * L'upload est délégué à FileUploader.
 */
class VueFiche {
    constructor() {
        this.input_serie = document.getElementById("serie");
        this.currentLog = null;
        this.filieresDAO = new FiliereDAO();
        this.matieresDAO = new MatiereDAO();
        this.logicielsDAO = new LogicielDAO();
        this.utilisateursDAO = new UtilisateurDao();
        this.uploader = new FileUploader();
        this.vueModele = new VueLogicielsVM(this.filieresDAO, this.matieresDAO, this.logicielsDAO);
        this.listerFilieres();
        this.listerMatieres();
        let query = window.location.search.substring(1);
        let id = parseInt(query.split("=")[1]);
        if (id > 0)
            this.afficheLogiciel(id);
        $("#add").on("click", () => { this.ajouterLog(); });
        $("#remove").on("click", () => { this.retirerLog(); });
        $("#cancel").on("click", () => {
            if (window.confirm("Les modifications non enregistrées seront perdues. Continuer ?")) {
                window.history.back();
            }
        });
        $("#ok").on("click", () => { this.valider(); });
        $("#urlImage").on("input", () => { this.changeThumb(); });
        let storage = new UtilisateurStorage();
        this.currentUser = storage.charge();
    }
    changeThumb() {
        $("#thumb").prop("src", this.urlDepuisInput("urlImage"));
    }
    afficheLogiciel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentLog = yield this.logicielsDAO.getLogiciel(id);
            $("#name").val(this.currentLog.nom);
            $("#type").val(this.currentLog.type);
            $("#version").val(this.currentLog.version);
            $("#desc").val(this.currentLog.comment);
            $("#setupName").text(this.currentLog.urlSetup);
            $("#tutoName").text(this.currentLog.urlTuto);
            $("#portName").text(this.currentLog.urlPort);
            $("#thumb").prop("src", this.currentLog.urlImage);
            $("#obsolete").prop("checked", this.currentLog.obsolete);
            $("#years .year").prop("checked", false);
            let filieres = yield this.filieresDAO.listeLog(this.currentLog);
            $("#years .year").each((index, element) => {
                let label = element.querySelector("label");
                let cb = element.querySelector("input[type='checkbox']");
                if (label && cb && filieres.find((val) => val.nom == label.innerText) != undefined) {
                    cb.checked = true;
                }
            });
            let matused = yield this.matieresDAO.listLog(this.currentLog);
            this.putMatieres(matused, "#uses");
            this.input_serie.value = this.currentLog.numero_serie;
        });
    }
    putFilieres(filieres, selector) {
        $(selector).html("");
        filieres.forEach((filiere) => {
            let div = document.createElement("div");
            div.classList.add("year");
            let cb = document.createElement("input");
            cb.type = "checkbox";
            cb.value = filiere.id.toString();
            cb.id = "filiere_" + filiere.id;
            let label = document.createElement("label");
            label.htmlFor = cb.id;
            label.innerHTML = filiere.nom;
            div.appendChild(cb);
            div.appendChild(label);
            $(selector).append(div);
        });
    }
    listerFilieres() {
        return __awaiter(this, void 0, void 0, function* () {
            let filieres = yield this.vueModele.listeFilieres();
            this.putFilieres(filieres, "#years");
        });
    }
    listerMatieres() {
        return __awaiter(this, void 0, void 0, function* () {
            let matieres = yield this.vueModele.listeMatieres();
            this.putMatieres(matieres, "#courses");
        });
    }
    putMatieres(matieres, selector) {
        $(selector).html("");
        matieres.forEach((matiere) => {
            let opt = document.createElement("option");
            opt.value = matiere.id.toString();
            opt.classList.add("course");
            opt.innerHTML = matiere.nom;
            $(selector).append(opt);
        });
    }
    ajouterLog() {
        let opt = $("#courses option:selected");
        $("#uses").append(opt);
    }
    retirerLog() {
        let opt = $("#uses option:selected");
        $("#courses").append(opt);
    }
    urlDepuisInput(id) {
        let input = document.getElementById(id);
        let files = input.files;
        let file = "";
        if (files && files.length > 0) {
            let url = files[0].name;
            file = "files/" + url;
        }
        return file;
    }
    lireChamps(log) {
        log.comment = $("#desc").val();
        log.nom = $("#name").val();
        log.type = $("#type").val();
        log.version = $("#version").val();
        log.obsolete = $("#obsolete").prop("checked");
        log.numero_serie = this.input_serie.value;
        let url = this.urlDepuisInput("urlTuto");
        if (url != "")
            log.urlTuto = url;
        url = this.urlDepuisInput("urlSetup");
        if (url != "")
            log.urlSetup = url;
        url = this.urlDepuisInput("urlPort");
        if (url != "")
            log.urlPort = url;
        url = this.urlDepuisInput("urlImage");
        if (url != "")
            log.urlImage = url;
    }
    valider() {
        return __awaiter(this, void 0, void 0, function* () {
            let nouveau = false;
            try {
                if (this.currentLog == null) {
                    this.currentLog = new Logiciel();
                    nouveau = true;
                    this.currentLog.utilisateur = this.currentUser;
                    this.utilisateursDAO.ajouteUtilisateur(this.currentUser);
                }
                {
                    $("#ok").addClass("hide");
                    $("#cancel").addClass("hide");
                    this.lireChamps(this.currentLog);
                    yield this.logicielsDAO.majLogiciel(this.currentLog);
                    let filieres = [];
                    $(".year input").each((index, element) => {
                        const cb = element;
                        if (cb.checked)
                            filieres.push(parseInt(cb.value));
                    });
                    yield this.filieresDAO.lierFilieres(this.currentLog, filieres);
                    let matieres = [];
                    $("#uses option").each((index, element) => {
                        matieres.push(parseInt(element.value));
                    });
                    yield this.matieresDAO.lierMatieres(this.currentLog, matieres);
                    yield this.uploader.upload("setup");
                    yield this.uploader.upload("tuto");
                    yield this.uploader.upload("port");
                    yield this.uploader.upload("image");
                    if (nouveau)
                        alert("Le logiciel a été soumis à l'administrateur.");
                    else
                        alert("Modifications apportées au logiciel");
                    window.history.back();
                }
            }
            catch (x) {
                alert(x.message);
            }
        });
    }
}
window.onload = () => {
    let view = new VueFiche();
    initHeader();
};
