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
        $("#disconnect").on("click",async ()=>{await this.logOut();});
    }

    private async logOut(){
        let log = new Login();
        await log.logout();
        window.location.href="index.html";
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

