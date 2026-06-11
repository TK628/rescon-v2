const BOOT_SESSION_KEY="resconBootShownV861";

function createBootOverlay(){
    const overlay=document.createElement("div");
    overlay.id="rescon-boot-overlay";
    overlay.innerHTML=`
        <div class="rescon-boot-panel">
            <div class="rescon-boot-logo-stage">
                <div class="rescon-boot-orbit orbit-a"></div>
                <div class="rescon-boot-orbit orbit-b"></div>
                <div class="rescon-boot-logo rescon-emblem-ring">
                    <img src="../assets/rescon-logo.svg" alt="RESCON">
                </div>
            </div>

            <div class="rescon-boot-title">RESCON NETWORK</div>
            <div class="rescon-boot-subtitle">RESCUE COMPETITION CONTROL SYSTEM</div>

            <div class="rescon-boot-scan">
                <div class="rescon-boot-scan-line"></div>
            </div>

            <div id="rescon-boot-lines"></div>

            <div class="rescon-boot-progress">
                <div id="rescon-boot-progress-fill"></div>
            </div>

            <div class="rescon-boot-footer">
                <span>RESCON v8.6.1</span>
                <span id="rescon-boot-percent">0%</span>
                <span>NETWORK ONLINE</span>
            </div>
        </div>
    `;

    document.body.prepend(overlay);

    return overlay;
}

function wait(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}

async function runBootSequence(){
    if(sessionStorage.getItem(BOOT_SESSION_KEY)==="true"){
        return;
    }

    const overlay=createBootOverlay();
    const linesContainer=overlay.querySelector("#rescon-boot-lines");
    const progressFill=overlay.querySelector("#rescon-boot-progress-fill");
    const percentLabel=overlay.querySelector("#rescon-boot-percent");

    await wait(900);

    const lines=[
        {text:"INITIALIZING CORE...",percent:12},
        {text:"LOADING INTERFACE...",percent:28},
        {text:"SYNCING DATABASE...",percent:45},
        {text:"CHECKING NETWORK...",percent:62},
        {text:"LINKING COMMAND CENTER...",percent:78},
        {text:"VERIFYING RESCUE MODULES...",percent:90},
        {text:"READY",percent:100}
    ];

    for(const item of lines){
        const line=document.createElement("div");
        line.className="rescon-boot-line";
        line.innerText=item.text;
        linesContainer.appendChild(line);

        progressFill.style.width=`${item.percent}%`;
        percentLabel.innerText=`${item.percent}%`;

        await wait(520);
    }

    await wait(850);

    overlay.classList.add("boot-fade-out");

    await wait(650);

    overlay.classList.add("boot-hidden");
    sessionStorage.setItem(BOOT_SESSION_KEY,"true");
}

if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",runBootSequence);
}else{
    runBootSequence();
}
