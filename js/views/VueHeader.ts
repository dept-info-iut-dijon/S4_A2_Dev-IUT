class VueHeader
{
    public constructor(user: Utilisateur)
    {
        $("#user").html(user.nom);
        $("#role").html(user.statut);

        if (!user.nom || user.nom == "")
        {
            $("header *").addClass("hide");
        }
        else
        {
            $("header *").removeClass("hide");
        }

        
        if (user.estProf)
        {
            $(".teacher").removeClass("hide");
        }
        else
        {
            $(".teacher").addClass("hide");
        }

        if (user.estAdmin)
        {
            $(".admin").removeClass("hide");
        }
        else
        {
            $(".admin").addClass("hide");
        }
        $("#disconnect").on("click", async () => { await this.logOut(); });

        $("#delete-account").on("click", () => { this.ouvrirModale(); });

        $("#annuler-suppression").on("click", () => { this.fermerModale(); });

        $("#confirmer-suppression").on("click", async () => { await this.supprimerCompte(user); });
    }

    private async logOut() {
        let log = new Login();
        await log.logout();
        window.location.href = "index.html";
    }

    private ouvrirModale() {
        ($("#confirm-password") as any).val("");
        $("#erreur-suppression").hide();
        (document.getElementById("modale-suppression") as HTMLDialogElement).showModal();
    }

    private fermerModale() {
        (document.getElementById("modale-suppression") as HTMLDialogElement).close();
    }

    private async supprimerCompte(user: Utilisateur) {
        let password = ($("#confirm-password") as any).val();
        let dao = new UtilisateurDao();
        let supprime = await dao.supprimerCompte(user.login, password);
        if (supprime) {
            window.location.href = "index.html";
        } else {
            $("#erreur-suppression").show();
        }
    }
}  

async function initHeader() 
{  
    let dao = new UtilisateurDao();
    let user = await dao.LireUtilisateurConnecté();
    let storage = new UtilisateurStorage();
    storage.sauve(user);
    let vue = new VueHeader(user);
}

