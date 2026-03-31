/// <reference path="../lib/jquery.d.ts" />
/**
 * Vue liée à index.html
 * */
class IndexView
{
    private currentImage:number=0;
    constructor()
    {
        setTimeout(()=>{
            $("#nagScreen").removeClass("nag-overlay");
            $("#nagScreen").html("");
        }, 3000);

        $("button[type='submit']").on("click",async () => {
            await this.logIn();
        });

        setInterval(()=>this.changeImage(),2000);
    }

    private changeImage(){
        this.currentImage = (this.currentImage+1)%4;
        $(".slides img").removeClass("active");
        $(".slides img").eq(this.currentImage).addClass("active");
        /*let element = $(".slides img")[this.currentImage];
        element.classList.add("active"); */
    }

    private async logIn(){
        let user = $("input#user").val();
        let pass = $("input#pass").val();
        let log = new Login();
        if(await log.loginUser(user,pass))
            window.location.href = "accueil.html"; 
        else
            alert("Mauvais login ou mot de passe");
    }
}

window.onload = () => {    
    let view = new IndexView();
}
