/**
 * Lien avec le coté serveur pour les filières
 * */
class FiliereDAO
{
    /**
     * Modifie dans la BDD les liens entre un logiciel et les filières l'utilisant
     * @param currentLog le logiciel
     * @param filieres la liste des ID des filières liées
     */
    public async lierFilieres(currentLog: Logiciel, filieres: Array<number>) {
        // supprimer les filières anciennes
        let data = await $.ajax({
            method: "get",
            url: "php/filieres.php",
            dataType: "json",
            data: { "action": "delete", "idlog": currentLog.id },
            error: (obj, status, error) => { console.log(error); } // todo better
        });
        console.log(data);
        // lier les nouvelles
        filieres.forEach(async (id) => {
            let test = await $.ajax({
                method: "get",
                url: "php/filieres.php",
                dataType: "json",
                data: { "action": "insert", "idlog": currentLog.id, "idf": id },
                error: (obj, status, error) => { console.log(error); } // todo better
            });
            console.log(test);
        });
    }


   /* utile ? get(id: number): Filiere
    {
        // todo read from database
        let filiere = new Filiere();
        filiere.id = id;
        filiere.nom = "BUT 1A";
        return filiere;
    } */

    /**
     * Liste toutes les filières
     * @returns les filières
     * */
    public async liste(): Promise< Array<Filiere> >
    {
        let data = await $.ajax({
            method: "get",
            dataType: "json",
            url: "php/filieres.php",
            error: (obj, status, error) => { console.log(error); } // todo better
            
        });        

        return this.getData(data);
    }

    private getData(data: any[]): Array<Filiere>
    {
        let list = new Array<Filiere>();
        data.forEach((obj: any) => {
            let filiere = new Filiere();
            filiere.id = obj.id;
            filiere.nom = obj.nom;
            list.push(filiere);
        });
        return list;
    }


    /**
     * Liste les filières utilisant un logiciel
     * @param log le logiciel utilisé
     * @returns la liste des filières
     */
    public async listeLog(log: Logiciel): Promise<Array<Filiere>>
    {
        let data = await $.ajax({
            method: "get",
            dataType: "json",
            data: { "id": log.id },
            url: "php/filieres.php",
            error: (obj, status, error) => { console.log(error); } // todo better

        });

        return this.getData(data);
    }
}