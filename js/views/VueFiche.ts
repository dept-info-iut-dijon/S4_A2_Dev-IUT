/**
 * Vue pour la fiche d'édition d'un logiciel.
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
        this.input_serie = document.getElementById("serie") as HTMLInputElement;
        this.currentLog = null;
        this.filieresDAO = new FiliereDAO();
        this.matieresDAO = new MatiereDAO();
        this.logicielsDAO = new LogicielDAO();
        this.utilisateursDAO = new UtilisateurDao();
        this.uploader        = new FileUploader();
        this.vueModele       = new VueLogicielsVM(this.filieresDAO, this.matieresDAO, this.logicielsDAO);

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

    private changeThumb() {
        $("#thumb").prop("src", this.urlDepuisInput("urlImage"));
    }

    private async afficheLogiciel(id: number) {
        this.currentLog = await this.logicielsDAO.getLogiciel(id);

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
        let filieres = await this.filieresDAO.listeLog(this.currentLog);

        $("#years .year").each((index, element: Element) => {
            const el = element as HTMLElement;
            let label = el.querySelector("label");
            let cb = el.querySelector("input[type='checkbox']") as HTMLInputElement;
            if (label && cb && filieres.find((val) => val.nom == label.innerText) != undefined) {
                cb.checked = true;
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

    private async listerFilieres() {
        let filieres = await this.vueModele.listeFilieres();
        this.putFilieres(filieres, "#years");
    }

    private async listerMatieres() {
        let matieres = await this.vueModele.listeMatieres();
        this.putMatieres(matieres, "#courses");
    }

    private putMatieres(matieres: Array<Matiere>, selector: string)
    {
        $(selector).html("");
        matieres.forEach((matiere: Matiere) => {
            let opt = document.createElement("option");
            opt.value = matiere.id.toString();
            opt.classList.add("course");
            opt.innerHTML = matiere.nom;
            $(selector).append(opt);
        });
    }

    private ajouterLog()
    {
        let opt = $("#courses option:selected");
        $("#uses").append(opt);
    }

    private retirerLog()
    {
        let opt = $("#uses option:selected");
        $("#courses").append(opt);
    }

    private urlDepuisInput(id: string): string {
        let input = document.getElementById(id) as HTMLInputElement;
        let files = input.files;
        let file = "";
        if (files && files.length > 0) {
            let url = files[0].name;
            file = "files/" + url;
        }
        return file;
    }

    private lireChamps(log: Logiciel)
    {
        log.comment = $("#desc").val();
        log.nom = $("#name").val();
        log.type = $("#type").val();
        log.version = $("#version").val();
        log.obsolete = $("#obsolete").prop("checked");
        log.numero_serie = this.input_serie.value;

        let url = this.urlDepuisInput("urlTuto");
        if (url != "") log.urlTuto = url;
        url = this.urlDepuisInput("urlSetup");
        if (url != "") log.urlSetup = url;
        url = this.urlDepuisInput("urlPort");
        if (url != "") log.urlPort = url;
        url = this.urlDepuisInput("urlImage");
        if (url != "") log.urlImage = url;
    }

    private async valider()
    {
        let nouveau = false;
        try {
            if (this.currentLog == null)
            {
                this.currentLog = new Logiciel();
                nouveau = true;
                this.currentLog.utilisateur = this.currentUser;
                this.utilisateursDAO.ajouteUtilisateur(this.currentUser);
            }
            {
                $("#ok").addClass("hide");
                $("#cancel").addClass("hide");
                this.lireChamps(this.currentLog);
                await this.logicielsDAO.majLogiciel(this.currentLog);

                let filieres: number[] = [];
                $(".year input").each((index, element: Element) => {
                    const cb = element as HTMLInputElement;
                    if (cb.checked) filieres.push(parseInt(cb.value));
                });
                await this.filieresDAO.lierFilieres(this.currentLog, filieres);

                let matieres: number[] = [];
                $("#uses option").each((index, element: Element) => {
                    matieres.push(parseInt((element as HTMLOptionElement).value));
                });
                await this.matieresDAO.lierMatieres(this.currentLog, matieres);

                await this.uploader.upload("setup");
                await this.uploader.upload("tuto");
                await this.uploader.upload("port");
                await this.uploader.upload("image");

                if (nouveau)
                    alert("Le logiciel a été soumis à l'administrateur.");
                else
                    alert("Modifications apportées au logiciel");
                window.history.back();
            }
        }
        catch (x)
        {
            alert(x instanceof Error ? x.message : String(x));
        }
    }

}

window.onload = () => {
    let view = new VueFiche();
    initHeader();
};
