
/**
 * Classe gérant le login de l'utilisateur
 */
class Login{
    /**
     * hash a text with SHA-256
     * @param {string} text to hash
     * @returns hash value
     */
    private async hash(text): Promise<string>{
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));

      // b.toString(16) donne "a" au lieu de "0a" → on préfixe avec "0" puis on garde les 2 derniers caractères
        const hashHex = hashArray
            .map(b => ("0" + b.toString(16)).slice(-2))
            .join("");

      return hashHex;
    }

    /**
     * Connecte un utilisateur au serveur
     * @param login le login (identifiant) de l'utilisateur
     * @param pass le mot de passe de l'utilisateur
     * @returns true si le serveur a accepté la connexion     
     */
    public async loginUser(login:string, pass:string):Promise<boolean> {
        let ok = await $.ajax({
            method:"post",
            url:"php/login.php",
            dataType:"json",
            data: {"login":login, "password":pass},
            error:(obj, status, error) => { console.log(error); } // todo better
        }) ;
        return ok.result=="ok";
    }

    /**
     * Déconnecte l'utilisateur du serveur
     */
    public async logout(){
        $.ajax({
            method:"post",
            url:"php/logout.php"
        });
    }
}