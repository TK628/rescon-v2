import { app } from "./firebase.js";
import { MAX_LIFE } from "./constants.js";

import {
    getDatabase,
    ref,
    get,
    set,
    push
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);

const roomNameInput=document.getElementById("room-name-input");
const roomIdInput=document.getElementById("room-id-input");
const roomPassInput=document.getElementById("room-pass-input");
const keepDaysInput=document.getElementById("keep-days-input");
const refereeLimitInput=document.getElementById("referee-limit-input");

const btnCreateRoom=document.getElementById("btn-create-room");
const btnBack=document.getElementById("btn-back");

btnBack.onclick=()=>{
    location.href="./room.html";
};

function createDummyData(){
    return {
        maxHp:MAX_LIFE,
        manualDamage:0,

        found:false,

        rescued:false,
        rescuedHp:null,

        clothesColor:"red",

        faceColor:"black",

        soundFrequency:1,

        qrCode:"",

        injuries:{
            rightHand:false,
            leftHand:false,
            rightLeg:false,
            leftLeg:false,
            walking:true
        },

        playerReport:{
            faceColor:"",
            soundFrequency:null,
            qrCode:"",
            injuries:{
                rightHand:null,
                leftHand:null,
                rightLeg:null,
                leftLeg:null,
                walking:null
            }
        },

        reportCorrect:{
            faceColor:false,
            soundFrequency:false,
            qrCode:false,
            rightHand:false,
            leftHand:false,
            rightLeg:false,
            leftLeg:false,
            walking:false
        }
    };
}

btnCreateRoom.onclick=async()=>{

    const roomName=
        roomNameInput.value.trim();

    const roomId=
        roomIdInput.value
            .trim()
            .toUpperCase();

    const password=
        roomPassInput.value.trim();

    const keepDays=
        Number(
            keepDaysInput.value
        );

    const refereeLimit=
        Number(
            refereeLimitInput.value
        );

    if(!roomName){
        alert("ROOM NAMEを入力してください");
        return;
    }

    if(!roomId){
        alert("ROOM IDを入力してください");
        return;
    }

    if(!/^[A-Z0-9]+$/.test(roomId)){
        alert("ROOM IDは英数字のみです");
        return;
    }

    if(!/^\d{4}$/.test(password)){
        alert("ROOM PASSは4桁です");
        return;
    }

    const roomsSnapshot=
        await get(
            ref(db,"rooms")
        );

    if(roomsSnapshot.exists()){

        const rooms=
            roomsSnapshot.val();

        const duplicate=
            Object.values(rooms)
            .some(
                room=>
                    room.roomId===roomId
            );

        if(duplicate){
            alert("ROOM IDが重複しています");
            return;
        }
    }

    const now=Date.now();

    const roomKey=
        push(
            ref(db,"rooms")
        ).key;

    await set(
        ref(
            db,
            `rooms/${roomKey}`
        ),
        {
            roomKey,

            roomName,

            roomId,

            password,

            refereeLimit,

            createdAt:now,

            expiresAt:
                now+
                (
                    keepDays*
                    24*
                    60*
                    60*
                    1000
                ),

            keepDays,

            timer:{
                duration:300,
                remaining:300,
                endTime:null,
                countdown:false,
                countdownEndTime:null
            },

            settings:{
                matchTime:300,
                dummyCount:3
            },

            finished:false,

            matchState:"waiting",

            dummies:{
                dummy1:createDummyData(),
                dummy2:createDummyData(),
                dummy3:createDummyData()
            },

            tasks:{
                arrivalA:false,
                arrivalB:false,
                arrivalC:false,
                debris:false,
                gas:false
            },

            stoves:{
                roomA:"off",
                roomB:"off",
                roomC:"off"
            },

            playerStoveReport:{
                roomA:"",
                roomB:"",
                roomC:""
            },

            result:null,

            score:{
                timeScore:0,
                taskScore:0,
                stoveScore:0,
                reportScore:0,
                rescueScore:0,
                total:0
            },

            players:{}
        }
    );

    sessionStorage.setItem(
        "roomCreated",
        roomName
    );

    location.href="./room.html";
};