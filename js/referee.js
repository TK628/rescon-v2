import { app } from "./firebase.js";
import { MAX_LIFE } from "./constants.js";

import {
    getDatabase,
    ref,
    get,
    set,
    onValue,
    push,
    onDisconnect,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);
const params=new URLSearchParams(location.search);

const roomId=params.get("room");
const role=params.get("role");
const playerName=params.get("name");
const openSettings=params.get("openSettings");

const roomNameElement=document.getElementById("room-name");
const matchTimer=document.getElementById("match-timer");
const btnTimerToggle=document.getElementById("btn-timer-toggle");
const timerStateLabel=document.getElementById("timer-state-label");
const refereeTimerRow=document.getElementById("referee-timer-row");
const btnFullReset=document.getElementById("btn-full-reset");
const btnBack=document.getElementById("btn-back");
const btnSettings=document.getElementById("btn-settings");
const btnAccess=document.getElementById("btn-access");
const accessOverlay=document.getElementById("access-overlay");
const btnCloseAccess=document.getElementById("btn-close-access");
const accessList=document.getElementById("access-list");

const settingsOverlay=document.getElementById("settings-overlay");
const btnCloseSettings=document.getElementById("btn-close-settings");
const btnSaveSettings=document.getElementById("btn-save-settings");
const btnSaveDummyDetail=document.getElementById("btn-save-dummy-detail");
const settingTimeButtons=document.querySelectorAll(".setting-time");
const settingDummyButtons=document.querySelectorAll(".setting-dummy");

const dummySettingTabs=document.querySelectorAll(".dummy-setting-tab");
const clothesColorSelect=document.getElementById("setting-clothes-color");
const soundFrequencySelect=document.getElementById("setting-sound-frequency");
const faceColorButtons=document.querySelectorAll(".face-color-button");
const walkingButtons=document.querySelectorAll(".walking-button");
const rightHandCheck=document.getElementById("setting-right-hand");
const leftHandCheck=document.getElementById("setting-left-hand");
const rightLegCheck=document.getElementById("setting-right-leg");
const leftLegCheck=document.getElementById("setting-left-leg");
const btnFoundDummy1=document.getElementById("btn-found-dummy1");
const btnFoundDummy2=document.getElementById("btn-found-dummy2");
const btnFoundDummy3=document.getElementById("btn-found-dummy3");

const taskArrivalA=document.getElementById("task-arrival-a");
const taskArrivalB=document.getElementById("task-arrival-b");
const taskArrivalC=document.getElementById("task-arrival-c");

const taskDebris=document.getElementById("task-debris");
const taskGas=document.getElementById("task-gas");

const stoveRoomA=document.getElementById("stove-room-a");
const stoveRoomB=document.getElementById("stove-room-b");
const stoveRoomC=document.getElementById("stove-room-c");

const btnRescueDummy1=document.getElementById("btn-rescue-dummy1");
const btnRescueDummy2=document.getElementById("btn-rescue-dummy2");
const btnRescueDummy3=document.getElementById("btn-rescue-dummy3");

const dummyCard1=document.getElementById("dummy-card-1");
const dummyCard2=document.getElementById("dummy-card-2");
const dummyCard3=document.getElementById("dummy-card-3");

const dummy1Hp=document.getElementById("dummy1-hp");
const dummy1Bar=document.getElementById("dummy1-bar");
const dummy2Hp=document.getElementById("dummy2-hp");
const dummy2Bar=document.getElementById("dummy2-bar");
const dummy3Hp=document.getElementById("dummy3-hp");
const dummy3Bar=document.getElementById("dummy3-bar");

const btnDummy1Minus1=document.getElementById("btn-dummy1-minus1");
const btnDummy1Minus5=document.getElementById("btn-dummy1-minus5");
const btnDummy1Minus10=document.getElementById("btn-dummy1-minus10");
const btnDummy1Reset=document.getElementById("btn-dummy1-reset");

const btnDummy2Minus1=document.getElementById("btn-dummy2-minus1");
const btnDummy2Minus5=document.getElementById("btn-dummy2-minus5");
const btnDummy2Minus10=document.getElementById("btn-dummy2-minus10");
const btnDummy2Reset=document.getElementById("btn-dummy2-reset");

