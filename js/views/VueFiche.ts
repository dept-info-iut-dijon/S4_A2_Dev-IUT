/**
 * Vue pour la fiche d'édition d'un logiciel
 */
class VueFiche
{
    private vueModele: VueLogicielsVM;
    private filieresDAO: FiliereDAO;
    private matieresDAO: MatiereDAO;
    private logicielsDAO: LogicielDAO;
    private utilisateursDAO: UtilisateurDao;
    private currentLog: Logiciel;
    private currentUser: Utilisateur;
    private input_serie: HTMLInputElement;
    constructor() {

        this.input_serie = document.getElementById("serie") as HTMLInputElement;
        this.currentLog = null; 
        this.filieresDAO = new FiliereDAO();
        this.matieresDAO = new MatiereDAO();
        this.logicielsDAO = new LogicielDAO();
        this.utilisateursDAO = new UtilisateurDao();
        this.vueModele = new VueLogicielsVM(this.filieresDAO, this.matieresDAO, this.logicielsDAO);
        this.listerFilieres();
        this.listerMatieres();

        // récupère l'id via la requête
        let query = window.location.search.substring(1);
        let id = parseInt(query.split("=")[1]);
        if(id>0) // modification, pas création
            this.afficheLogiciel(id);

        // liaison des events
        $("#add").on("click", () => { this.ajouterLog(); });
        $("#remove").on("click", () => { this.retirerLog(); });
        $("#cancel").on("click", () => { window.history.back(); });
        $("#ok").on("click", () => { this.valider(); });
        $("#urlImage").on("input", () => { this.changeThumb(); });

        // récupère l'utilisateur connecté
        let storage = new UtilisateurStorage();
        this.currentUser = storage.charge();
    }

    private changeThumb()
    {
        $("#thumb").prop("src", this.getFileName("urlImage"));
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
        $("#years .year label").each((index, element: HTMLElement) => {
            if (filieres.find((val) => { return val.nom == element.innerText; }) != undefined)
            {
                let cb: HTMLInputElement = element.children.item(0) as HTMLInputElement;
                cb.checked = true;
            }
        });
        
        let matused = await this.matieresDAO.listLog(this.currentLog);
        this.putMatieres(matused, "#uses");

        this.input_serie.value = this.currentLog.numero_serie;
    }

    private putFilieres(filieres: Array<Filiere>, selector: string)
    {
        $(selector).html("");
        filieres.forEach((filiere: Filiere) => {
            let div = document.createElement("div");
            div.classList.add("year");
            let label = document.createElement("label");
            label.innerHTML = filiere.nom;
            let cb = document.createElement("input");
            cb.type = "checkbox";
            cb.value = filiere.id.toString();
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

    private putMatieres(matieres: Array<Matiere>, selector: string)
    {
        $(selector).html("")
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
        // ajoute l'option sélectionnée dans courses à la liste uses
        let opt = $("#courses option:selected");
        $("#uses").append(opt);
    }

    private retirerLog()
    {
        // retire l'option sélectionnée dans la liste uses        
        let opt = $("#uses option:selected");
        $("#courses").append(opt);
    }

    private getFileName(id: string): string {
        let input = document.getElementById(id) as HTMLInputElement;
        let files = input.files;
        let file = "";
        if (files.length > 0) {
            let url = files[0].name;            
            file = "files/" + url;
        }
        return file;
    }

    private lireChamps(log: Logiciel)
    {
        // récupère les champs saisis par l'utilisateur et modifie le logiciel en conséquence
        log.comment = $("#desc").val();
        log.nom = $("#name").val();
        log.type = $("#type").val();
        log.version = $("#version").val();
        log.obsolete = $("#obsolete").prop("checked");
        log.numero_serie = this.input_serie.value;

        //récupérer les noms des URL
        let url = this.getFileName("urlTuto");
        if (url != "")
            log.urlTuto = url;
        url = this.getFileName("urlSetup");
        if (url != "")
            log.urlSetup = url;
        url = this.getFileName("urlPort");
        if (url != "")
            log.urlPort = url;
        url = this.getFileName("urlImage");
        if (url != "")
            log.urlImage = url;
    }
    private async valider()
    {
        // valide les modifications et ferme la fenêtre
        let nouveau = false;
        try {
            if (this.currentLog == null) // création, pas modification
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
                // gérer les filières liées
                let filieres = [];
                $(".year input").each((index, element: HTMLInputElement) => {
                    if (element.checked)
                    {
                        filieres.push(element.value);
                    }
                    
                });
                await this.filieresDAO.lierFilieres(this.currentLog, filieres);
                // gérer les matières liées
                let matieres = [];
                $("#uses option").each((index, element: HTMLOptionElement) => {
                    matieres.push(element.value);
                });
                await this.matieresDAO.lierMatieres(this.currentLog, matieres);

                // gérer les fichiers uploadés
                await this.upload("setup");
                await this.upload("tuto");
                await this.upload("port");
                await this.upload("image");
                if (nouveau)
                    alert("Le logiciel a été soumis à l'administrateur.");
                else
                    alert("Modifications apportées au logiciel");
                window.history.back();
            }
        }
        catch (x)
        {
            alert(x.message);
        }
    }
    private async upload(id: string) {
        let selectorFile = "#" + id + " input[type='file']";
        let selectorRange = "#" + id + " input[type='range']";
        let input = document.querySelector(selectorFile) as HTMLInputElement;
        let files = input.files;
        if (files.length > 0)
        {
            let formData = new FormData();
            formData.append("file", files[0]);

            $(selectorRange).removeClass("hide");
            let data = await $.ajax({
                xhr: () => {
                    let xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", (evt) => {
                        if (evt.lengthComputable)
                        {
                            let complete = (evt.loaded / evt.total) * 100;
                            $(selectorRange).val(complete);
                        }
                    },false);
                    return xhr;
                },
                method: "post",
                url: "php/upload.php",
                data: formData,
                contentType: false,
                processData: false,                
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            console.log(data); // todo better
            $(selectorRange).addClass("hide");
        }
    }
}

window.onload = () => {
    let view = new VueFiche();
    initHeader();
}