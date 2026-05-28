/**
 * SRP : responsabilité unique — gérer l'upload d'un fichier vers le serveur.
 * VueFiche n'a plus à connaître les détails du XMLHttpRequest et de la progress bar.
 */
class FileUploader {

    async upload(id: string): Promise<void> {
        const selectorFile  = `#${id} input[type='file']`;
        const selectorRange = `#${id} input[type='range']`;
        const input = document.querySelector(selectorFile) as HTMLInputElement;
        if (!input || !input.files || input.files.length === 0) return;

        const formData = new FormData();
        formData.append("file", input.files![0]);

        $(selectorRange).removeClass("hide");

        await $.ajax({
            xhr: () => {
                const xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", (evt) => {
                    if (evt.lengthComputable) {
                        $(selectorRange).val((evt.loaded / evt.total) * 100);
                    }
                }, false);
                return xhr;
            },
            method: "post",
            url: "php/upload.php",
            data: formData,
            contentType: false,
            processData: false,
            error: (obj, status, error) => { console.log(error); }
        });

        $(selectorRange).addClass("hide");
    }
}
