/**
 * Vue pour la fiche d'édition d'un logiciel.
 * SRP : cette classe gère l'affichage et les interactions du formulaire.
 * L'upload est délégué à FileUploader.
 */
class VueFiche
{
    private vueModele: VueLogicielsVM;
    private filieresDAO: FiliereDAO;
    private matieresDAO: MatiereDAO;
    private logicielsDAO: LogicielDAO;
    private utilisateursDAO: UtilisateurDao;
    private uploader: FileUploader;
    private currentLog: Logiciel | null;
    private currentUser: Utilisateur;
    private input_serie: HTMLInputElement;

    constructor() {
        this.input_serie     = document.getElementById("serie") as HTMLInputElement;
        this.currentLog      = null;
        this.filieresDAO     = new FiliereDAO();
        this.matieresDAO     = new MatiereDAO();
        this.logicielsDAO    = new LogicielDAO();
        this.utilisateursDAO = new UtilisateurDao();
        this.uploader        = new FileUploader();
        this.vueModele       = new VueLogicielsVM(this.filieresDAO, this.matieresDAO, this.logicielsDAO);

        this.listerFilieres();
        this.listerMatieres();

        let query = window.location.search.substring(1);
        let id    = parseInt(query.split("=")[1]);
        if (id > 0)
            this.afficheLogiciel(id);

        $("#add").on("click",      () => this.ajouterLog());
        $("#remove").on("click",   () => this.retirerLog());
        $("#cancel").on("click",   () => window.history.back());
        $("#ok").on("click",       () => this.valider());
        $("#urlImage").on("input", () => this.changeThumb());

        let storage     = new UtilisateurStorage();
        this.currentUser = storage.charge();
    }

    private changeThumb() {
        $("#thumb").prop("src", this.urlDepuisInput("urlImage"));
    }

    private async afficheLogiciel(id: number) {
        this.currentLog = await this.logicielsDAO.getLogiciel(id);

        ($("#name") as any).val(this.currentLog.nom);
        ($("#type") as any).val(this.currentLog.type);
        ($("#version") as any).val(this.currentLog.version);
        ($("#desc") as any).val(this.currentLog.comment);

        $("#setupName").text(this.currentLog.urlSetup);
        $("#tutoName").text(this.currentLog.urlTuto);
        $("#portName").text(this.currentLog.urlPort);
        $("#thumb").prop("src", this.currentLog.urlImage);
        $("#obsolete").prop("checked", this.currentLog.obsolete);

        $("#years .year").prop("checked", false);
        let filieres = await this.filieresDAO.listeLog(this.currentLog);
        $("#years .year label").each((index, element: Element) => {
            const el = element as HTMLElement;
            if (filieres.find((f) => f.nom == el.innerText) != undefined) {
                (el.children.item(0) as HTMLInputElement).checked = true;
            }
        });

        let matused = await this.matieresDAO.listLog(this.currentLog);
        this.putMatieres(matused, "#uses");

        this.input_serie.value = this.currentLog.numero_serie;
    }

    private putFilieres(filieres: Array<Filiere>, selector: string) {
        $(selector).html("");
        filieres.forEach((filiere: Filiere) => {
            let div   = document.createElement("div");
            div.classList.add("year");
            let label = document.createElement("label");
            label.innerHTML = filiere.nom;
            let cb    = document.createElement("input");
            cb.type   = "checkbox";
            cb.value  = filiere.id.toString();
            label.appendChild(cb);
            div.appendChild(label);
            $(selector).append(div);
        });
    }

    private async listerFilieres() {
        let filieres = await this.vueModele.listeFilieres();
        this.putFilieres(filieres, "#years");
    }

    private async listerMatieres() {
        let matieres = await this.vueModele.listeMatieres();
        this.putMatieres(matieres, "#courses");
    }

    private putMatieres(matieres: Array<Matiere>, selector: string) {
        $(selector).html("");
        matieres.forEach((matiere: Matiere) => {
            let opt = document.createElement("option");
            opt.value = matiere.id.toString();
            opt.classList.add("course");
            opt.innerHTML = matiere.nom;
            $(selector).append(opt);
        });
    }

    private ajouterLog() {
        let opt = $("#courses option:selected");
        $("#uses").append(opt);
    }

    private retirerLog() {
        let opt = $("#uses option:selected");
        $("#courses").append(opt);
    }

    private urlDepuisInput(id: string): string {
        let input = document.getElementById(id) as HTMLInputElement;
        if (input.files && input.files.length > 0)
            return "files/" + input.files[0].name;
        return "";
    }

    private lireChamps(log: Logiciel) {
        log.comment      = ($("#desc") as any).val();
        log.nom          = ($("#name") as any).val();
        log.type         = ($("#type") as any).val();
        log.version      = ($("#version") as any).val();
        log.obsolete     = ($("#obsolete") as any).prop("checked");
        log.numero_serie = this.input_serie.value;

        let url = this.urlDepuisInput("urlTuto");  if (url) log.urlTuto  = url;
            url = this.urlDepuisInput("urlSetup"); if (url) log.urlSetup = url;
            url = this.urlDepuisInput("urlPort");  if (url) log.urlPort  = url;
            url = this.urlDepuisInput("urlImage"); if (url) log.urlImage = url;
    }

    private async valider() {
        try {
            let nouveau = false;
            if (this.currentLog == null) {
                this.currentLog = new Logiciel();
                nouveau = true;
                this.currentLog.utilisateur = this.currentUser;
                this.utilisateursDAO.ajouteUtilisateur(this.currentUser);
            }

            $("#ok").addClass("hide");
            $("#cancel").addClass("hide");

            this.lireChamps(this.currentLog);
            await this.logicielsDAO.majLogiciel(this.currentLog);

            let filieres: number[] = [];
            $(".year input").each((i, el: Element) => { const cb = el as HTMLInputElement; if (cb.checked) filieres.push(parseInt(cb.value)); });
            await this.filieresDAO.lierFilieres(this.currentLog!, filieres);

            let matieres: number[] = [];
            $("#uses option").each((i, el: Element) => { matieres.push(parseInt((el as HTMLOptionElement).value)); });
            await this.matieresDAO.lierMatieres(this.currentLog!, matieres);

            // SRP : l'upload est délégué à FileUploader
            await this.uploader.upload("setup");
            await this.uploader.upload("tuto");
            await this.uploader.upload("port");
            await this.uploader.upload("image");

            alert(nouveau ? "Le logiciel a été soumis à l'administrateur." : "Modifications apportées au logiciel");
            window.history.back();
        }
        catch (x: unknown) {
            alert(x instanceof Error ? x.message : String(x));
        }
    }
}

window.onload = () => {
    let view = new VueFiche();
    initHeader();
};
