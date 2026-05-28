/**
 * Gère la persistance sur le serveur d'un utilisateur
 */
class UtilisateurDao {
    
    private cache: Map<string, Utilisateur>;

    public constructor() { 
        this.cache = new Map<string, Utilisateur>; 
    }

    /**
     * Charge depuis la base un utilisateur
     * utilise un cache pour �viter les acc�s multiples
     * @param login le login (id) de l'utilisateur
     * @returns l'utilisateur complet
     */
    public async LireUtilisateur(login: string): Promise<Utilisateur> {
        let user: Utilisateur;
        if (this.cache.has(login)) {
            user = this.cache.get(login)!;
        }
        else {
            user = new Utilisateur();
            let data = await $.ajax({
                url: "php/user.dao.php",
                method: "post",
                dataType: "json",
                data: {
                    "action":"read",
                    "login": login
                },
                error: (err) => { console.log(err); } // todo do better... 
            });

            user.login = data.login;
            user.nom = data.nom;
            user.statut = data.statut;
            user.departement = data.departement;
            user.role = data.role ?? 2;
            this.cache.set(login, user);
        }
        return user;
    }

    /**
     * Charge l'utilisateur actuellement connect�
     * @returns l'utilisateur
     */
    public async LireUtilisateurConnecté(): Promise<Utilisateur> {
        let data = await $.ajax({
            url: "php/user.php",
            dataType: "json",
            error: (err) => { console.log(err); }            
        });
        let user = new Utilisateur();
        user.login = data.login;
        user.nom = data.nom;
        user.statut = data.statut;
        user.departement = data.departement;
        user.role = data.role ?? 2;
        return user;
    }
     
    /**
     * Ajoute, dans le serveur, l'utilisateur indiqué     
     * @param currentUser l'utilisateur a ajouter
     */
    public async supprimerCompte(login: string, password: string): Promise<boolean> {
        let ret = await $.ajax({
            url: "php/user.dao.php",
            method: "post",
            dataType: "json",
            data: { "action": "delete", "login": login, "password": password },
            error: (xhr) => { console.log(xhr); }
        });
        return ret.response === "ok";
    }

    public async ajouteUtilisateur(currentUser: Utilisateur) {
        let ret = await $.ajax({
            url: "php/user.dao.php",
            dataType: "json",
            method: "post",
            data:
            {
                "action": "add",
                "login": currentUser.login,
                "nom": currentUser.nom,
                "departement": currentUser.departement,
                "statut": currentUser.statut                
            },
            error: (xhr, ajaxOptions, thrownError) => { console.log(thrownError); }
        });
        console.log(ret); // bpf
    }
} 