const btnDummy3Minus1=document.getElementById("btn-dummy3-minus1");
const btnDummy3Minus5=document.getElementById("btn-dummy3-minus5");
const btnDummy3Minus10=document.getElementById("btn-dummy3-minus10");
const btnDummy3Reset=document.getElementById("btn-dummy3-reset");

const finishMotion=document.getElementById("finish-motion");

let timerInterval=null;
let selectedMatchTime=300;
let selectedDummyCount=3;
let selectedDummyId="dummy1";
let selectedFaceColor="black";
let selectedWalking=true;
let countdownStartHandled=false;
let finishingNow=false;
let latestRefereeRoomData=null;

const roomRef=ref(db,`rooms/${roomId}`);
const roomSnapshot=await get(roomRef);

function calcRemain(timer){
    if(timer.endTime){
        return Math.max(0,Math.ceil((timer.endTime-Date.now())/1000));
    }

    return timer.remaining ?? timer.duration ?? 300;
}

function calcDummyHp(dummy,timer){
    if(dummy?.rescued&&dummy.rescuedHp!==null&&dummy.rescuedHp!==undefined){
        return dummy.rescuedHp;
    }

    const duration=timer.duration ?? selectedMatchTime ?? 300;
    const remaining=calcRemain(timer);
    const elapsed=Math.max(0,duration-remaining);
    const maxHp=dummy.maxHp ?? MAX_LIFE;
    const manualDamage=dummy.manualDamage ?? 0;
    const timeDamage=maxHp*(elapsed/duration);

    return Math.max(0,Math.round(maxHp-timeDamage-manualDamage));
}


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
        const slot=card.querySelector(".dummy-icon-slot");
        holder=document.createElement("div");
        holder.className="dummy-icon-holder";
        if(slot){
            slot.appendChild(holder);
        }else{
            const nameElement=card.querySelector(".dummy-name");
            if(nameElement){nameElement.after(holder);}else{card.prepend(holder);}
        }
    }
    holder.innerHTML=createDummyIconHtml(dummy,dummyId);
}

function updateAccessList(roomData){
    const players=Object.values(roomData.players||{});

    const referees=players.filter(player=>player.role==="referee");
    const normalPlayers=players.filter(player=>player.role==="player");
    const spectators=players.filter(player=>player.role==="spectator");

    accessList.innerHTML=`
        <div class="access-group">
            <div class="access-title">REFEREE</div>
            ${
                referees.length
                ?
                referees.map(
                    player=>`
                    <div class="access-user">
                        ${player.name||"NO NAME"}
                    </div>
                    `
                ).join("")
                :
                "<div class='access-user'>NONE</div>"
            }
        </div>

        <hr>

        <div class="access-group">
            <div class="access-title">PLAYER</div>
            ${
                normalPlayers.length
                ?
                normalPlayers.map(
                    player=>`
                    <div class="access-user">
                        ${player.name||"NO NAME"}
                    </div>
                    `
                ).join("")
                :
                "<div class='access-user'>NONE</div>"
            }
        </div>

        <hr>

        <div class="access-group">
            <div class="access-title">SPECTATOR</div>
            ${
                spectators.length
                ?
                spectators.map(
                    player=>`
                    <div class="access-user">
                        ${player.name||"NO NAME"}
                    </div>
                    `
                ).join("")
                :
                "<div class='access-user'>NONE</div>"
            }
        </div>
    `;
}

function updateDummyView(roomData){
    if(!roomData.dummies){
        return;
    }

    const timer=roomData.timer||{};
    const dummy1=roomData.dummies.dummy1;
    const dummy2=roomData.dummies.dummy2;
    const dummy3=roomData.dummies.dummy3;

    const hp1=calcDummyHp(dummy1,timer);
    const hp2=calcDummyHp(dummy2,timer);
    const hp3=calcDummyHp(dummy3,timer);

    dummy1Hp.innerText=hp1;
    dummy2Hp.innerText=hp2;
    dummy3Hp.innerText=hp3;

    dummy1Bar.style.width=`${(hp1/(dummy1.maxHp??MAX_LIFE))*100}%`;
    dummy2Bar.style.width=`${(hp2/(dummy2.maxHp??MAX_LIFE))*100}%`;
    dummy3Bar.style.width=`${(hp3/(dummy3.maxHp??MAX_LIFE))*100}%`;
    renderDummyIcon(dummyCard1,dummy1,"dummy1");
    renderDummyIcon(dummyCard2,dummy2,"dummy2");
    renderDummyIcon(dummyCard3,dummy3,"dummy3");
}

