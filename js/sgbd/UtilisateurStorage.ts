/**
 * Permet de gérer la persistance des données de l'utilisateur
 */
class UtilisateurStorage {
    /**
     * Sauve l'utilisateur     
     * @param user l'utilisateur
     */
    public sauve(user: Utilisateur) {
        let str = JSON.stringify(user);
        window.sessionStorage.setItem("connectedUser", str);
    }

    /** 
     * Charge l'utilisateur
     * @returns l'utilisateur
     */
    public charge(): Utilisateur {
        let str = window.sessionStorage.getItem("connectedUser");
        let user = new Utilisateur();
        if (str) {
            let obj = JSON.parse(str);
            user.nom = obj._nom;
            user.statut = obj._statut;
            user.login = obj._login;
            user.departement = obj._departement;
        }
        return user;
    }   
}