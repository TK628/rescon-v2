import { app } from "./firebase.js";

import {
    getDatabase,
    ref,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);

const btnHome=document.getElementById("btn-home");
const roomSearch=document.getElementById("room-search");
const roomList=document.getElementById("room-list");
const btnCreateRoom=document.getElementById("btn-create-room");

const joinOverlay=document.getElementById("join-overlay");
const joinRoomName=document.getElementById("join-room-name");
const joinRoomId=document.getElementById("join-room-id");
const joinRoomPass=document.getElementById("join-room-pass");
const playerNameInput=document.getElementById("player-name-input");

const btnReferee=document.getElementById("btn-referee");
const btnPlayer=document.getElementById("btn-player");
const btnSpectator=document.getElementById("btn-spectator");
const btnCloseJoin=document.getElementById("btn-close-join");

let roomsCache={};
let selectedRoomKey=null;
let selectedRoomData=null;

const createdRoom=sessionStorage.getItem("roomCreated");

if(createdRoom){
    alert(`${createdRoom} を作成しました`);
    sessionStorage.removeItem("roomCreated");
}

btnHome.onclick=()=>{
    location.href="./home.html";
};

btnCreateRoom.onclick=()=>{
    location.href="./create-room.html";
};

btnCloseJoin.onclick=()=>{
    joinOverlay.style.display="none";
};

function getRemainDays(expiresAt){
    if(!expiresAt){
        return "-";
    }

    const remain=Math.ceil((expiresAt-Date.now())/86400000);

    return Math.max(0,remain);
}

function renderRoomList(){
    roomList.innerHTML="";

    const keyword=roomSearch.value.trim().toLowerCase();
    const now=Date.now();

    Object.entries(roomsCache).forEach(([key,room])=>{
        if(room.expiresAt && room.expiresAt<now){
            remove(ref(db,`rooms/${key}`));
            return;
        }

        if(keyword && !room.roomName.toLowerCase().includes(keyword)){
            return;
        }

        const remainDays=getRemainDays(room.expiresAt);

        const card=document.createElement("div");
        card.className="room-card";

        card.innerHTML=`
            <div class="room-card-name">
                ${room.roomName}
            </div>
            <div class="room-card-days">
                残り ${remainDays} 日
            </div>
        `;

        card.onclick=()=>{
            selectedRoomKey=key;
            selectedRoomData=room;
            joinRoomName.innerText=room.roomName;
            joinRoomId.value="";
            joinRoomPass.value="";
            playerNameInput.value="";
            joinOverlay.style.display="flex";
        };

        roomList.appendChild(card);
    });
}

roomSearch.oninput=()=>{
    renderRoomList();
};

onValue(ref(db,"rooms"),(snapshot)=>{
    if(!snapshot.exists()){
        roomsCache={};
        roomList.innerHTML="";
        return;
    }

    roomsCache=snapshot.val();

    renderRoomList();
});

function verifyRoom(){
    if(!selectedRoomData){
        return false;
    }

    if(joinRoomId.value.trim().toUpperCase()!==selectedRoomData.roomId){
        alert("ROOM IDが違います");
        return false;
    }

    if(joinRoomPass.value.trim()!==selectedRoomData.password){
        alert("ROOM PASSが違います");
        return false;
    }

    return true;
}

function getRefereeCount(){
    const players=Object.values(selectedRoomData.players||{});

    return players.filter(
        player=>player.role==="referee"
    ).length;
}

function enterRoom(roleName){
    const playerName=encodeURIComponent(playerNameInput.value.trim());

    location.href=
        `./${roleName}.html?room=${selectedRoomKey}&role=${roleName}&name=${playerName}`;
}

btnReferee.onclick=()=>{
    if(!verifyRoom()){
        return;
    }

    const refereeName=playerNameInput.value.trim();

    if(!refereeName){
        alert("レフリーは名前を入力してください");
        return;
    }

    const refereeLimit=selectedRoomData.refereeLimit??1;
    const refereeCount=getRefereeCount();

    if(refereeCount>=refereeLimit){
        alert("レフリー人数が上限に達しています");
        return;
    }

    enterRoom("referee");
};

btnPlayer.onclick=()=>{
    if(!verifyRoom()){
        return;
    }

    enterRoom("player");
};

btnSpectator.onclick=()=>{
    if(!verifyRoom()){
        return;
    }

    enterRoom("spectator");
};