function updateFaceColorButtons(faceColor){
    selectedFaceColor=faceColor??"black";

    faceColorButtons.forEach((button)=>{
        if(button.dataset.faceColor===selectedFaceColor){
            button.classList.add("setting-selected");
        }else{
            button.classList.remove("setting-selected");
        }
    });
}

function updateWalkingButtons(walking){
    selectedWalking=walking??true;

    walkingButtons.forEach((button)=>{
        if(button.dataset.walking===String(selectedWalking)){
            button.classList.add("setting-selected");
        }else{
            button.classList.remove("setting-selected");
        }
    });
}

function updateDummySettingPanel(roomData){
    const dummy=roomData.dummies?.[selectedDummyId];

    if(!dummy){
        return;
    }

    clothesColorSelect.value=dummy.clothesColor??"red";
    soundFrequencySelect.value=String(dummy.soundFrequency??1);

    rightHandCheck.checked=dummy.injuries?.rightHand??false;
    leftHandCheck.checked=dummy.injuries?.leftHand??false;
    rightLegCheck.checked=dummy.injuries?.rightLeg??false;
    leftLegCheck.checked=dummy.injuries?.leftLeg??false;

    updateFaceColorButtons(dummy.faceColor??"black");
    updateWalkingButtons(dummy.injuries?.walking??true);
}


function updateFoundButtons(roomData){
    const setButton=(button,found)=>{
        if(found){
            button.innerText="発見済";
            button.classList.add("setting-selected");
        }else{
            button.innerText="未発見";
            button.classList.remove("setting-selected");
        }
    };

    setButton(btnFoundDummy1,roomData.dummies?.dummy1?.found??false);
    setButton(btnFoundDummy2,roomData.dummies?.dummy2?.found??false);
    setButton(btnFoundDummy3,roomData.dummies?.dummy3?.found??false);
}

async function toggleFound(dummyId){
    const snapshot=await get(roomRef);
    const roomData=snapshot.val();
    const current=roomData.dummies?.[dummyId]?.found??false;

    await update(
        roomRef,
        {
            [`dummies/${dummyId}/found`]:!current
        }
    );
}

function updateTaskView(roomData){

    const tasks=roomData.tasks||{};

    taskArrivalA.checked=tasks.arrivalA??false;
    taskArrivalB.checked=tasks.arrivalB??false;
    taskArrivalC.checked=tasks.arrivalC??false;

    taskDebris.checked=tasks.debris??false;
    taskGas.checked=tasks.gas??false;
}

function updateStoveSettingView(roomData){
    const stoves=roomData.stoves||{};

    stoveRoomA.value=stoves.roomA??"off";
    stoveRoomB.value=stoves.roomB??"off";
    stoveRoomC.value=stoves.roomC??"off";
}

async function saveStoveState(roomName,value){
    await update(
        roomRef,
        {
            [`stoves/${roomName}`]:value
        }
    );
}

function updateRescueButtons(roomData){

    const dummy1=roomData.dummies?.dummy1;
    const dummy2=roomData.dummies?.dummy2;
    const dummy3=roomData.dummies?.dummy3;

    const setButton=(button,rescued)=>{

        if(rescued){
            button.innerText="救助済";
            button.classList.add("setting-selected");
        }else{
            button.innerText="未救助";
            button.classList.remove("setting-selected");
        }
    };

    setButton(
        btnRescueDummy1,
        dummy1?.rescued??false
    );

    setButton(
        btnRescueDummy2,
        dummy2?.rescued??false
    );

    setButton(
        btnRescueDummy3,
        dummy3?.rescued??false
    );
}

async function saveTask(taskName,value){

    await update(
        roomRef,
        {
            [`tasks/${taskName}`]:value
        }
    );
}

function getActiveDummyIds(roomData){
    const dummyCount=roomData.settings?.dummyCount??selectedDummyCount??3;

    return ["dummy1","dummy2","dummy3"].slice(0,dummyCount);
}

function isAllActiveDummiesRescued(roomData){
    const ids=getActiveDummyIds(roomData);

    return ids.length>0&&ids.every(
        dummyId=>roomData.dummies?.[dummyId]?.rescued
    );
}

