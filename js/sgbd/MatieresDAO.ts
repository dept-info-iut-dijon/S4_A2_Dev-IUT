/**
 * Lien avec le back, pour les matières
 * */
class MatiereDAO
{
    /**
     * Modifie dans la BD les matières liées au logiciel
     * @param currentLog le logiciel
     * @param matieres les ID des matières
     */
    public async lierMatieres(currentLog: Logiciel, matieres: Array<number>) {
        // supprime les anciennes
        let data = await $.ajax({
            method: "get",
            url: "php/matieres.php",
            dataType: "json",
            data: { "action": "delete", "idlog": currentLog.id },
            error: (obj, status, error) => { console.log(error); } // todo better
        });
        // rajoute les nouvelles
        matieres.forEach(async (id) => {
            await $.ajax({
                method: "get",
                url: "php/matieres.php",
                dataType: "json",
                data: { "action": "insert", "idlog": currentLog.id, "idm": id },
                error: (obj, status, error) => { console.log(error); } // todo better
            });
        });
    }
    /* utile ?
    public get(id: number): Matiere
    {
        // todo utiliser la BD
        let mat = new Matiere();
        mat.id = 1;
        mat.nom = "UE1-Développement";        
        return mat;
    }*/

    /**
     * Liste toutes les matières
     * @returns les matières
     * */
    public async liste(): Promise<Array<Matiere>>
    {        
        let data = await $.ajax({
            method: "get",
            dataType: "json",
            url: "php/matieres.php",
            error: (obj, status, error) => { console.log(error); } // todo better

        });

        return this.getData(data);
    }

    /**
     * Liste les matières utilisant ce logiciel
     * @param log le logiciel
     * @returns la liste des matières
     */
    public async listLog(log: Logiciel): Promise<Array<Matiere>>
    {
        let data = await $.ajax({
            method: "get",
            dataType: "json",
            data: { "idlog": log.id },
            url: "php/matieres.php",
            error: (obj, status, error) => { console.log(error); } // todo better

        });
        return this.getData(data);
    }

    private getData(data: any[]): Array<Matiere>
    {
        let list = new Array<Matiere>();
        data.forEach((obj: any) => {
            let mat = new Matiere();
            mat.id = obj.id;
            mat.nom = obj.nom;
            mat.code = obj.code;
            list.push(mat);
        });

        return list;
    }
}