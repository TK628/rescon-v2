if(
    sessionStorage.getItem("resconStartRequested")
    !=="true"
){
    location.replace("./index.html");
}

const bootLineList=document.getElementById("boot-line-list");
const bootProgressFill=document.getElementById("boot-progress-fill");
const bootFooter=document.getElementById("boot-footer");

const bootLines=[
    "PUBLIC ACCESS GATEWAY ONLINE",
    "LOADING RESCON INTERFACE...",
    "NOTICE CENTER READY",
    "MANUAL CENTER READY",
    "VERSION CENTER READY",
    "ROOM SELECT STANDBY",
    "COMMUNITY NETWORK ONLINE",
    "RESCON SYSTEM READY"
];

let index=0;

function addBootLine(){
    if(!bootLineList){
        return;
    }

    const line=document.createElement("div");
    line.className="boot-line";
    line.innerText=`[ONLINE] ${bootLines[index]}`;
    bootLineList.appendChild(line);

    index++;

    const percent=Math.round(
        (
            index/
            bootLines.length
        )*100
    );

    if(bootProgressFill){
        bootProgressFill.style.width=`${percent}%`;
    }

    if(bootFooter){
        bootFooter.innerText=`LOADING ${percent}%`;
    }

    if(index>=bootLines.length){
        setTimeout(
            finishBoot,
            720
        );
        return;
    }

    setTimeout(
        addBootLine,
        360
    );
}

function finishBoot(){
    document.body.classList.add("boot-complete");

    if(bootFooter){
        bootFooter.innerText="ACCESS GRANTED";
    }

    sessionStorage.setItem(
        "resconBootPassed",
        "true"
    );

    sessionStorage.removeItem(
        "resconStartRequested"
    );

    setTimeout(()=>{
        location.replace("./home.html");
    },760);
}

setTimeout(
    addBootLine,
    420
);