async function finishMatch(roomData,message="MATCH FINISHED",moveToResult=true){
    if(finishingNow||roomData.finished){
        return;
    }

    finishingNow=true;

    const finalRoomData={
        ...roomData,
        finished:true,
        matchState:"finished",
        timer:{
            ...(roomData.timer||{}),
            endTime:null,
            countdown:false,
            countdownEndTime:null,
            remaining:0
        }
    };

    const finalScore=calculateTotalScore(finalRoomData);

    await update(roomRef,{
        finished:true,
        matchState:"finished",
        result:finalScore,
        "timer/endTime":null,
        "timer/countdown":false,
        "timer/countdownEndTime":null,
        "timer/remaining":0
    });

    finishMotion.innerText=message;
    finishMotion.classList.add("show");

    if(moveToResult){
        setTimeout(()=>{
            location.href=`./result.html?room=${roomId}`;
        },1500);
    }
}

async function toggleRescue(dummyId){
    const snapshot=await get(roomRef);
    const roomData=snapshot.val();

    const current=
        roomData.dummies?.[dummyId]?.rescued
        ??false;

    if(current){
        await update(
            roomRef,
            {
                [`dummies/${dummyId}/rescued`]:false,
                [`dummies/${dummyId}/rescuedHp`]:null
            }
        );

        return;
    }

    const currentHp=calcDummyHp(
        roomData.dummies?.[dummyId]||{},
        roomData.timer||{}
    );

    await update(
        roomRef,
        {
            [`dummies/${dummyId}/rescued`]:true,
            [`dummies/${dummyId}/rescuedHp`]:currentHp
        }
    );

    const nextRoomData={
        ...roomData,
        dummies:{
            ...(roomData.dummies||{}),
            [dummyId]:{
                ...(roomData.dummies?.[dummyId]||{}),
                rescued:true,
                rescuedHp:currentHp
            }
        }
    };

    if(isAllActiveDummiesRescued(nextRoomData)){
        await finishMatch(nextRoomData,"MISSION COMPLETE");
    }
}

function calculateTaskScore(roomData){

    const tasks=
        roomData.tasks||{};

    let score=0;

    if(tasks.arrivalA) score+=10;
    if(tasks.arrivalB) score+=10;
    if(tasks.arrivalC) score+=10;

    if(tasks.debris) score+=30;
    if(tasks.gas) score+=30;

    return score;
}

function calculateStoveScore(roomData){

    const stoves=roomData.stoves||{};
    const report=roomData.playerStoveReport||{};

    let score=0;

    if(report.roomA!==""&&report.roomA===stoves.roomA) score+=10;
    if(report.roomB!==""&&report.roomB===stoves.roomB) score+=10;
    if(report.roomC!==""&&report.roomC===stoves.roomC) score+=10;

    return score;
}
function calculateRescueScore(roomData){

    const timer=
        roomData.timer||{};

    let score=0;

    ["dummy1","dummy2","dummy3"]
    .forEach(dummyId=>{

        const dummy=
            roomData.dummies?.[dummyId];

        if(!dummy){
            return;
        }

        if(!dummy.rescued){
            return;
        }

        score+=
            dummy.rescuedHp
            ??
            calcDummyHp(
                dummy,
                timer
            );
    });

    return score;
}

function calculateReportScore(roomData){

    let score=0;

    ["dummy1","dummy2","dummy3"]
    .forEach(dummyId=>{

        const dummy=
            roomData.dummies?.[dummyId];

        if(!dummy){
            return;
        }

        const report=
            dummy.playerReport||{};

        if(report.faceColor===dummy.faceColor) score+=50;

        if(
            Number(report.soundFrequency)===
            Number(dummy.soundFrequency)
        ) score+=50;

        if(
            report.injuries?.rightHand===
            dummy.injuries?.rightHand
        ) score+=50;

        if(
            report.injuries?.leftHand===
            dummy.injuries?.leftHand
        ) score+=50;

        if(
            report.injuries?.rightLeg===
            dummy.injuries?.rightLeg
        ) score+=50;

        if(
            report.injuries?.leftLeg===
            dummy.injuries?.leftLeg
        ) score+=50;

        if(
            report.injuries?.walking===
            dummy.injuries?.walking
        ) score+=50;
    });

    return score;
}

