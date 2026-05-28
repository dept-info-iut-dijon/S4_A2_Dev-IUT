/**
 * Représente un logiciel
 * */
class Logiciel
{
    private _id!: number;
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    private _nom!: string;
    public get nom(): string {
        return this._nom;
    }
    public set nom(value: string) {
        this._nom = value;
    }
    private _version!: string;
    public get version(): string {
        return this._version;
    }
    public set version(value: string) {
        this._version = value;
    }
    private _comment!: string;
    public get comment(): string {
        return this._comment;
    }
    public set comment(value: string) {
        this._comment = value;
    }
    private _urlSetup!: string;
    public get urlSetup(): string {
        return this._urlSetup;
    }
    public set urlSetup(value: string) {
        this._urlSetup = value;
    }
    private _urlTuto!: string;
    public get urlTuto(): string {
        return this._urlTuto;
    }
    public set urlTuto(value: string) {
        this._urlTuto = value;
    }
    private _visible!: boolean;
    public get visible(): boolean {
        return this._visible;
    }
    public set visible(value: boolean) {
        this._visible = value;
    }

    public get nomVersion(): string {
        let add = "";
        if (this.obsolete)
            add = " (obsolete)";
        return this.nom + " " + this.version + add;
    }

    private _type!: string;
    public get type(): string {
        return this._type;
    }
    public set type(value: string) {
        this._type = value;
    }

    private _date_ajout!: Date;
    public get date_ajout(): Date {
        return this._date_ajout;
    }
    public set date_ajout(value: Date) {
        this._date_ajout = value;
    }

    public get estNouveau(): boolean {
        return this.id == 0;
    }

    private _numero_serie!: string;
    public get numero_serie(): string {
        return this._numero_serie;
    }
    public set numero_serie(value: string) {
        this._numero_serie = value;
    }


    public constructor() {
        this.id = 0;
        this.urlSetup = "";
        this.urlTuto = "";
        this.urlPort = "";
        this.urlImage = "";
        this.obsolete = false;
        this.date_ajout = new Date();
    }

    private _urlPort!: string;
    public get urlPort(): string {
        return this._urlPort;
    }
    public set urlPort(value: string) {
        this._urlPort = value;
    }

    private _urlImage!: string;
    public get urlImage(): string {
        return this._urlImage;
    }
    public set urlImage(value: string) {
        this._urlImage = value;
    }

    private _obsolete!: boolean;
    public get obsolete(): boolean {
        return this._obsolete;
    }
    public set obsolete(value: boolean) {
        this._obsolete = value;
    }

    private _utilisateur!: Utilisateur;
    public get utilisateur(): Utilisateur {
        return this._utilisateur;
    }
    public set utilisateur(value: Utilisateur) {
        this._utilisateur = value;
    }

    /**
     * Indique si le logiciel est récent
     * Récent : demandé l'année universitaire précédente  
     * Par exemple, en 2023-2024, les logiciels "récents" sont ceux demandés après le 1/9/2022   
     */ 
    public get estRecent(): boolean {        
        let now = new Date();       
        let year = now.getFullYear();
        let month = now.getMonth()-1; // car janvier=0
        if (month >= 9 && month <= 12) // debut de l'année
            year -= 2;
        else // année suivante
            year -= 1;
        let old = new Date(year, 9, 1);
        return old < this.date_ajout;
    }

}