import { app } from "./firebase.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);

let emergencyOverlay=document.getElementById("emergency-mode-overlay");

if(!emergencyOverlay){
    emergencyOverlay=document.createElement("div");
    emergencyOverlay.id="emergency-mode-overlay";
    emergencyOverlay.className="emergency-hidden";
    document.body.prepend(emergencyOverlay);
}

function escapeEmergency(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;");
}

onValue(
    ref(db,"system/emergency"),
    snapshot=>{
        const emergency=snapshot.val();

        if(!emergency||!emergency.active){
            emergencyOverlay.className="emergency-hidden";
            emergencyOverlay.innerHTML="";
            document.body.classList.remove("client-emergency-active");
            return;
        }

        document.body.classList.add("client-emergency-active");
        emergencyOverlay.className="emergency-mode-overlay";
        emergencyOverlay.innerHTML=`
            <div class="emergency-mode-box">
                <div class="emergency-mode-logo"><img src="../assets/rescon-logo-emergency.svg" alt="RESCON"></div>
                <div class="emergency-mode-title">⚠ EMERGENCY MODE</div>
                <div class="emergency-mode-message">
                    ${escapeEmergency(emergency.message||"緊急停止中です。MASTERからの指示を待ってください。")}
                </div>
            </div>
        `;
    }
);