function calculateTotalScore(roomData){

    const timer=
        roomData.timer||{};

    const remain=
        calcRemain(timer);

    const timeScore=
        remain;

    const taskScore=
        calculateTaskScore(roomData);

    const stoveScore=
        calculateStoveScore(roomData);

    const rescueScore=
        calculateRescueScore(roomData);

    const reportScore=
        calculateReportScore(roomData);

    return{
        timeScore,
        taskScore,
        stoveScore,
        rescueScore,
        reportScore,
        total:
            timeScore+
            taskScore+
            stoveScore+
            rescueScore+
            reportScore
    };
}



async function saveSelectedDummyDetailOnly(){
    await update(roomRef,{
        [`dummies/${selectedDummyId}/clothesColor`]:clothesColorSelect.value,
        [`dummies/${selectedDummyId}/faceColor`]:selectedFaceColor,
        [`dummies/${selectedDummyId}/soundFrequency`]:Number(soundFrequencySelect.value),
        [`dummies/${selectedDummyId}/injuries/rightHand`]:rightHandCheck.checked,
        [`dummies/${selectedDummyId}/injuries/leftHand`]:leftHandCheck.checked,
        [`dummies/${selectedDummyId}/injuries/rightLeg`]:rightLegCheck.checked,
        [`dummies/${selectedDummyId}/injuries/leftLeg`]:leftLegCheck.checked,
        [`dummies/${selectedDummyId}/injuries/walking`]:selectedWalking,
        [`dummies/${selectedDummyId}/maxHp`]:MAX_LIFE
    });
}

