/**
 * Représente l'utilisateur connecté
 * */
class Utilisateur
{
    private _login: string;
    public get login(): string {
        return this._login;
    } 
    public set login(value: string) {
        this._login = value;
    }
    private _nom!: string;
    public get nom(): string {
        return this._nom;
    }
    public set nom(value: string) {
        this._nom = value;
    }
    private _statut: string;
    public get statut(): string {
        return this._statut;
    }
    public set statut(value: string) {
        this._statut = value;
    }
    private _departement!: string;
    public get departement(): string {
        return this._departement;
    }
    public set departement(value: string) {
        this._departement = value;
    }

    private _role: number;
    public get role(): number {
        return this._role;
    }
    public set role(value: number) {
        this._role = value;
    }

    public get estAdmin(): boolean {
        return this._role === 1;
    }

    public get estProf(): boolean {
        return this._statut.toLowerCase().substr(0, 3) == "ens";
    }

    public constructor(login: string = "") {
        this._login = login;
        this._statut = "enseignant";
        this._role = 2;
    }
}