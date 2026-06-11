import { app } from "./firebase.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);

let announcementBanner=document.getElementById("master-announcement-banner");

if(!announcementBanner){
    announcementBanner=document.createElement("div");
    announcementBanner.id="master-announcement-banner";
    announcementBanner.className="announcement-hidden";
    document.body.prepend(announcementBanner);
}

function escapeAnnouncement(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;");
}

onValue(
    ref(db,"system/announcement"),
    snapshot=>{
        const announcement=snapshot.val();

        if(!announcement||!announcement.active){
            announcementBanner.className="announcement-hidden";
            announcementBanner.innerHTML="";
            return;
        }

        const type=announcement.type||"info";

        announcementBanner.className=`master-announcement-banner ${type}`;
        announcementBanner.innerHTML=`
            <div class="announcement-icon">${type==="alert"?"⚠":"📢"}</div>
            <div>
                <div class="announcement-client-title">
                    ${escapeAnnouncement(announcement.title||"MASTER ANNOUNCEMENT")}
                </div>
                <div class="announcement-client-message">
                    ${escapeAnnouncement(announcement.message||"")}
                </div>
            </div>
        `;
    }
);