if(!roomSnapshot.exists()){
    roomNameElement.innerText="ROOM NOT FOUND";
}else{
    const initialRoomData=roomSnapshot.val();

    roomNameElement.innerText=initialRoomData.roomName;

    const myUserId=crypto.randomUUID();
    const playerRef=push(ref(db,`rooms/${roomId}/players`));

    await set(playerRef,{
        userId:myUserId,
        role:role,
        name:playerName,
        joinedAt:Date.now()
    });

    onDisconnect(playerRef).remove();

    btnBack.onclick=()=>{
        location.href="./room.html";
    };

    btnSettings.onclick=()=>{
        settingsOverlay.style.display="flex";
    };

    if(openSettings==="1"){
        settingsOverlay.style.display="flex";
    }

    btnAccess.onclick=()=>{
        accessOverlay.style.display="flex";
    };

    btnCloseAccess.onclick=()=>{
        accessOverlay.style.display="none";
    };

    if(btnCloseSettings){
        btnCloseSettings.onclick=()=>{
            settingsOverlay.style.display="none";
        };
    }

    taskArrivalA.onchange=()=>{
        saveTask(
            "arrivalA",
            taskArrivalA.checked
        );
    };

    taskArrivalB.onchange=()=>{
        saveTask(
            "arrivalB",
            taskArrivalB.checked
        );
    };

    taskArrivalC.onchange=()=>{
        saveTask(
            "arrivalC",
            taskArrivalC.checked
        );
    };

    taskDebris.onchange=()=>{
        saveTask(
            "debris",
            taskDebris.checked
        );
    };

    taskGas.onchange=()=>{
        saveTask(
            "gas",
            taskGas.checked
        );
    };

    stoveRoomA.onchange=()=>{
        saveStoveState(
            "roomA",
            stoveRoomA.value
        );
    };

    stoveRoomB.onchange=()=>{
        saveStoveState(
            "roomB",
            stoveRoomB.value
        );
    };

    stoveRoomC.onchange=()=>{
        saveStoveState(
            "roomC",
            stoveRoomC.value
        );
    };

    btnRescueDummy1.onclick=()=>{
        toggleRescue(
            "dummy1"
        );
    };

    btnRescueDummy2.onclick=()=>{
        toggleRescue(
            "dummy2"
        );
    };

    btnRescueDummy3.onclick=()=>{
        toggleRescue(
            "dummy3"
        );
    };

    settingTimeButtons.forEach((button)=>{
        button.onclick=()=>{
            selectedMatchTime=Number(button.dataset.time);

            settingTimeButtons.forEach((btn)=>{
                btn.classList.remove("setting-selected");
            });

            button.classList.add("setting-selected");
        };
    });

    settingDummyButtons.forEach((button)=>{
        button.onclick=()=>{
            selectedDummyCount=Number(button.dataset.count);

            settingDummyButtons.forEach((btn)=>{
                btn.classList.remove("setting-selected");
            });

            button.classList.add("setting-selected");
        };
    });

    dummySettingTabs.forEach((button)=>{
        button.onclick=async()=>{
            if(selectedDummyId&&selectedDummyId!==button.dataset.dummy){
                await saveSelectedDummyDetailOnly();
            }

            selectedDummyId=button.dataset.dummy;

            dummySettingTabs.forEach((tab)=>{
                tab.classList.remove("setting-selected");
                tab.classList.remove("active");
            });

            button.classList.add("setting-selected");
            button.classList.add("active");

            const snapshot=await get(roomRef);
            const roomData=snapshot.val();

            if(roomData){
                latestRefereeRoomData=roomData;
                updateDummySettingPanel(roomData);
            }
        };
    });

    faceColorButtons.forEach((button)=>{
        button.onclick=()=>{
            selectedFaceColor=button.dataset.faceColor;
            updateFaceColorButtons(selectedFaceColor);
        };
    });

    walkingButtons.forEach((button)=>{
        button.onclick=()=>{
            selectedWalking=button.dataset.walking==="true";
            updateWalkingButtons(selectedWalking);
        };
    });
    btnFoundDummy1.onclick=()=>{
        toggleFound("dummy1");
    };

    btnFoundDummy2.onclick=()=>{
        toggleFound("dummy2");
    };

    btnFoundDummy3.onclick=()=>{
        toggleFound("dummy3");
    };

    if(btnSaveDummyDetail){
        btnSaveDummyDetail.onclick=async()=>{
            await saveSelectedDummyDetailOnly();

            btnSaveDummyDetail.classList.add("setting-selected");
            btnSaveDummyDetail.innerText="保存済み";

            setTimeout(()=>{
                btnSaveDummyDetail.classList.remove("setting-selected");
                btnSaveDummyDetail.innerText="ダミヤン保存";
            },900);
        };
    }
btnSaveSettings.onclick=async()=>{
        await saveSelectedDummyDetailOnly();

        await update(roomRef,{
            "settings/matchTime":selectedMatchTime,
            "settings/dummyCount":selectedDummyCount,
            "timer/duration":selectedMatchTime,
            "timer/remaining":selectedMatchTime,
            "timer/endTime":null,
            finished:false,

            [`dummies/${selectedDummyId}/clothesColor`]:clothesColorSelect.value,
            [`dummies/${selectedDummyId}/faceColor`]:selectedFaceColor,
            [`dummies/${selectedDummyId}/soundFrequency`]:Number(soundFrequencySelect.value),

            [`dummies/${selectedDummyId}/injuries/rightHand`]:rightHandCheck.checked,
            [`dummies/${selectedDummyId}/injuries/leftHand`]:leftHandCheck.checked,
            [`dummies/${selectedDummyId}/injuries/rightLeg`]:rightLegCheck.checked,
            [`dummies/${selectedDummyId}/injuries/leftLeg`]:leftLegCheck.checked,
            [`dummies/${selectedDummyId}/injuries/walking`]:selectedWalking,

            [`dummies/${selectedDummyId}/maxHp`]:MAX_LIFE
        });

        settingsOverlay.style.display="none";
    };
btnTimerToggle.onclick=async()=>{
        const snapshot=await get(roomRef);
        const roomData=snapshot.val();
        const timer=roomData.timer||{};
        const endTime=timer.endTime;

        if(timer.countdown){
            await update(roomRef,{
                matchState:"waiting",
                "timer/countdown":false,
                "timer/countdownEndTime":null
            });
            return;
        }

        if(!endTime){
            await update(roomRef,{
                finished:false,
                matchState:"countdown",
                "timer/countdown":true,
                "timer/countdownEndTime":Date.now()+5000,
                "timer/endTime":null
            });
        }else{
            const remain=Math.max(0,Math.ceil((endTime-Date.now())/1000));

            await update(roomRef,{
                matchState:"paused",
                "timer/endTime":null,
                "timer/remaining":remain,
                "timer/countdown":false,
                "timer/countdownEndTime":null
            });
        }
    };

    if(refereeTimerRow){
        refereeTimerRow.onclick=(event)=>{
            const clickedButton=event.target.closest("button");
            if(clickedButton&&clickedButton!==btnTimerToggle){
                return;
            }
            if(clickedButton===btnTimerToggle){
                return;
            }
            btnTimerToggle.click();
        };
    }

    if(refereeTimerRow){
        refereeTimerRow.onkeydown=(event)=>{
            if(event.key==="Enter"||event.key===" "){
                event.preventDefault();
                btnTimerToggle.click();
            }
        };
    }

    btnFullReset.onclick=async()=>{
        const snapshot=await get(roomRef);
        const roomData=snapshot.val();
        const matchTime=roomData.settings?.matchTime??selectedMatchTime??300;

        await update(roomRef,{
            finished:false,
            matchState:"waiting",
            result:null,
            "timer/endTime":null,
            "timer/countdown":false,
            "timer/countdownEndTime":null,
            "timer/remaining":matchTime,
            "timer/duration":matchTime,

            "tasks/arrivalA":false,
            "tasks/arrivalB":false,
            "tasks/arrivalC":false,
            "tasks/debris":false,
            "tasks/gas":false,

            "stoves/roomA":"off",
            "stoves/roomB":"off",
            "stoves/roomC":"off",
            "playerStoveReport/roomA":"",
            "playerStoveReport/roomB":"",
            "playerStoveReport/roomC":"",

            "dummies/dummy1/manualDamage":0,
            "dummies/dummy2/manualDamage":0,
            "dummies/dummy3/manualDamage":0,
            "dummies/dummy1/maxHp":MAX_LIFE,
            "dummies/dummy2/maxHp":MAX_LIFE,
            "dummies/dummy3/maxHp":MAX_LIFE,

            "dummies/dummy1/found":false,
            "dummies/dummy2/found":false,
            "dummies/dummy3/found":false,
            "dummies/dummy1/rescued":false,
            "dummies/dummy2/rescued":false,
            "dummies/dummy3/rescued":false,
            "dummies/dummy1/rescuedHp":null,
            "dummies/dummy2/rescuedHp":null,
            "dummies/dummy3/rescuedHp":null,

            "dummies/dummy1/playerReport":{
                faceColor:"",
                soundFrequency:null,
                injuries:{
                    rightHand:null,
                    leftHand:null,
                    rightLeg:null,
                    leftLeg:null,
                    walking:null
                }
            },
            "dummies/dummy2/playerReport":{
                faceColor:"",
                soundFrequency:null,
                injuries:{
                    rightHand:null,
                    leftHand:null,
                    rightLeg:null,
                    leftLeg:null,
                    walking:null
                }
            },
            "dummies/dummy3/playerReport":{
                faceColor:"",
                soundFrequency:null,
                injuries:{
                    rightHand:null,
                    leftHand:null,
                    rightLeg:null,
                    leftLeg:null,
                    walking:null
                }
            }
        });
    };

    const damageDummy=async(dummyId,damage)=>{
        const snapshot=await get(roomRef);
        const roomData=snapshot.val();
        const dummy=roomData.dummies[dummyId];
        const manualDamage=dummy.manualDamage??0;

        await update(ref(db,`rooms/${roomId}/dummies/${dummyId}`),{
            manualDamage:manualDamage+damage,
            maxHp:dummy.maxHp??MAX_LIFE
        });
    };

    const resetDummy=async(dummyId)=>{
        await update(ref(db,`rooms/${roomId}/dummies/${dummyId}`),{
            manualDamage:0,
            maxHp:MAX_LIFE,
            rescued:false,
            rescuedHp:null
        });
    };
    btnDummy1Minus5.onclick=()=>damageDummy("dummy1",5);
    btnDummy1Minus10.onclick=()=>damageDummy("dummy1",10);
    btnDummy2Minus5.onclick=()=>damageDummy("dummy2",5);
    btnDummy2Minus10.onclick=()=>damageDummy("dummy2",10);
    btnDummy3Minus5.onclick=()=>damageDummy("dummy3",5);
    btnDummy3Minus10.onclick=()=>damageDummy("dummy3",10);

    onValue(roomRef,(snapshot)=>{
        const roomData=snapshot.val();
        latestRefereeRoomData=roomData;

        if(!roomData){
            return;
        }

        roomNameElement.innerText=roomData.roomName;
        updateAccessList(roomData);
        updateDummySettingPanel(roomData);
        updateFoundButtons(roomData);
        updateTaskView(roomData);
        updateStoveSettingView(roomData);
        updateRescueButtons(roomData);
        const score=calculateTotalScore(roomData);
        const settings=roomData.settings||{};
        selectedMatchTime=settings.matchTime??300;
        selectedDummyCount=settings.dummyCount??3;

        dummyCard1.style.display="flex";
        dummyCard2.style.display=selectedDummyCount>=2 ? "flex" : "none";
        dummyCard3.style.display=selectedDummyCount>=3 ? "flex" : "none";

        settingTimeButtons.forEach((button)=>{
            const time=Number(button.dataset.time);

            if(time===selectedMatchTime){
                button.classList.add("setting-selected");
            }else{
                button.classList.remove("setting-selected");
            }
        });

        settingDummyButtons.forEach((button)=>{
            const count=Number(button.dataset.count);

            if(count===selectedDummyCount){
                button.classList.add("setting-selected");
            }else{
                button.classList.remove("setting-selected");
            }
        });

        const timer=roomData.timer||{};
        const endTime=timer.endTime;
        const remaining=timer.remaining??timer.duration??selectedMatchTime;

        const timerButtonText=timer.countdown ? "CANCEL" : (endTime ? "STOP" : "START");
        btnTimerToggle.innerText=timerButtonText;

        if(timerStateLabel){
            timerStateLabel.innerText=
                timer.countdown
                ?
                "COUNTDOWN / TAP TO CANCEL"
                :
                (
                    endTime
                    ?
                    "RUNNING / TAP TO STOP"
                    :
                    "PAUSED / TAP TO START"
                );
        }

        if(refereeTimerRow){
            refereeTimerRow.classList.toggle("timer-running",!!endTime);
            refereeTimerRow.classList.toggle("timer-countdown",!!timer.countdown);
            refereeTimerRow.classList.toggle("timer-paused",!endTime&&!timer.countdown);
        }

        if(timerInterval){
            clearInterval(timerInterval);
        }

        if(timer.countdown&&timer.countdownEndTime){
            const updateCountdown=()=>{
                const count=Math.max(0,Math.ceil((timer.countdownEndTime-Date.now())/1000));

                if(count<=0){
                    clearInterval(timerInterval);

                    const remain=timer.remaining??timer.duration??selectedMatchTime;
                    const nextEndTime=Date.now()+remain*1000;

                    update(roomRef,{
                        matchState:"running",
                        "timer/countdown":false,
                        "timer/countdownEndTime":null,
                        "timer/endTime":nextEndTime
                    });

                    matchTimer.innerHTML="<span class='mission-start-text'>MISSION START</span>";
                    return;
                }

                matchTimer.innerHTML=`
                    <div class="mission-countdown">
                        <div class="mission-countdown-label">MISSION STARTING</div>
                        <div class="mission-countdown-number">${count}</div>
                    </div>
                `;
                matchTimer.style.color="#ffcc00";
                matchTimer.style.transform="scale(1.08)";
                updateDummyView(roomData);
            };

            updateCountdown();
            timerInterval=setInterval(updateCountdown,250);
        }else if(endTime){
            const updateTimer=()=>{
                const remain=Math.max(0,Math.ceil((endTime-Date.now())/1000));

                if(remain<=0){
                    clearInterval(timerInterval);
                    finishMatch(roomData,"MATCH FINISHED");
                    return;
                }

                const minutes=String(Math.floor(remain/60)).padStart(2,"0");
                const seconds=String(remain%60).padStart(2,"0");

                matchTimer.innerText=`${minutes}:${seconds}`;

                if(remain<=10){
                    matchTimer.style.color="#ff5555";
                    matchTimer.style.transform="scale(1.05)";
                }else{
                    matchTimer.style.color="#00ffff";
                    matchTimer.style.transform="scale(1)";
                }

                updateDummyView(roomData);
            };

            updateTimer();
            timerInterval=setInterval(updateTimer,1000);
        }else{
            const minutes=String(Math.floor(remaining/60)).padStart(2,"0");
            const seconds=String(remaining%60).padStart(2,"0");

            matchTimer.innerText=`${minutes}:${seconds}`;
            matchTimer.style.color="#00ffff";
            matchTimer.style.transform="scale(1)";

            updateDummyView(roomData);
        }
    });
}