/**
 * Vue sur les logiciels.
 * SRP : cette classe gère uniquement l'affichage et les interactions utilisateur.
 * La pagination est déléguée à VuePagination.
 * La logique de filtre est déléguée à FiltreLogiciels.
 */
class VueLogiciels
{
    private vueModele: VueLogicielsVM;
    private filieresDAO: FiliereDAO;
    private matieresDAO: MatiereDAO;
    private logicielsDAO: LogicielDAO;
    private currentLog: Logiciel | null;

    private portOnly: HTMLInputElement;
    private cacherObsolete: HTMLInputElement;
    private filtreTexteNom: HTMLInputElement;
    private listeFilieres: HTMLSelectElement;
    private listeMatieres: HTMLSelectElement;
    private cbRecent: HTMLInputElement;

    private currentPage: number = 1;
    private readonly LIMITE: number = 20;

    // SRP : délégation à des classes spécialisées
    private pagination: VuePagination;
    private filtre: FiltreLogiciels;

    constructor()
    {
        this.portOnly        = document.getElementById("fport") as HTMLInputElement;
        this.cacherObsolete  = document.getElementById("fobsolete") as HTMLInputElement;
        this.filtreTexteNom  = document.getElementById("filtrer") as HTMLInputElement;
        this.listeFilieres   = document.getElementById("years") as HTMLSelectElement;
        this.listeMatieres   = document.getElementById("courses") as HTMLSelectElement;
        this.cbRecent        = document.getElementById("cb_recent") as HTMLInputElement;

        this.filieresDAO  = new FiliereDAO();
        this.matieresDAO  = new MatiereDAO();
        this.logicielsDAO = new LogicielDAO();
        this.vueModele    = new VueLogicielsVM(this.filieresDAO, this.matieresDAO, this.logicielsDAO);
        this.pagination   = new VuePagination((page) => { this.currentPage = page; this.filtrer(); });
        this.filtre       = new FiltreLogiciels(this.vueModele);

        this.brancherEvenements();
        this.chargerFilieres();
        this.chargerMatieres();

        this.currentLog = null;
    }

    private brancherEvenements() {
        this.portOnly.oninput       = this.filtrer.bind(this);
        this.cacherObsolete.oninput = this.filtrer.bind(this);
        this.filtreTexteNom.oninput = this.filtrer.bind(this);
        this.listeFilieres.oninput  = this.filtrer.bind(this);
        this.listeMatieres.oninput  = this.filtrer.bind(this);
        this.cbRecent.oninput       = this.filtrer.bind(this);

        (document.getElementById("all") as HTMLInputElement).oninput    = () => { this.currentPage = 1; this.griseTout(); this.filtrer(); };
        (document.getElementById("year") as HTMLInputElement).oninput   = () => { this.currentPage = 1; this.griseTout(); this.listeFilieres.disabled = false; this.filtrer(); };
        (document.getElementById("course") as HTMLInputElement).onclick = () => { this.currentPage = 1; this.griseTout(); this.listeMatieres.disabled = false; this.filtrer(); };
        (document.getElementById("name") as HTMLInputElement).onchange  = () => { this.currentPage = 1; this.griseTout(); this.filtreTexteNom.disabled = false; this.filtrer(); };

        document.getElementById("modify")!.addEventListener("click", () => this.modifieLogiciel());
        document.getElementById("add")!.addEventListener("click", () => this.ajouteLogiciel());
        document.getElementById("delete")!.addEventListener("click", () => this.supprimeLogiciel());
    }

    public async affiche() {
        if (this.currentLog != null) {
            this.currentLog = await this.logicielsDAO.getLogiciel(this.currentLog.id);
            this.afficheLogiciel(this.currentLog);
            let item = document.querySelector(".listitem.selected") as HTMLDivElement;
            if (item) item.innerHTML = this.currentLog.nomVersion;
        }
    }

    private griseTout() {
        this.listeFilieres.disabled  = true;
        this.listeMatieres.disabled  = true;
        this.filtreTexteNom.disabled = true;
    }

    private async supprimeLogiciel() {
        if (this.currentLog != null) {
            let ok = confirm("Supprimer le logiciel " + this.currentLog.nomVersion + " ?");
            if (ok) {
                await this.logicielsDAO.delLogiciel(this.currentLog);
                this.effaceLogiciel();
                this.currentLog = null;
            }
        }
    }

    private ajouteLogiciel() {
        window.location.href = "editor.html?id=0";
    }

    private modifieLogiciel() {
        if (this.currentLog != null) {
            window.location.href = "editor.html?id=" + this.currentLog.id.toString();
        }
    }

    private async chargerFilieres() {
        let filieres = await this.vueModele.listeFilieres();
        filieres.forEach((filiere: Filiere) => {
            let opt = document.createElement("option");
            opt.value = filiere.id.toString();
            opt.innerHTML = filiere.nom;
            $("#years").append(opt);
        });
    }

