/**
 * SRP : responsabilité unique — afficher et gérer la navigation entre pages.
 * Cette classe ne connaît pas les logiciels, elle gère seulement la pagination.
 */
class VuePagination {
    private conteneur: HTMLElement;
    private onChangePage: (page: number) => void;

    constructor(onChangePage: (page: number) => void) {
        this.onChangePage = onChangePage;
        const existing = document.getElementById("pagination");
        if (existing) {
            this.conteneur = existing;
        } else {
            this.conteneur = document.createElement("div");
            this.conteneur.id = "pagination";
            this.conteneur.style.textAlign = "center";
            this.conteneur.style.marginTop = "10px";
            const list = document.querySelector("main .list");
            if (list) list.after(this.conteneur);
        }
    }

    afficher(total: number, page: number, limite: number) {
        const nbPages = Math.ceil(total / limite);
        this.conteneur.innerHTML = "";

        if (page > 1) {
            const btnPrev = document.createElement("button");
            btnPrev.innerHTML = "◀";
            btnPrev.onclick = () => this.onChangePage(page - 1);
            this.conteneur.appendChild(btnPrev);
        }

        const info = document.createElement("span");
        info.innerHTML = ` Page ${page} / ${nbPages} (${total} logiciels) `;
        info.style.margin = "0 8px";
        this.conteneur.appendChild(info);

        if (page < nbPages) {
            const btnNext = document.createElement("button");
            btnNext.innerHTML = "▶";
            btnNext.onclick = () => this.onChangePage(page + 1);
            this.conteneur.appendChild(btnNext);
        }
    }

    effacer() {
        if (this.conteneur) this.conteneur.innerHTML = "";
    }
}
