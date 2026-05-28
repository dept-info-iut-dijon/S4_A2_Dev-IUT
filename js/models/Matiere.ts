/**
 * Représente une matière
 * */
class Matiere
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
    private _code!: string;
    public get code(): string {
        return this._code;
    }
    public set code(value: string) {
        this._code = value;
    }

}