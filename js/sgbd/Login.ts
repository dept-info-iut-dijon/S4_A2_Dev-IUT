
/**
 * Classe gérant le login de l'utilisateur
 */
class Login {

    public async loginUser(login: string, pass: string): Promise<boolean> {
        let ok = await $.ajax({
            method: "post",
            url: "php/login.php",
            dataType: "json",
            data: { "login": login, "password": pass },
            error: (obj, status, error) => { console.log(error); }
        });
        return ok.result == "ok";
    }

    public async logout() {
        $.ajax({
            method: "post",
            url: "php/logout.php"
        });
    }
}