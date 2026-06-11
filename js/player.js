import { app } from "./firebase.js";
import { MAX_LIFE } from "./constants.js";

import {
    getDatabase,
    ref,
    get,
    set,
    update,
    onValue,
    push,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);
const params=new URLSearchParams(location.search);

const roomId=params.get("room");
const role=params.get("role");
const playerName=params.get("name");

const refereeList=document.getElementById("referee-list");
const matchTimer=document.getElementById("match-timer");
const finishMotion=document.getElementById("finish-motion");
const btnHome=document.getElementById("btn-home");
const waitingScreen=document.getElementById("waiting-screen");
const matchArea=document.getElementById("match-area");

const dummyCard1=document.getElementById("dummy-card-1");
const dummyCard2=document.getElementById("dummy-card-2");
const dummyCard3=document.getElementById("dummy-card-3");

const dummy1Hp=document.getElementById("dummy1-hp");
const dummy1Bar=document.getElementById("dummy1-bar");
const dummy2Hp=document.getElementById("dummy2-hp");
const dummy2Bar=document.getElementById("dummy2-bar");
const dummy3Hp=document.getElementById("dummy3-hp");
const dummy3Bar=document.getElementById("dummy3-bar");

const reportButtons=
    document.querySelectorAll(
        ".btn-report-dummy"
    );

const reportStoveRoomA=
    document.getElementById(
        "report-stove-room-a"
    );

const reportStoveRoomB=
    document.getElementById(
        "report-stove-room-b"
    );

const reportStoveRoomC=
    document.getElementById(
        "report-stove-room-c"
    );

const btnReportStove=
    document.getElementById(
        "btn-report-stove"
    );

let timerInterval=null;

btnHome.onclick=()=>{
    location.href="./home.html";
};

const roomRef=ref(db,`rooms/${roomId}`);
const roomSnapshot=await get(roomRef);


function getDummyColorClass(dummy){
    const color=dummy?.clothesColor??"red";
    return `dummy-color-${color}`;
}
function createDummyIconHtml(dummy,dummyId){
    const label=dummyId.replace("dummy","");
    return `<div class="dummy-mini-icon ${getDummyColorClass(dummy)}"><div class="dummy-mini-head"></div><div class="dummy-mini-body"></div><div class="dummy-mini-label">${label}</div></div>`;
}
function renderDummyIcon(card,dummy,dummyId){
    if(!card||!dummy){return;}
    let holder=card.querySelector(".dummy-icon-holder");
    if(!holder){
        holder=document.createElement("div");
        holder.className="dummy-icon-holder";
        const nameElement=card.querySelector(".dummy-name");
        if(nameElement){nameElement.after(holder);}else{card.prepend(holder);}
    }
    holder.innerHTML=createDummyIconHtml(dummy,dummyId);
}


let dummyEventInitialized=false;
let previousFoundState={};
let previousRescuedState={};
function showDummyEventOverlay(type,dummyId,dummy){
    const isRescue=type==="rescue";
    const overlay=document.createElement("div");
    overlay.className=isRescue?"dummy-event-overlay rescue-complete-event":"dummy-event-overlay dummy-detected-event";
    overlay.innerHTML=`<div class="dummy-event-panel"><div class="dummy-event-title">${isRescue?"RESCUE COMPLETE":"DUMMY DETECTED"}</div>${createDummyIconHtml(dummy,dummyId)}<div class="dummy-event-name">${dummyId.toUpperCase().replace("DUMMY","DUMMY ")}</div><div class="dummy-event-text">${isRescue?"救助に成功しました":"人形を発見しました"}</div></div>`;
    document.body.appendChild(overlay);
    setTimeout(()=>{overlay.classList.add("hide");},1300);
    setTimeout(()=>{overlay.remove();},1800);
}
function checkDummyEvents(roomData){
    const dummies=roomData.dummies||{};
    ["dummy1","dummy2","dummy3"].forEach(dummyId=>{
        const dummy=dummies[dummyId];
        if(!dummy){return;}
        const found=dummy.found??false;
        const rescued=dummy.rescued??false;
        if(dummyEventInitialized&&found&&!previousFoundState[dummyId]){showDummyEventOverlay("found",dummyId,dummy);}
        if(dummyEventInitialized&&rescued&&!previousRescuedState[dummyId]){showDummyEventOverlay("rescue",dummyId,dummy);}
        previousFoundState[dummyId]=found;
        previousRescuedState[dummyId]=rescued;
    });
    dummyEventInitialized=true;
}

function calcRemain(timer){

    if(timer.endTime){

        return Math.max(
            0,
            Math.ceil(
                (
                    timer.endTime-
                    Date.now()
                )/1000
            )
        );
    }

    return (
        timer.remaining ??
        timer.duration ??
        300
    );
}

