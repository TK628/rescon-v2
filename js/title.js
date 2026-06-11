sessionStorage.removeItem("resconBootPassed");
sessionStorage.removeItem("resconStartRequested");

const btnStartSystem=document.getElementById("btn-start-system");
const titlePanel=document.getElementById("title-panel");
const titleStartOverlay=document.getElementById("title-start-overlay");

let starting=false;

if(btnStartSystem){
    btnStartSystem.onclick=()=>{
        if(starting){
            return;
        }

        starting=true;

        sessionStorage.setItem(
            "resconStartRequested",
            "true"
        );

        btnStartSystem.disabled=true;
        btnStartSystem.innerText="STARTING...";

        document.body.classList.add("title-starting");
        titlePanel?.classList.add("title-panel-starting");
        titleStartOverlay?.classList.remove("hidden");

        setTimeout(()=>{
            location.href="./boot.html";
        },1450);
    };
}
