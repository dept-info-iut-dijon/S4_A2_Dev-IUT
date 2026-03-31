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
 * Vue sur les logiciels
 * */
class VueLogiciels {
    constructor() {
        this.portOnly = document.getElementById("fport");
        this.portOnly.oninput = this.filtrer.bind(this);
        this.cacherObsolete = document.getElementById("fobsolete");
        this.cacherObsolete.oninput = this.filtrer.bind(this);
        this.filtreRien = document.getElementById("all");
        this.filtreRien.oninput = this.choisirTout.bind(this);
        this.filtreFiliere = document.getElementById("year");
        this.filtreFiliere.oninput = this.choisirFilieres.bind(this);
        this.filtreMatiere = document.getElementById("course");
        this.filtreMatiere.onclick = this.choisirMatieres.bind(this);
        this.filtreNom = document.getElementById("name");
        this.filtreNom.onchange = this.choisirNom.bind(this);
        this.filtreTexteNom = document.getElementById("filtrer");
        this.filtreTexteNom.oninput = this.filtrer.bind(this);
        this.listeFilieres = document.getElementById("years");
        this.listeFilieres.oninput = this.filtrer.bind(this);
        this.listeMatieres = document.getElementById("courses");
        this.listeMatieres.oninput = this.filtrer.bind(this);
        this.cbRecent = document.getElementById("cb_recent");
        this.cbRecent.oninput = this.filtrer.bind(this);
        this.filieresDAO = new FiliereDAO();
        this.matieresDAO = new MatiereDAO();
        this.logicielsDAO = new LogicielDAO();
        this.vueModele = new VueLogicielsVM(this.filieresDAO, this.matieresDAO, this.logicielsDAO);
        this.listerFilieres();
        this.listerMatieres();
        document.getElementById("modify").addEventListener("click", () => { this.modifieLogiciel(); });
        document.getElementById("add").addEventListener("click", () => { this.ajouteLogiciel(); });
        document.getElementById("delete").addEventListener("click", () => { this.supprimeLogiciel(); });
        this.currentLog = null;
    }
    /**
     * exécuté quand la vue s'affiche, sur un retour, par exemple
     */
    affiche() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentLog != null) {
                // c'est un retour... il faut recharger le logiciel et l'affiche de nouveau
                this.currentLog = yield this.logicielsDAO.getLogiciel(this.currentLog.id);
                this.afficheLogiciel(this.currentLog);
                // il faudrait modifier la liste aussi...
                let item = document.querySelector(".listitem.selected");
                item.innerHTML = this.currentLog.nomVersion;
            }
        });
    }
    griseTout() {
        this.listeFilieres.disabled = true;
        this.listeMatieres.disabled = true;
        this.filtreTexteNom.disabled = true;
    }
    choisirTout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.griseTout();
            yield this.filtrer();
        });
    }
    choisirFilieres() {
        return __awaiter(this, void 0, void 0, function* () {
            this.griseTout();
            this.listeFilieres.disabled = false;
            yield this.filtrer();
        });
    }
    choisirMatieres() {
        return __awaiter(this, void 0, void 0, function* () {
            this.griseTout();
            this.listeMatieres.disabled = false;
            yield this.filtrer();
        });
    }
    choisirNom() {
        return __awaiter(this, void 0, void 0, function* () {
            this.griseTout();
            this.filtreTexteNom.disabled = false;
            yield this.filtrer();
        });
    }
    supprimeLogiciel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentLog != null) {
                let ok = confirm("Supprimer le logiciel " + this.currentLog.nomVersion + " ? ");
                if (ok) {
                    yield this.logicielsDAO.delLogiciel(this.currentLog);
                    this.effaceLogiciel();
                    this.currentLog = null;
                }
            }
        });
    }
    ajouteLogiciel() {
        window.location.href = "editor.html?id=0";
    }
    modifieLogiciel() {
        if (this.currentLog != null) {
            // aller vers editor.html en lui transmettant currentLog
            window.location.href = "editor.html?id=" + this.currentLog.id.toString();
        }
    }
    listerFilieres() {
        return __awaiter(this, void 0, void 0, function* () {
            let filieres = yield this.vueModele.listeFilieres();
            filieres.forEach((filiere) => {
                let opt = document.createElement("option");
                opt.value = filiere.id.toString();
                opt.innerHTML = filiere.nom;
                $("#years").append(opt);
            });
        });
    }
    listerMatieres() {
        return __awaiter(this, void 0, void 0, function* () {
            let matieres = yield this.vueModele.listeMatieres();
            matieres.forEach((matiere) => {
                let opt = document.createElement("option");
                opt.value = matiere.id.toString();
                opt.innerHTML = matiere.nom;
                $("#courses").append(opt);
            });
        });
    }
    videLogiciels() {
        this.effaceLogiciel();
        $("main .list").html("");
    }
    listerLogiciels(logs) {
        this.videLogiciels(); // vide la liste avant
        logs.forEach((log) => {
            if (!this.cbRecent.checked || log.estRecent) {
                let div = document.createElement("div");
                $("main .list").append(div);
                div.classList.add("listitem");
                /*if (log.estRecent)
                    div.classList.add("emphase"); */
                let p = document.createElement("p");
                p.innerHTML = log.nomVersion;
                div.appendChild(p);
                div.addEventListener("click", () => {
                    $("main .list .listitem").removeClass("selected");
                    div.classList.add("selected");
                    this.afficheLogiciel(log);
                });
            }
        });
    }
    listerTousLogiciels() {
        return __awaiter(this, arguments, void 0, function* (portableOnly = false, cacherObsolete = false) {
            let logs = yield this.vueModele.listeTousLogiciels(portableOnly, cacherObsolete);
            this.listerLogiciels(logs);
        });
    }
    effaceLogiciel() {
        let div = document.getElementById("software");
        div.innerHTML = "";
        $("#actions").addClass("hide");
        this.currentLog = null;
    }
    afficheLogiciel(log) {
        this.effaceLogiciel();
        this.currentLog = log;
        let div = document.getElementById("software");
        let div2 = document.createElement("div");
        div.appendChild(div2);
        div2.id = "softName";
        div2.innerHTML = log.nomVersion;
        div2 = document.createElement("div");
        div2.id = "softType";
        div2.innerHTML = log.type;
        div.appendChild(div2);
        let divlogin = document.createElement("div");
        divlogin.classList.add("admin");
        divlogin.classList.add("info");
        divlogin.classList.add("auteur");
        let login = this.currentLog.utilisateur.nom;
        divlogin.innerHTML = "Logiciel proposé par " + login;
        div.appendChild(divlogin);
        let divnouveau = document.createElement("div");
        divnouveau.classList.add("info");
        if (log.estRecent)
            divnouveau.innerHTML = "nouveau logiciel pour cette année";
        div.appendChild(divnouveau);
        let divimg = document.createElement("div");
        divimg.id = "DivImg";
        div.appendChild(divimg);
        if (log.urlImage != undefined && log.urlImage != null && log.urlImage != "") {
            let img = document.createElement("img");
            img.id = "ImgSoft";
            img.src = log.urlImage;
            divimg.appendChild(img);
        }
        div2 = document.createElement("div");
        div2.id = "comment";
        div2.innerHTML = log.comment;
        div.appendChild(div2);
        if (log.numero_serie != undefined && log.numero_serie != "") {
            let divserie = document.createElement("div");
            divserie.id = "serie";
            divserie.innerHTML = "Numéro de série : <span>" + log.numero_serie + "</span> ";
            let button = document.createElement("button");
            button.innerHTML = "Copier";
            button.onclick = () => __awaiter(this, void 0, void 0, function* () { yield navigator.clipboard.writeText(log.numero_serie); });
            divserie.appendChild(button);
            div.appendChild(divserie);
        }
        if (log.urlTuto != "" && log.urlTuto != null) {
            div2 = document.createElement("div");
            div2.id = "linkTuto";
            let a = document.createElement("a");
            a.href = log.urlTuto;
            a.target = "_blank";
            a.innerHTML = "Lien vers le tutoriel d'installation";
            div2.appendChild(a);
            div.appendChild(div2);
        }
        if (log.urlSetup != "" && log.urlSetup != null) {
            div2 = document.createElement("div");
            div2.id = "linkSetup";
            let a = document.createElement("a");
            a.href = log.urlSetup;
            a.target = "_blank";
            a.innerHTML = "Lien vers l'archive d'installation";
            div2.appendChild(a);
            div.appendChild(div2);
        }
        if (log.urlPort != "" && log.urlPort != null) {
            div2 = document.createElement("div");
            div2.id = "linkPort";
            let a = document.createElement("a");
            a.href = log.urlPort;
            a.target = "_blank";
            a.innerHTML = "Lien vers une version portable";
            div2.appendChild(a);
            div.appendChild(div2);
        }
        $("#actions").removeClass("hide");
    }
    filtrer() {
        return __awaiter(this, void 0, void 0, function* () {
            this.effaceLogiciel();
            if ($("#all").prop("checked")) {
                yield this.listerTousLogiciels(this.portOnly.checked, this.cacherObsolete.checked);
            }
            else if ($("#year").prop("checked")) {
                let id = $("#years option:selected").val();
                let logs = yield this.vueModele.listeLogicielsFiliere(id, this.portOnly.checked, this.cacherObsolete.checked);
                this.listerLogiciels(logs);
            }
            else if ($("#course").prop("checked")) {
                let id = $("#courses option:selected").val();
                let logs = yield this.vueModele.listeLogicielsMatiere(id, this.portOnly.checked, this.cacherObsolete.checked);
                this.listerLogiciels(logs);
            }
            else if ($("#name").prop("checked")) {
                let name = $("#filtrer").val();
                let logs = yield this.vueModele.listeLogicielsNom(name, this.portOnly.checked, this.cacherObsolete.checked);
                this.listerLogiciels(logs);
            }
        });
    }
}
var vue;
window.onload = () => {
    vue = new VueLogiciels();
    initHeader();
};
window.onpageshow = () => {
    vue.affiche();
};