function calcDummyHp(
    dummy,
    timer
){

    if(dummy?.rescued&&dummy.rescuedHp!==null&&dummy.rescuedHp!==undefined){
        return dummy.rescuedHp;
    }

    const duration=
        timer.duration ??
        300;

    const remaining=
        calcRemain(timer);

    const elapsed=
        Math.max(
            0,
            duration-remaining
        );

    const maxHp=
        dummy.maxHp ??
        MAX_LIFE;

    const manualDamage=
        dummy.manualDamage ??
        0;

    const timeDamage=
        maxHp*
        (
            elapsed/
            duration
        );

    return Math.max(
        0,
        Math.round(
            maxHp-
            timeDamage-
            manualDamage
        )
    );
}

function updateDummyView(
    roomData
){

    if(!roomData.dummies){
        return;
    }

    const timer=
        roomData.timer||{};

    const dummy1=
        roomData.dummies.dummy1;

    const dummy2=
        roomData.dummies.dummy2;

    const dummy3=
        roomData.dummies.dummy3;

    const hp1=
        calcDummyHp(
            dummy1,
            timer
        );

    const hp2=
        calcDummyHp(
            dummy2,
            timer
        );

    const hp3=
        calcDummyHp(
            dummy3,
            timer
        );

    dummy1Hp.innerText=hp1;
    dummy2Hp.innerText=hp2;
    dummy3Hp.innerText=hp3;

    dummy1Bar.style.width=
        `${
            (
                hp1/
                (
                    dummy1.maxHp??
                    MAX_LIFE
                )
            )*100
        }%`;

    dummy2Bar.style.width=
        `${
            (
                hp2/
                (
                    dummy2.maxHp??
                    MAX_LIFE
                )
            )*100
        }%`;

    dummy3Bar.style.width=
        `${
            (
                hp3/
                (
                    dummy3.maxHp??
                    MAX_LIFE
                )
            )*100
        }%`;

    renderDummyIcon(dummyCard1,dummy1,"dummy1");
    renderDummyIcon(dummyCard2,dummy2,"dummy2");
    renderDummyIcon(dummyCard3,dummy3,"dummy3");

    [
        {
            card:dummyCard1,
            data:dummy1
        },
        {
            card:dummyCard2,
            data:dummy2
        },
        {
            card:dummyCard3,
            data:dummy3
        }
    ].forEach(item=>{

        if(
            item.data?.found
        ){

            item.card.classList.remove(
                "hidden-dummy"
            );

            item.card.classList.add(
                "found-dummy"
            );

        }else{

            item.card.classList.remove(
                "found-dummy"
            );

            item.card.classList.add(
                "hidden-dummy"
            );
        }
    });
}

function updateRefereeList(
    roomData
){

    const players=
        Object.values(
            roomData.players||{}
        );

    const referees=
        players.filter(
            player=>
                player.role===
                "referee"
        );

    refereeList.innerHTML=
        referees.length
        ?
        referees.map(
            player=>`
            <div class="access-user">
                ${
                    player.name||
                    "NO NAME"
                }
            </div>
            `
        ).join("")
        :
        `
        <div class="access-user">
            NONE
        </div>
        `;
}

function updateStoveReportView(roomData){

    const report=
        roomData.playerStoveReport||{};

    reportStoveRoomA.value=
        report.roomA??"";

    reportStoveRoomB.value=
        report.roomB??"";

    reportStoveRoomC.value=
        report.roomC??"";
}

async function sendStoveReport(){

    await update(
        roomRef,
        {
            "playerStoveReport/roomA":
                reportStoveRoomA.value,

            "playerStoveReport/roomB":
                reportStoveRoomB.value,

            "playerStoveReport/roomC":
                reportStoveRoomC.value
        }
    );
}

async function sendReport(
    dummyId
){

    const faceColor=
        document.querySelector(
            `.report-face-color[data-dummy="${dummyId}"]`
        )?.value || "";

    const soundFrequency=
        document.querySelector(
            `.report-sound-frequency[data-dummy="${dummyId}"]`
        )?.value || "";

    const qrCode=
        document.querySelector(
            `.report-qr-code[data-dummy="${dummyId}"]`
        )?.value || "";
        const rightHand=
        document.querySelector(
            `.report-right-hand[data-dummy="${dummyId}"]`
        )?.checked || false;

    const leftHand=
        document.querySelector(
            `.report-left-hand[data-dummy="${dummyId}"]`
        )?.checked || false;

    const rightLeg=
        document.querySelector(
            `.report-right-leg[data-dummy="${dummyId}"]`
        )?.checked || false;

    const leftLeg=
        document.querySelector(
            `.report-left-leg[data-dummy="${dummyId}"]`
        )?.checked || false;

    const walking=
        document.querySelector(
            `.report-walking[data-dummy="${dummyId}"]`
        )?.value==="true";

    await update(
        roomRef,
        {
            [`dummies/${dummyId}/playerReport/faceColor`]:
                faceColor,

            [`dummies/${dummyId}/playerReport/soundFrequency`]:
                Number(soundFrequency),

            [`dummies/${dummyId}/playerReport/qrCode`]:
                qrCode,

            [`dummies/${dummyId}/playerReport/injuries/rightHand`]:
                rightHand,

            [`dummies/${dummyId}/playerReport/injuries/leftHand`]:
                leftHand,

            [`dummies/${dummyId}/playerReport/injuries/rightLeg`]:
                rightLeg,

            [`dummies/${dummyId}/playerReport/injuries/leftLeg`]:
                leftLeg,

            [`dummies/${dummyId}/playerReport/injuries/walking`]:
                walking
        }
    );
}

