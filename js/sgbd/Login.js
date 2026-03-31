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
 * Classe gérant le login de l'utilisateur
 */
class Login {
    /**
     * hash a text with SHA-256
     * @param {string} text to hash
     * @returns hash value
     */
    hash(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = yield crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            // b.toString(16) donne "a" au lieu de "0a" → on préfixe avec "0" puis on garde les 2 derniers caractères
            const hashHex = hashArray
                .map(b => ("0" + b.toString(16)).slice(-2))
                .join("");
            return hashHex;
        });
    }
    /**
     * Connecte un utilisateur au serveur
     * @param login le login (identifiant) de l'utilisateur
     * @param pass le mot de passe de l'utilisateur
     * @returns true si le serveur a accepté la connexion
     */
    loginUser(login, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            let hashPass = yield this.hash(pass);
            let ok = yield $.ajax({
                method: "post",
                url: "php/login.php",
                dataType: "json",
                data: { "login": login, "password": hashPass },
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            return ok.result == "ok";
        });
    }
    /**
     * Déconnecte l'utilisateur du serveur
     */
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            $.ajax({
                method: "post",
                url: "php/logout.php"
            });
        });
    }
}
