class Filiere
{
    private _id!: number;

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    private _nom!: string;

    get nom() {
        return this._nom;
    }

    set nom(nom: string)
    {
        this._nom = nom;
    }
}