if(!roomSnapshot.exists()){

    refereeList.innerHTML=
        "ROOM NOT FOUND";

}else{

    const myUserId=
        crypto.randomUUID();

    const playerRef=
        push(
            ref(
                db,
                `rooms/${roomId}/players`
            )
        );

    await set(
        playerRef,
        {
            userId:myUserId,
            role:role,
            name:playerName,
            joinedAt:Date.now()
        }
    );

    onDisconnect(
        playerRef
    ).remove();

    reportButtons.forEach(
        button=>{

            button.onclick=
            async()=>{

                await sendReport(
                    button.dataset.dummy
                );

                button.classList.add(
                    "report-success"
                );

                setTimeout(
                    ()=>{
                        button.classList.remove(
                            "report-success"
                        );
                    },
                    1500
                );
            };
        }
    );

    btnReportStove.onclick=async()=>{

        await sendStoveReport();

        btnReportStove.classList.add(
            "report-success"
        );

        setTimeout(
            ()=>{
                btnReportStove.classList.remove(
                    "report-success"
                );
            },
            1500
        );
    };

    onValue(
        roomRef,
        (
            snapshot
        )=>{

            const roomData=
                snapshot.val();

            if(
                !roomData
            ){
                return;
            }

            if(roomData.finished){
                if(timerInterval){
                    clearInterval(timerInterval);
                }

                finishMotion.innerText="MATCH FINISHED";
                finishMotion.classList.add("show");
                matchTimer.innerText="MATCH FINISHED";
                matchTimer.style.color="#ff5555";

                updateDummyView(roomData);
                return;
            }

            const players=
                Object.values(
                    roomData.players||{}
                );

            const refereeCount=
                players.filter(
                    player=>
                        player.role===
                        "referee"
                ).length;

            if(
                refereeCount===0
            ){

                waitingScreen.style.display=
                    "flex";

                matchArea.style.display=
                    "none";

                return;

            }else{

                waitingScreen.style.display=
                    "none";

                matchArea.style.display=
                    "flex";
            }

            updateRefereeList(
                roomData
            );

            updateStoveReportView(
                roomData
            );

            if(
                roomData.finished
            ){

                finishMotion.classList.add(
                    "show"
                );

            }else{

                finishMotion.classList.remove(
                    "show"
                );
            }

            const settings=
                roomData.settings||{};

            const dummyCount=
                settings.dummyCount
                ??3;

            dummyCard1.style.display=
                "flex";

            dummyCard2.style.display=
                dummyCount>=2
                ?
                "flex"
                :
                "none";

            dummyCard3.style.display=
                dummyCount>=3
                ?
                "flex"
                :
                "none";

            checkDummyEvents(roomData);

            const timer=
                roomData.timer||{};

            const endTime=
                timer.endTime;

            const remaining=
                timer.remaining
                ??
                timer.duration
                ??
                300;

            if(
                timerInterval
            ){

                clearInterval(
                    timerInterval
                );
            }

            if(timer.countdown&&timer.countdownEndTime){

                const updateCountdown=
                ()=>{

                    const count=
                        Math.max(
                            0,
                            Math.ceil(
                                (
                                    timer.countdownEndTime-
                                    Date.now()
                                )/1000
                            )
                        );

                    matchTimer.innerHTML=
                        count>0
                        ? `<div class="mission-countdown"><div class="mission-countdown-label">MATCH START IN</div><div class="mission-countdown-number">${count}</div></div>`
                        : `<span class="mission-start-text">MISSION START</span>`;

                    matchTimer.style.color="#ffcc00";

                    updateDummyView(
                        roomData
                    );
                };

                updateCountdown();

                timerInterval=
                    setInterval(
                        updateCountdown,
                        250
                    );

            }else if(
                endTime
            ){

                const updateTimer=
                ()=>{

                    const remain=
                        Math.max(
                            0,
                            Math.ceil(
                                (
                                    endTime-
                                    Date.now()
                                )/1000
                            )
                        );

                    const minutes=
                        String(
                            Math.floor(
                                remain/60
                            )
                        ).padStart(
                            2,
                            "0"
                        );

                    const seconds=
                        String(
                            remain%60
                        ).padStart(
                            2,
                            "0"
                        );

                    matchTimer.innerText=
                        `${minutes}:${seconds}`;

                    updateDummyView(
                        roomData
                    );
                };

                updateTimer();

                timerInterval=
                    setInterval(
                        updateTimer,
                        1000
                    );

            }else{

                const minutes=
                    String(
                        Math.floor(
                            remaining/60
                        )
                    ).padStart(
                        2,
                        "0"
                    );

                const seconds=
                    String(
                        remaining%60
                    ).padStart(
                        2,
                        "0"
                    );

                matchTimer.innerText=
                    `${minutes}:${seconds}`;

                updateDummyView(
                    roomData
                );
            }
        }
    );
}