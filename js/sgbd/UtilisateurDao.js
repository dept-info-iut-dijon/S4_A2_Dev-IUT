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
 * Gère la persistance sur le serveur d'un utilisateur
 */
class UtilisateurDao {
    constructor() {
        this.cache = new Map;
    }
    /**
     * Charge depuis la base un utilisateur
     * utilise un cache pour �viter les acc�s multiples
     * @param login le login (id) de l'utilisateur
     * @returns l'utilisateur complet
     */
    LireUtilisateur(login) {
        return __awaiter(this, void 0, void 0, function* () {
            let user;
            if (this.cache.has(login)) {
                user = this.cache.get(login);
            }
            else {
                user = new Utilisateur();
                let data = yield $.ajax({
                    url: "php/user.dao.php",
                    method: "post",
                    dataType: "json",
                    data: {
                        "action": "read",
                        "login": login
                    },
                    error: (err) => { console.log(err); } // todo do better... 
                });
                user.login = data.login;
                user.nom = data.nom;
                user.statut = data.statut;
                user.departement = data.departement;
                this.cache.set(login, user);
            }
            return user;
        });
    }
    /**
     * Charge l'utilisateur actuellement connect�
     * @returns l'utilisateur
     */
    LireUtilisateurConnecté() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield $.ajax({
                url: "php/user.php",
                dataType: "json",
                error: (err) => { console.log(err); }
            });
            let user = new Utilisateur();
            user.login = data.login;
            user.nom = data.nom;
            user.statut = data.statut;
            user.departement = data.departement;
            return user;
        });
    }
    /**
     * Ajoute, dans le serveur, l'utilisateur indiqué
     * @param currentUser l'utilisateur a ajouter
     */
    ajouteUtilisateur(currentUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield $.ajax({
                url: "php/user.dao.php",
                dataType: "json",
                method: "post",
                data: {
                    "action": "add",
                    "login": currentUser.login,
                    "nom": currentUser.nom,
                    "departement": currentUser.departement,
                    "statut": currentUser.statut
                },
                error: (xhr, ajaxOptions, thrownError) => { console.log(thrownError); }
            });
            console.log(ret); // bpf
        });
    }
}