    private async chargerMatieres() {
        let matieres = await this.vueModele.listeMatieres();
        matieres.forEach((matiere: Matiere) => {
            let opt = document.createElement("option");
            opt.value = matiere.id.toString();
            opt.innerHTML = matiere.nom;
            $("#courses").append(opt);
        });
    }

    private viderListe() {
        this.effaceLogiciel();
        $("main .list").html("");
    }

    private afficherListe(logs: Array<Logiciel>) {
        this.viderListe();
        logs.forEach((log: Logiciel) => {
            if (!this.cbRecent.checked || log.estRecent) {
                let div = document.createElement("div");
                div.classList.add("listitem");
                let p = document.createElement("p");
                p.innerHTML = log.nomVersion;
                div.appendChild(p);
                div.addEventListener("click", () => {
                    $("main .list .listitem").removeClass("selected");
                    div.classList.add("selected");
                    this.afficheLogiciel(log);
                });
                $("main .list").append(div);
            }
        });
    }

    private effaceLogiciel() {
        document.getElementById("software")!.innerHTML = "";
        $("#actions").addClass("hide");
        this.currentLog = null;
    }

    private afficheLogiciel(log: Logiciel) {
        this.effaceLogiciel();
        this.currentLog = log;
        const div = document.getElementById("software")!;

        const divNom = document.createElement("div");
        divNom.id = "softName";
        divNom.innerHTML = log.nomVersion;
        div.appendChild(divNom);

        const divType = document.createElement("div");
        divType.id = "softType";
        divType.innerHTML = log.type;
        div.appendChild(divType);

        const divAuteur = document.createElement("div");
        divAuteur.classList.add("admin", "info", "auteur");
        divAuteur.innerHTML = "Logiciel proposé par " + log.utilisateur.nom;
        div.appendChild(divAuteur);

        const divNouveau = document.createElement("div");
        divNouveau.classList.add("info");
        if (log.estRecent) divNouveau.innerHTML = "nouveau logiciel pour cette année";
        div.appendChild(divNouveau);

        const divImg = document.createElement("div");
        divImg.id = "DivImg";
        if (log.urlImage) {
            const img = document.createElement("img");
            img.id = "ImgSoft";
            img.src = log.urlImage;
            divImg.appendChild(img);
        }
        div.appendChild(divImg);

        const divComment = document.createElement("div");
        divComment.id = "comment";
        divComment.innerHTML = log.comment;
        div.appendChild(divComment);

        if (log.numero_serie) {
            const divSerie = document.createElement("div");
            divSerie.id = "serie";
            divSerie.innerHTML = "Numéro de série : <span>" + log.numero_serie + "</span> ";
            const btnCopier = document.createElement("button");
            btnCopier.innerHTML = "Copier";
            btnCopier.onclick = async () => { await navigator.clipboard.writeText(log.numero_serie); };
            divSerie.appendChild(btnCopier);
            div.appendChild(divSerie);
        }

        this.ajouterLien(div, "linkTuto", log.urlTuto, "Lien vers le tutoriel d'installation");
        this.ajouterLien(div, "linkSetup", log.urlSetup, "Lien vers l'archive d'installation");
        this.ajouterLien(div, "linkPort", log.urlPort, "Lien vers une version portable");

        $("#actions").removeClass("hide");
    }

    private ajouterLien(parent: HTMLElement, id: string, url: string, texte: string) {
        if (!url) return;
        let div = document.createElement("div");
        div.id = id;
        let a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.innerHTML = texte;
        div.appendChild(a);
        parent.appendChild(div);
    }

    private typeFiltre(): string {
        if ($("#all").prop("checked"))    return "all";
        if ($("#year").prop("checked"))   return "year";
        if ($("#course").prop("checked")) return "course";
        if ($("#name").prop("checked"))   return "name";
        return "all";
    }

    private idFiltre(): any {
        if ($("#year").prop("checked"))   return $("#years option:selected").val();
        if ($("#course").prop("checked")) return $("#courses option:selected").val();
        if ($("#name").prop("checked"))   return $("#filtrer").val();
        return null;
    }

    public async filtrer() {
        this.effaceLogiciel();
        const result = await this.filtre.filtrer(
            this.typeFiltre(),
            this.idFiltre(),
            this.portOnly.checked,
            this.cacherObsolete.checked,
            this.currentPage,
            this.LIMITE
        );
        this.afficherListe(result.logiciels);
        this.pagination.afficher(result.total, result.page, result.limite);
    }
}

var vue: VueLogiciels;

window.onload = async () => {
    await initHeader();
    vue = new VueLogiciels();
    await vue.filtrer();
};

window.onpageshow = () => {
    if (vue) vue.affiche();
};
