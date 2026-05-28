"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/// <reference path="../lib/jquery.d.ts" />
/**
 * Vue liée à index.html
 * */
class IndexView {
    constructor() {
        this.currentImage = 0;
        setTimeout(() => {
            $("#nagScreen").removeClass("nag-overlay");
            $("#nagScreen").html("");
        }, 3000);
        $("button[type='submit']").on("click", () => __awaiter(this, void 0, void 0, function* () {
            yield this.logIn();
        }));
        setInterval(() => this.changeImage(), 2000);
    }
    changeImage() {
        this.currentImage = (this.currentImage + 1) % 4;
        $(".slides img").removeClass("active");
        $(".slides img").eq(this.currentImage).addClass("active");
        /*let element = $(".slides img")[this.currentImage];
        element.classList.add("active"); */
    }
    logIn() {
        return __awaiter(this, void 0, void 0, function* () {
            let user = $("input#user").val();
            let pass = $("input#pass").val();
            let log = new Login();
            if (yield log.loginUser(user, pass))
                window.location.href = "accueil.html";
            else
                alert("Mauvais login ou mot de passe");
        });
    }
}
window.onload = () => {
    let view = new IndexView();
};
