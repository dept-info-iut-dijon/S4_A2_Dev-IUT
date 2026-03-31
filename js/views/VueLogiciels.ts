/**
 * Vue sur les logiciels
 * */
class VueLogiciels
{
    private vueModele: VueLogicielsVM;
    private filieresDAO: FiliereDAO;
    private matieresDAO: MatiereDAO;
    private logicielsDAO: LogicielDAO;
    private currentLog: Logiciel;
    private portOnly: HTMLInputElement; 
    private cacherObsolete: HTMLInputElement;
    private filtreRien: HTMLInputElement;
    private filtreFiliere: HTMLInputElement;
    private filtreMatiere: HTMLInputElement;
    private filtreNom: HTMLInputElement;
    private filtreTexteNom: HTMLInputElement;
    private listeFilieres: HTMLSelectElement;
    private listeMatieres: HTMLSelectElement;
    private cbRecent: HTMLInputElement;
    constructor()
    {
        this.portOnly = document.getElementById("fport") as HTMLInputElement;
        this.portOnly.oninput = this.filtrer.bind(this);
        this.cacherObsolete = document.getElementById("fobsolete") as HTMLInputElement;
        this.cacherObsolete.oninput = this.filtrer.bind(this);
        this.filtreRien = document.getElementById("all") as HTMLInputElement;
        this.filtreRien.oninput = this.choisirTout.bind(this);        
        this.filtreFiliere = document.getElementById("year") as HTMLInputElement;
        this.filtreFiliere.oninput = this.choisirFilieres.bind(this);        
        this.filtreMatiere = document.getElementById("course") as HTMLInputElement;
        this.filtreMatiere.onclick = this.choisirMatieres.bind(this);        
        this.filtreNom = document.getElementById("name") as HTMLInputElement;
        this.filtreNom.onchange = this.choisirNom.bind(this);        
        this.filtreTexteNom = document.getElementById("filtrer") as HTMLInputElement;
        this.filtreTexteNom.oninput = this.filtrer.bind(this);
        this.listeFilieres = document.getElementById("years") as HTMLSelectElement;
        this.listeFilieres.oninput = this.filtrer.bind(this);
        this.listeMatieres = document.getElementById("courses") as HTMLSelectElement;
        this.listeMatieres.oninput = this.filtrer.bind(this);
        this.cbRecent = document.getElementById("cb_recent") as HTMLInputElement;
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
    public async affiche() {
        if (this.currentLog != null) {            
            // c'est un retour... il faut recharger le logiciel et l'affiche de nouveau
            this.currentLog = await this.logicielsDAO.getLogiciel(this.currentLog.id);
            this.afficheLogiciel(this.currentLog);
            // il faudrait modifier la liste aussi...
            let item = document.querySelector(".listitem.selected") as HTMLDivElement;
            item.innerHTML = this.currentLog.nomVersion;
        }
    }

    private griseTout() {
        this.listeFilieres.disabled = true;
        this.listeMatieres.disabled = true;
        this.filtreTexteNom.disabled = true;
    }
    private async choisirTout() {
        this.griseTout();
        await this.filtrer();
    }
    private async choisirFilieres() {
        this.griseTout();
        this.listeFilieres.disabled = false;
        await this.filtrer();
    }
    private async choisirMatieres() {
        this.griseTout();
        this.listeMatieres.disabled = false;
        await this.filtrer();
    }
    private async choisirNom() {
        this.griseTout();
        this.filtreTexteNom.disabled = false;
        await this.filtrer();
    }

    private async supprimeLogiciel()
    { 
        if (this.currentLog != null)
        {
            let ok = confirm("Supprimer le logiciel " + this.currentLog.nomVersion+" ? ");
            if (ok) {
                await this.logicielsDAO.delLogiciel(this.currentLog);
                this.effaceLogiciel();
                this.currentLog = null; 
                
            }
        }        
    }
    private ajouteLogiciel()
    {
        window.location.href = "editor.html?id=0";
    }

    private modifieLogiciel() {
        if (this.currentLog != null)
        {
            // aller vers editor.html en lui transmettant currentLog
            window.location.href = "editor.html?id=" + this.currentLog.id.toString();            
        }
    }

    private async listerFilieres() {
        let filieres = await this.vueModele.listeFilieres();
        filieres.forEach((filiere: Filiere) => {
            let opt = document.createElement("option");
            opt.value = filiere.id.toString();
            opt.innerHTML = filiere.nom;
            $("#years").append(opt);
        }); 
        
    }

    private async listerMatieres()
    {
        let matieres = await this.vueModele.listeMatieres();
        matieres.forEach((matiere: Matiere) => {
            let opt = document.createElement("option");                
            opt.value = matiere.id.toString();
            opt.innerHTML = matiere.nom;
            $("#courses").append(opt);
        });
    }

    private videLogiciels() {
        this.effaceLogiciel();
        $("main .list").html(""); 
    }

    private listerLogiciels(logs: Array<Logiciel>)
    {
        this.videLogiciels();// vide la liste avant
        logs.forEach((log: Logiciel) => {
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

    private async listerTousLogiciels(portableOnly: boolean = false, cacherObsolete:boolean=false)
    {
        let logs = await this.vueModele.listeTousLogiciels(portableOnly, cacherObsolete);
        this.listerLogiciels(logs);        
    }

    private effaceLogiciel()
    {
        let div = document.getElementById("software");
        div.innerHTML = "";
        $("#actions").addClass("hide");
        this.currentLog = null;
    }

    private afficheLogiciel(log: Logiciel)
    {        
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

        let divlogin = document.createElement("div") as HTMLDivElement;
        divlogin.classList.add("admin");
        divlogin.classList.add("info");
        divlogin.classList.add("auteur");
        let login = this.currentLog.utilisateur.nom;
        divlogin.innerHTML = "Logiciel proposé par "+login;
        div.appendChild(divlogin);

        let divnouveau = document.createElement("div") as HTMLDivElement;
        divnouveau.classList.add("info");
        if (log.estRecent)
            divnouveau.innerHTML = "nouveau logiciel pour cette année";
        div.appendChild(divnouveau);

        let divimg = document.createElement("div");
        divimg.id = "DivImg";
        div.appendChild(divimg);
        if (log.urlImage != undefined && log.urlImage != null && log.urlImage != "")
        {
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
            button.onclick = async () => { await navigator.clipboard.writeText(log.numero_serie); };
            divserie.appendChild(button);
            div.appendChild(divserie);
        }

        if (log.urlTuto != "" && log.urlTuto != null)
        {
            div2 = document.createElement("div");
            div2.id = "linkTuto";
            let a = document.createElement("a");
            a.href = log.urlTuto;
            a.target = "_blank";
            a.innerHTML = "Lien vers le tutoriel d'installation";
            div2.appendChild(a);
            div.appendChild(div2);
        }

        if (log.urlSetup != "" && log.urlSetup != null)
        {
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

    private async filtrer()
    {
        this.effaceLogiciel();

        if ($("#all").prop("checked"))
        {
            await this.listerTousLogiciels(this.portOnly.checked, this.cacherObsolete.checked);
        }
        else if ($("#year").prop("checked"))
        { 
            let id = $("#years option:selected").val();
            let logs = await this.vueModele.listeLogicielsFiliere(id, this.portOnly.checked, this.cacherObsolete.checked);
            this.listerLogiciels(logs); 
        }
        else if ($("#course").prop("checked"))
        {
            let id = $("#courses option:selected").val();
            let logs = await this.vueModele.listeLogicielsMatiere(id, this.portOnly.checked, this.cacherObsolete.checked);
            this.listerLogiciels(logs);

        }
        else if ($("#name").prop("checked"))
        {
            let name = $("#filtrer").val();
            let logs = await this.vueModele.listeLogicielsNom(name, this.portOnly.checked, this.cacherObsolete.checked);
            this.listerLogiciels(logs);
        }
    }
}
var vue: VueLogiciels;

window.onload = () => {
    vue = new VueLogiciels();
    initHeader();
};

window.onpageshow = () => {
    vue.affiche();
}           