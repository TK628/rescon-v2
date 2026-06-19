import { app } from "./firebase.js";  import {     getDatabase,
    ref,
    get,
    set,
    update,
    onValue,
    push,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);

const MASTER_THEME_STORAGE_KEY="resconMasterTheme";

const MASTER_PASS_HASH="925ca3445ec9793303d8f86ad4092011fb83c3ede3a284e92fa057ede35c77c6";

const btnBackHome=document.getElementById("btn-back-home");
const masterStatus=document.getElementById("master-status");
const loginCard=document.getElementById("master-login-card");
const masterConsole=document.getElementById("master-console");
const masterPassInput=document.getElementById("master-pass-input");
const btnMasterLogin=document.getElementById("btn-master-login");
const loginMessage=document.getElementById("login-message");

const masterTabs=document.querySelectorAll(".master-tab");
const masterPanels=document.querySelectorAll(".master-panel");

const maintenanceToggle=document.getElementById("maintenance-toggle");
const communityDisabledToggle=document.getElementById("community-disabled-toggle");
const maintenanceBadge=document.getElementById("maintenance-badge");
const btnSaveSystem=document.getElementById("btn-save-system");

const noticeInput=document.getElementById("notice-input");
const noticeTitleInput=document.getElementById("notice-title-input");
const noticeStatusInput=document.getElementById("notice-status-input");
const noticePinnedInput=document.getElementById("notice-pinned-input");
const noticePublishAtInput=document.getElementById("notice-publish-at-input");
const noticeDeleteAtInput=document.getElementById("notice-delete-at-input");
const noticeBodyInput=document.getElementById("notice-body-input");
const btnAddNotice=document.getElementById("btn-add-notice");
const btnClearNoticeForm=document.getElementById("btn-clear-notice-form");
const noticeCenterList=document.getElementById("notice-center-list");
const noticeCenterCount=document.getElementById("notice-center-count");
const noticeFilterButtons=document.querySelectorAll(".notice-filter");
const updateInput=document.getElementById("update-input");
const manualInput=document.getElementById("manual-input");
const manualMatchInput=document.getElementById("manual-match-input");
const manualSystemInput=document.getElementById("manual-system-input");

const btnSaveNotice=document.getElementById("btn-save-notice");
const btnSaveUpdate=document.getElementById("btn-save-update");
const btnSaveManual=document.getElementById("btn-save-manual");
const btnSaveManualMatch=document.getElementById("btn-save-manual-match");
const btnSaveManualSystem=document.getElementById("btn-save-manual-system");
const versionInput=document.getElementById("version-input");
const versionTitleInput=document.getElementById("version-title-input");
const versionTagInput=document.getElementById("version-tag-input");
const versionBodyInput=document.getElementById("version-body-input");
const btnAddVersion=document.getElementById("btn-add-version");
const versionCenterList=document.getElementById("version-center-list");
const versionCenterCount=document.getElementById("version-center-count");
const manualMatchTitleInput=document.getElementById("manual-match-title-input");
const manualMatchBodyInput=document.getElementById("manual-match-body-input");
const manualSystemTitleInput=document.getElementById("manual-system-title-input");
const manualSystemBodyInput=document.getElementById("manual-system-body-input");
const btnAddManualMatch=document.getElementById("btn-add-manual-match");
const btnClearManualMatch=document.getElementById("btn-clear-manual-match");
const btnAddManualSystem=document.getElementById("btn-add-manual-system");
const btnClearManualSystem=document.getElementById("btn-clear-manual-system");
const manualMatchList=document.getElementById("manual-match-list");
const manualSystemList=document.getElementById("manual-system-list");
const manualCenterCount=document.getElementById("manual-center-count");
const manualUpdateToggle=document.getElementById("manual-update-toggle");
const manualUpdateScheduleInput=document.getElementById("manual-update-schedule-input");
const manualUpdateMessageInput=document.getElementById("manual-update-message-input");
const btnSaveManualUpdateMode=document.getElementById("btn-save-manual-update-mode");

const roomSummary=document.getElementById("room-summary");
const masterRoomList=document.getElementById("master-room-list");
const btnRefreshRooms=document.getElementById("btn-refresh-rooms");

const masterLogList=document.getElementById("master-log-list");

const masterCommentList=document.getElementById("master-comment-list");
const commentSummary=document.getElementById("comment-summary");

const communityManageSummary=document.getElementById("community-manage-summary");
const communityPostCount=document.getElementById("community-post-count");
const ngRequestCount=document.getElementById("ng-request-count");
const masterCommunityPostList=document.getElementById("master-community-post-list");
const masterNgRequestList=document.getElementById("master-ng-request-list");

const dashActiveRooms=document.getElementById("dash-active-rooms");
const dashRunningMatches=document.getElementById("dash-running-matches");
const dashOnlineUsers=document.getElementById("dash-online-users");
const dashCommunityPosts=document.getElementById("dash-community-posts");
const dashNgWords=document.getElementById("dash-ng-words");
const dashComments=document.getElementById("dash-comments");
const dashboardUpdated=document.getElementById("dashboard-updated");
const dashboardActivityList=document.getElementById("dashboard-activity-list");
const dashboardRoomList=document.getElementById("dashboard-room-list");
const commandCenterMap=document.getElementById("command-center-map");
const commandMapSummary=document.getElementById("command-map-summary");
const utilizationPercent=document.getElementById("utilization-percent");
const utilizationDetail=document.getElementById("utilization-detail");
const utilizationBarFill=document.getElementById("utilization-bar-fill");
const utilizationBreakdown=document.getElementById("utilization-breakdown");
const masterBootOverlay=document.getElementById("master-boot-overlay");
const masterBootLines=document.getElementById("master-boot-lines");

const notificationSummary=document.getElementById("notification-summary");
const notificationList=document.getElementById("notification-list");
const btnMarkAllNotifications=document.getElementById("btn-mark-all-notifications");
const btnClearReadNotifications=document.getElementById("btn-clear-read-notifications");

const announcementType=document.getElementById("announcement-type");
const announcementTitleInput=document.getElementById("announcement-title-input");
const announcementMessageInput=document.getElementById("announcement-message-input");
const btnSendAnnouncement=document.getElementById("btn-send-announcement");
const btnClearAnnouncement=document.getElementById("btn-clear-announcement");
const announcementStatusBadge=document.getElementById("announcement-status-badge");
const announcementPreview=document.getElementById("announcement-preview");

const healthOverallBadge=document.getElementById("health-overall-badge");
const healthFirebase=document.getElementById("health-firebase");
const healthLatency=document.getElementById("health-latency");
const healthUsers=document.getElementById("health-users");
const healthRooms=document.getElementById("health-rooms");
const healthErrors=document.getElementById("health-errors");
const healthStatus=document.getElementById("health-status");

const emergencyBadge=document.getElementById("emergency-badge");
const emergencyToggle=document.getElementById("emergency-toggle");
const emergencyMessageInput=document.getElementById("emergency-message-input");
const btnSaveEmergency=document.getElementById("btn-save-emergency");
const btnClearEmergency=document.getElementById("btn-clear-emergency");
const emergencyPreview=document.getElementById("emergency-preview");

const themeCurrentBadge=document.getElementById("theme-current-badge");
const themeCards=document.querySelectorAll(".theme-card");
const dashboardLiveFeedList=document.getElementById("dashboard-live-feed-list");

const roomDetailModal=document.getElementById("room-detail-modal");
const roomMonitorModal=document.getElementById("room-monitor-modal");
const roomDetailContent=document.getElementById("room-detail-content");
const roomMonitorContent=document.getElementById("room-monitor-content");
const btnCloseRoomDetail=document.getElementById("btn-close-room-detail");
const btnCloseRoomMonitor=document.getElementById("btn-close-room-monitor");
const communityAuthorFilter=document.getElementById("community-author-filter");
const btnClearCommunityFilter=document.getElementById("btn-clear-community-filter");
const adminCommunityTotal=document.getElementById("admin-community-total");
const adminCommunityToday=document.getElementById("admin-community-today");
const adminCommunityAuthors=document.getElementById("admin-community-authors");
const adminNgWordCount=document.getElementById("admin-ng-word-count");

const systemRef=ref(db,"system");
const noticesRef=ref(db,"notices");
const updatesRef=ref(db,"updates");
const roomsRef=ref(db,"rooms");
const logsRef=ref(db,"logs");
const commentsRef=ref(db,"comments");
const communityRef=ref(db,"community");
const ngWordRequestsRef=ref(db,"ngWordRequests");
const ngWordsRef=ref(db,"ngWords");
const notificationsRef=ref(db,"notifications");
const announcementRef=ref(db,"system/announcement");
const emergencyRef=ref(db,"system/emergency");
const masterThemeRef=ref(db,"system/masterTheme");
const healthPingRef=ref(db,"health/masterPing");
const connectedRef=ref(db,".info/connected");

let authenticated=false;
let latestSystem=null;
let latestNotices={};
let latestVersions={};
let editingVersionKey=null;
let editingManualMatchKey=null;
let editingManualSystemKey=null;
let currentNoticeFilter="all";
let latestRooms={};
let latestCommunityPosts={};
let latestNgWords={};
let monitoringRoomKey=null;
let latestComments={};
let latestCommunity={};
let latestNotifications={};
let latestLogs={};
let latestAnnouncement=null;
let latestEmergency=null;
let latestMasterTheme=
    localStorage.getItem(MASTER_THEME_STORAGE_KEY)
    ||
    "royal-purple";
let latestConnected=false;
let latestLatency=null;

document.body.classList.add(
    `theme-${latestMasterTheme}`
);


if(btnAddNotice){
    btnAddNotice.onclick=()=>addNotice();
}
if(btnClearNoticeForm){
    btnClearNoticeForm.onclick=()=>clearNoticeForm();
}
noticeFilterButtons.forEach(button=>{
    button.onclick=()=>{
        currentNoticeFilter=button.dataset.noticeFilter||"all";
        noticeFilterButtons.forEach(item=>item.classList.toggle("active",item===button));
        renderNoticeCenter(latestNotices);
    };
});
if(noticeCenterList){
    noticeCenterList.onclick=async(event)=>{
        const button=event.target.closest(".notice-action");
        if(!button) return;
        const key=button.dataset.key;
        const action=button.dataset.action;
        const item=latestNotices[key];
        if(!key||!item) return;
        if(action==="pin") await toggleNoticePinned(key,item);
        if(action==="publish") await changeNoticeStatus(key,"published");
        if(action==="draft") await changeNoticeStatus(key,"draft");
        if(action==="delete") await deleteNotice(key,item);
    };
}

if(btnAddVersion){
    btnAddVersion.onclick=()=>saveVersionItem();
}

if(versionCenterList){
    versionCenterList.onclick=async(event)=>{
        const button=event.target.closest(".version-admin-action");

        if(!button){
            return;
        }

        const key=button.dataset.versionKey;
        const action=button.dataset.versionAction;

        if(action==="edit"){
            editVersionItem(key);
        }

        if(action==="delete"){
            await deleteVersionItem(key);
        }
    };
}


if(btnAddManualMatch){
    btnAddManualMatch.onclick=()=>saveManualItem("match");
}

if(btnClearManualMatch){
    btnClearManualMatch.onclick=()=>clearManualEditor("match");
}

if(btnAddManualSystem){
    btnAddManualSystem.onclick=()=>saveManualItem("system");
}

if(btnClearManualSystem){
    btnClearManualSystem.onclick=()=>clearManualEditor("system");
}

[manualMatchList,manualSystemList].forEach(list=>{
    if(!list){
        return;
    }

    list.onclick=async(event)=>{
        const button=event.target.closest(".manual-admin-action");

        if(!button){
            return;
        }

        const type=button.dataset.manualType;
        const key=button.dataset.manualKey;
        const action=button.dataset.manualAction;

        if(action==="edit"){
            editManualItem(type,key);
        }

        if(action==="delete"){
            await deleteManualItem(type,key);
        }
    };
});

btnBackHome.onclick=()=>{
    location.href="./home.html";
};

masterTabs.forEach(tab=>{
    tab.onclick=()=>{
        const target=tab.dataset.tab;

        masterTabs.forEach(item=>{
            item.classList.toggle(
                "active",
                item.dataset.tab===target
            );
        });

        masterPanels.forEach(panel=>{
            panel.classList.toggle(
                "active",
                panel.dataset.panel===target
            );
        });
    };
});

function activateMasterSubtab(target){
    const button=document.querySelector(`.master-subtab[data-subtab-target="${target}"]`);
    if(!button){
        return;
    }

    const group=button.closest(".master-subtabs");
    if(!group){
        return;
    }

    const container=group.nextElementSibling;
    if(!container){
        return;
    }

    group.querySelectorAll(".master-subtab").forEach(item=>{
        item.classList.toggle("active",item===button);
    });

    container.querySelectorAll(":scope > .master-sub-panel").forEach(item=>{
        item.classList.toggle(
            "active-subpanel",
            item.dataset.subpanel===target
        );
    });

    if(target==="rooms-command"&&typeof renderCommandCenterMap==="function"){
        renderCommandCenterMap();
    }

    if(target==="logs-live"&&typeof renderLogLiveFeed==="function"){
        renderLogLiveFeed();
    }
}

function bindMasterSubtabs(){
    document.querySelectorAll(".master-subtab").forEach(button=>{
        button.onclick=()=>{
            activateMasterSubtab(button.dataset.subtabTarget);
        };
    });
}

bindMasterSubtabs();


async function sha256Text(text){
    const encoder=new TextEncoder();
    const data=encoder.encode(text);
    const hashBuffer=await crypto.subtle.digest("SHA-256",data);
    const hashArray=Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte=>byte.toString(16).padStart(2,"0"))
        .join("");
}

async function writeLog(message){
    await set(
        push(logsRef),
        {
            message,
            createdAt:Date.now()
        }
    );
}

function setOnlineStatus(){
    masterStatus.innerText=
        authenticated
        ?
        "AUTHORIZED"
        :
        "LOCKED";
}

function updateMaintenanceBadge(){
    const maintenance=
        latestSystem?.maintenance
        ??false;

    maintenanceBadge.innerText=
        maintenance
        ?
        "MAINTENANCE"
        :
        "NORMAL";

    maintenanceBadge.classList.toggle(
        "maintenance",
        maintenance
    );
}

async function ensureSystemData(){
    const snapshot=await get(systemRef);

    if(snapshot.exists()){
        return;
    }

    await set(
        systemRef,
        {
            maintenance:false,
            communityDisabled:false,
            notice:"現在メンテナンス予定はありません。",
            update:"RESCON SYSTEM update log.",
            manual:"ROOM SELECTから開始してください。",
            updatedAt:Date.now()
        }
    );
}


function getManualItems(type){
    const items=latestSystem?.manuals?.[type]||{};

    return Object.entries(items)
        .sort((a,b)=>(a[1].order??a[1].createdAt??0)-(b[1].order??b[1].createdAt??0));
}

function clearManualEditor(type){
    if(type==="match"){
        editingManualMatchKey=null;
        if(manualMatchTitleInput) manualMatchTitleInput.value="";
        if(manualMatchBodyInput) manualMatchBodyInput.value="";
    }

    if(type==="system"){
        editingManualSystemKey=null;
        if(manualSystemTitleInput) manualSystemTitleInput.value="";
        if(manualSystemBodyInput) manualSystemBodyInput.value="";
    }
}

async function saveManualItem(type){
    const isMatch=type==="match";
    const titleInput=isMatch?manualMatchTitleInput:manualSystemTitleInput;
    const bodyInput=isMatch?manualMatchBodyInput:manualSystemBodyInput;
    const editingKey=isMatch?editingManualMatchKey:editingManualSystemKey;

    const title=(titleInput?.value||"").trim();
    const body=(bodyInput?.value||"").trim();

    if(!title||!body){
        alert("タイトルと本文を入力してください");
        return;
    }

    const key=editingKey||String(Date.now());

    await update(
        ref(db,`system/manuals/${type}/${key}`),
        {
            title,
            body,
            order:editingKey
                ? (latestSystem?.manuals?.[type]?.[key]?.order??Date.now())
                : Date.now(),
            createdAt:editingKey
                ? (latestSystem?.manuals?.[type]?.[key]?.createdAt??Date.now())
                : Date.now(),
            updatedAt:Date.now()
        }
    );

    await update(systemRef,{updatedAt:Date.now()});
    await writeLog(`MANUAL ${type.toUpperCase()} SAVE : ${title}`);
    clearManualEditor(type);
}

function editManualItem(type,key){
    const item=latestSystem?.manuals?.[type]?.[key];

    if(!item){
        return;
    }

    if(type==="match"){
        editingManualMatchKey=key;
        if(manualMatchTitleInput) manualMatchTitleInput.value=item.title||"";
        if(manualMatchBodyInput) manualMatchBodyInput.value=item.body||"";
    }

    if(type==="system"){
        editingManualSystemKey=key;
        if(manualSystemTitleInput) manualSystemTitleInput.value=item.title||"";
        if(manualSystemBodyInput) manualSystemBodyInput.value=item.body||"";
    }
}

async function deleteManualItem(type,key){
    const item=latestSystem?.manuals?.[type]?.[key];

    if(!item){
        return;
    }

    if(!confirm(`${item.title||"MANUAL"} を削除しますか？`)){
        return;
    }

    await remove(ref(db,`system/manuals/${type}/${key}`));
    await update(systemRef,{updatedAt:Date.now()});
    await writeLog(`MANUAL ${type.toUpperCase()} DELETE : ${item.title||key}`);
}

function renderManualList(type,target){
    const items=getManualItems(type);

    if(!target){
        return;
    }

    if(items.length===0){
        target.innerHTML=`<div class="manual-admin-empty">項目なし</div>`;
        return;
    }

    target.innerHTML=items.map(([key,item],index)=>`
        <article class="manual-admin-item">
            <div class="manual-admin-top">
                <div>
                    <span class="manual-admin-number">${index+1}</span>
                    <strong>${escapeMasterHtml(item.title||"NO TITLE")}</strong>
                </div>
                <div class="manual-admin-date">${item.updatedAt?new Date(item.updatedAt).toLocaleString("ja-JP"):"--"}</div>
            </div>
            <div class="manual-admin-body">${escapeMasterHtml(item.body||"")}</div>
            <div class="manual-admin-actions">
                <button class="neon-button manual-admin-action" data-manual-type="${type}" data-manual-action="edit" data-manual-key="${key}">EDIT</button>
                <button class="neon-button danger-action manual-admin-action" data-manual-type="${type}" data-manual-action="delete" data-manual-key="${key}">DELETE</button>
            </div>
        </article>
    `).join("");
}

function renderManualManager(){
    renderManualList("match",manualMatchList);
    renderManualList("system",manualSystemList);

    if(manualCenterCount){
        const count=getManualItems("match").length+getManualItems("system").length;
        manualCenterCount.innerText=`${count} ITEMS`;
    }
}

function renderSystem(system){
    latestSystem=system||{};

    maintenanceToggle.checked=
        latestSystem.maintenance
        ??false;

    communityDisabledToggle.checked=
        latestSystem.communityDisabled
        ??false;

    if(noticeInput){
        noticeInput.value=
            latestSystem.notice
            ??"";
    }
if(typeof updateInput!=="undefined"&&updateInput){
        updateInput.value=
            latestSystem.update
            ??"";
    }
if(manualInput){
        manualInput.value=
            latestSystem.manual
            ??"";
    }

    if(manualMatchInput){
        manualMatchInput.value=
            latestSystem.manualMatch
            ??latestSystem.manual
            ??"";
    }

    if(manualSystemInput){
        manualSystemInput.value=
            latestSystem.manualSystem
            ??"";
    }


    if(manualUpdateToggle){
        manualUpdateToggle.checked=
            latestSystem.manualUpdating
            ??
            latestSystem.manualUpdate?.active
            ??
            latestSystem.manualMaintenance
            ??
            false;
    }

    if(manualUpdateScheduleInput){
        manualUpdateScheduleInput.value=
            latestSystem.manualUpdate?.schedule
            ??
            "";
    }

    if(manualUpdateMessageInput){
        manualUpdateMessageInput.value=
            latestSystem.manualUpdate?.message
            ??
            "";
    }

    document.body.classList.toggle(
        "manual-update-master-active",
        !!(
            latestSystem.manualUpdating||
            latestSystem.manualUpdate?.active||
            latestSystem.manualMaintenance
        )
    );

    updateMaintenanceBadge();
    renderManualManager();
}

function getVersionEntries(){
    return Object.entries(latestVersions||{})
        .sort((a,b)=>(b[1].createdAt??0)-(a[1].createdAt??0));
}

function clearVersionForm(){
    editingVersionKey=null;

    if(versionInput){
        versionInput.value="";
    }

    if(versionTitleInput){
        versionTitleInput.value="";
    }

    if(versionTagInput){
        versionTagInput.value="FEATURE";
    }

    if(versionBodyInput){
        versionBodyInput.value="";
    }

    if(btnAddVersion){
        btnAddVersion.innerText="ADD VERSION";
    }
}

async function saveVersionItem(){
    const version=(versionInput?.value||"").trim();
    const title=(versionTitleInput?.value||"").trim();
    const tag=(versionTagInput?.value||"FEATURE").trim();
    const body=(versionBodyInput?.value||"").trim();

    if(!version||!title||!body){
        alert("バージョン・タイトル・更新内容を入力してください");
        return;
    }

    const key=editingVersionKey||String(Date.now());
    const oldItem=latestVersions?.[key]||{};

    await update(
        ref(db,`updates/${key}`),
        {
            version,
            title,
            tag,
            body,
            createdAt:oldItem.createdAt??Date.now(),
            updatedAt:Date.now()
        }
    );

    await writeLog(`VERSION SAVE : ${version}`);
    await createOwnerNotification("version","VERSION UPDATED",`${version} / ${title}`);
    clearVersionForm();
}

function editVersionItem(key){
    const item=latestVersions?.[key];

    if(!item){
        return;
    }

    editingVersionKey=key;

    if(versionInput){
        versionInput.value=item.version||"";
    }

    if(versionTitleInput){
        versionTitleInput.value=item.title||"";
    }

    if(versionTagInput){
        versionTagInput.value=item.tag||"FEATURE";
    }

    if(versionBodyInput){
        versionBodyInput.value=item.body||item.message||"";
    }

    if(btnAddVersion){
        btnAddVersion.innerText="UPDATE VERSION";
    }
}

async function deleteVersionItem(key){
    const item=latestVersions?.[key];

    if(!item){
        return;
    }

    if(!confirm(`${item.version||"VERSION"} を削除しますか？`)){
        return;
    }

    await remove(ref(db,`updates/${key}`));
    await writeLog(`VERSION DELETE : ${item.version||key}`);
    await createOwnerNotification("version","VERSION DELETED",item.version||key);

    if(editingVersionKey===key){
        clearVersionForm();
    }
}

function renderVersionCenter(updates){
    latestVersions=updates||{};

    const entries=getVersionEntries();

    if(versionCenterCount){
        versionCenterCount.innerText=`${entries.length} VERSIONS`;
    }

    if(!versionCenterList){
        return;
    }

    if(entries.length===0){
        versionCenterList.innerHTML=`<div class="version-admin-empty">VERSIONなし</div>`;
        return;
    }

    versionCenterList.innerHTML=entries.map(([key,item])=>`
        <article class="version-admin-item">
            <div class="version-admin-top">
                <div>
                    <span class="version-admin-number">${escapeMasterHtml(item.version||"v---")}</span>
                    <span class="version-admin-tag">${escapeMasterHtml(item.tag||"FEATURE")}</span>
                    <strong>${escapeMasterHtml(item.title||"RESCON UPDATE")}</strong>
                </div>
                <div class="version-admin-date">${item.createdAt?new Date(item.createdAt).toLocaleString("ja-JP"):"--"}</div>
            </div>
            <div class="version-admin-body">${escapeMasterHtml(item.body||item.message||"")}</div>
            <div class="version-admin-actions">
                <button class="neon-button version-admin-action" data-version-action="edit" data-version-key="${key}">EDIT</button>
                <button class="neon-button danger-action version-admin-action" data-version-action="delete" data-version-key="${key}">DELETE</button>
            </div>
        </article>
    `).join("");
}

function remainDays(expiresAt){
    if(!expiresAt){
        return "-";
    }

    return Math.max(
        0,
        Math.ceil(
            (expiresAt-Date.now())/86400000
        )
    );
}

async function deleteRoom(roomKey,roomName){
    const confirmed=
        confirm(`${roomName||roomKey} を削除しますか？\nこの操作は元に戻せません。`);

    if(!confirmed){
        return;
    }

    await remove(ref(db,`rooms/${roomKey}`));
    await writeLog(`ROOM DELETE : ${roomName||roomKey}`);
}

async function extendRoom(roomKey,roomName,days){
    const snapshot=await get(ref(db,`rooms/${roomKey}`));
    const room=snapshot.val();

    if(!room){
        alert("ROOMが見つかりません");
        return;
    }

    const baseTime=Math.max(room.expiresAt||0,Date.now());

    await update(
        ref(db,`rooms/${roomKey}`),
        {
            expiresAt:baseTime+(days*24*60*60*1000)
        }
    );

    await writeLog(`ROOM EXTEND +${days} DAYS : ${roomName||roomKey}`);
}

async function forceCloseRoom(roomKey,roomName){
    const confirmed=
        confirm(`${roomName||roomKey} を強制終了状態にしますか？`);

    if(!confirmed){
        return;
    }

    await update(
        ref(db,`rooms/${roomKey}`),
        {
            finished:true,
            matchState:"finished",
            adminClosed:true,
            closedAt:Date.now(),
            "timer/endTime":null,
            "timer/countdown":false,
            "timer/countdownEndTime":null
        }
    );

    await writeLog(`ROOM FORCE CLOSE : ${roomName||roomKey}`);
    await createOwnerNotification("room","ROOM FORCE CLOSED",`${roomName||roomKey}`);
}


function formatSecondsForMaster(seconds){
    const safeSeconds=
        Math.max(
            0,
            Math.floor(seconds||0)
        );

    const mm=
        String(
            Math.floor(safeSeconds/60)
        ).padStart(2,"0");

    const ss=
        String(
            safeSeconds%60
        ).padStart(2,"0");

    return `${mm}:${ss}`;
}

function getRoomTimerRemain(room){
    const timer=
        room.timer||{};

    if(timer.endTime){
        return Math.max(
            0,
            Math.ceil(
                (timer.endTime-Date.now())/1000
            )
        );
    }

    if(typeof timer.pausedLeftSeconds==="number"){
        return timer.pausedLeftSeconds;
    }

    if(typeof room.pausedLeftSeconds==="number"){
        return room.pausedLeftSeconds;
    }

    return 0;
}

function getDummyEntries(room){
    const dummies=
        room.dummies||{};

    return ["dummy1","dummy2","dummy3"]
        .map(dummyId=>[
            dummyId,
            dummies[dummyId]
        ])
        .filter(([dummyId,dummy])=>dummy);
}

function getRoomPlayersByRole(room,role){
    return Object.values(room.players||{})
        .filter(player=>player.role===role);
}

function escapeMasterHtml(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;");
}

function openRoomDetail(roomKey){
    const room=
        latestRooms?.[roomKey];

    if(!room){
        alert("ROOMが見つかりません");
        return;
    }

    renderRoomDetail(
        roomKey,
        room
    );

    roomDetailModal.classList.remove("hidden");
}

function closeRoomDetail(){
    roomDetailModal.classList.add("hidden");
}

function openRoomMonitor(roomKey){
    const room=
        latestRooms?.[roomKey];

    if(!room){
        alert("ROOMが見つかりません");
        return;
    }

    monitoringRoomKey=roomKey;

    renderRoomMonitor(
        roomKey,
        room
    );

    roomMonitorModal.classList.remove("hidden");
}

function closeRoomMonitor(){
    monitoringRoomKey=null;
    roomMonitorModal.classList.add("hidden");
}

function renderPlayerList(title,players){
    if(players.length===0){
        return `
            <div class="detail-role-block">
                <div class="detail-role-title">${title}</div>
                <div class="detail-empty">なし</div>
            </div>
        `;
    }

    return `
        <div class="detail-role-block">
            <div class="detail-role-title">${title}</div>
            ${players.map(player=>`
                <div class="detail-player">
                    ${escapeMasterHtml(player.name||player.playerName||"NO NAME")}
                </div>
            `).join("")}
        </div>
    `;
}

function renderRoomDetail(roomKey,room){
    const state=
        room.finished
        ?
        "FINISHED"
        :
        (
            room.matchState||
            "waiting"
        );

    const remain=
        getRoomTimerRemain(room);

    const dummies=
        getDummyEntries(room);

    const referees=
        getRoomPlayersByRole(room,"referee");

    const players=
        getRoomPlayersByRole(room,"player");

    const spectators=
        getRoomPlayersByRole(room,"spectator");

    roomDetailContent.innerHTML=`
        <div class="room-detail-grid">
            <div class="detail-card">
                <span>ROOM NAME</span>
                <strong>${escapeMasterHtml(room.roomName||"NO NAME")}</strong>
            </div>

            <div class="detail-card">
                <span>ROOM ID</span>
                <strong>${escapeMasterHtml(room.roomId||roomKey)}</strong>
            </div>

            <div class="detail-card">
                <span>STATE</span>
                <strong>${escapeMasterHtml(state)}</strong>
            </div>

            <div class="detail-card">
                <span>TIME LEFT</span>
                <strong>${formatSecondsForMaster(remain)}</strong>
            </div>
        </div>

        <div class="detail-section">
            <div class="detail-section-title">DUMMY STATUS</div>

            <div class="detail-dummy-list">
                ${dummies.map(([dummyId,dummy])=>{
                    const hp=dummy.life??dummy.hp??0;
                    const max=dummy.maxHp??250;
                    const percent=max>0 ? Math.max(0,Math.min(100,(hp/max)*100)) : 0;

                    return `
                        <div class="detail-dummy-item">
                            <div class="detail-dummy-top">
                                <span>${dummyId.toUpperCase()}</span>
                                <strong>${hp}/${max}</strong>
                            </div>
                            <div class="detail-dummy-bar">
                                <div style="width:${percent}%"></div>
                            </div>
                            <div class="detail-dummy-meta">
                                FOUND ${dummy.found?"YES":"NO"} / RESCUED ${dummy.rescued?"YES":"NO"}
                            </div>
                        </div>
                    `;
                }).join("") || `<div class="detail-empty">DUMMYなし</div>`}
            </div>
        </div>

        <div class="detail-section">
            <div class="detail-section-title">PARTICIPANTS</div>

            <div class="detail-participants">
                ${renderPlayerList("REFEREE",referees)}
                ${renderPlayerList("PLAYER",players)}
                ${renderPlayerList("SPECTATOR",spectators)}
            </div>
        </div>
    `;
}

function renderRoomMonitor(roomKey,room){
    const state=
        room.finished
        ?
        "FINISHED"
        :
        (
            room.matchState||
            "waiting"
        );

    const remain=
        getRoomTimerRemain(room);

    const dummies=
        getDummyEntries(room);

    const players=
        Object.values(room.players||{});

    roomMonitorContent.innerHTML=`
        <div class="monitor-hero">
            <div>
                <div class="monitor-kicker">OBSERVING</div>
                <div class="monitor-room-name">${escapeMasterHtml(room.roomName||"NO NAME")}</div>
            </div>

            <div class="monitor-state ${state}">
                ${escapeMasterHtml(state)}
            </div>
        </div>

        <div class="monitor-time">
            ${formatSecondsForMaster(remain)}
        </div>

        <div class="monitor-grid">
            <div class="monitor-card">
                <span>ROOM ID</span>
                <strong>${escapeMasterHtml(room.roomId||roomKey)}</strong>
            </div>

            <div class="monitor-card">
                <span>PARTICIPANTS</span>
                <strong>${players.length}</strong>
            </div>

            <div class="monitor-card">
                <span>DUMMIES</span>
                <strong>${dummies.length}</strong>
            </div>
        </div>

        <div class="monitor-dummy-area">
            ${dummies.map(([dummyId,dummy])=>{
                const hp=dummy.life??dummy.hp??0;
                const max=dummy.maxHp??250;
                const percent=max>0 ? Math.max(0,Math.min(100,(hp/max)*100)) : 0;

                return `
                    <div class="monitor-dummy-card">
                        <div class="monitor-dummy-head">
                            <span>${dummyId.toUpperCase()}</span>
                            <strong>${hp}</strong>
                        </div>

                        <div class="monitor-dummy-bar">
                            <div style="width:${percent}%"></div>
                        </div>

                        <div class="monitor-dummy-flags">
                            <span class="${dummy.found?"ok":"no"}">FOUND</span>
                            <span class="${dummy.rescued?"ok":"no"}">RESCUED</span>
                        </div>
                    </div>
                `;
            }).join("") || `<div class="detail-empty">DUMMYなし</div>`}
        </div>

        <div class="monitor-note">
            MONITOR MODE / VIEW ONLY
        </div>
    `;
}

function renderRooms(rooms){
    latestRooms=rooms||{};

    const entries=Object.entries(latestRooms)
        .sort((a,b)=>(b[1].createdAt??0)-(a[1].createdAt??0));

    const activeCount=entries.filter(([key,room])=>!room.finished).length;
    const finishedCount=entries.length-activeCount;

    roomSummary.innerHTML=
        `<span>ALL : ${entries.length}</span>
        <span>ACTIVE : ${activeCount}</span>
        <span>FINISHED : ${finishedCount}</span>`;

    if(entries.length===0){
        masterRoomList.innerHTML=`<div class="master-room-item">ROOMなし</div>`;
        return;
    }

    masterRoomList.innerHTML=entries.map(([key,room])=>{
        const players=Object.values(room.players||{});
        const refereeCount=players.filter(player=>player.role==="referee").length;
        const playerCount=players.filter(player=>player.role==="player").length;
        const spectatorCount=players.filter(player=>player.role==="spectator").length;

        const state=room.finished?"FINISHED":(room.matchState||"waiting");

        return `
            <div class="master-room-item" data-room-key="${key}">
                <div class="master-room-top">
                    <div>
                        <div class="master-room-name">${room.roomName||"NO NAME"}</div>
                        <div class="master-room-meta">KEY : ${key}</div>
                    </div>
                    <div class="master-room-id">${room.roomId||key}</div>
                </div>

                <div class="master-room-status-row">
                    <span class="room-state">${state}</span>
                    <span>REF ${refereeCount}</span>
                    <span>PLAYER ${playerCount}</span>
                    <span>SPECTATOR ${spectatorCount}</span>
                    <span>残り ${remainDays(room.expiresAt)} 日</span>
                </div>

                <div class="master-room-actions">
                    <button class="neon-button master-room-action" data-action="detail" data-room-key="${key}">DETAIL</button>
                    <button class="neon-button master-room-action" data-action="monitor" data-room-key="${key}">MONITOR</button>
                    <button class="neon-button master-room-action" data-action="extend" data-room-key="${key}">+7 DAYS</button>
                    <button class="neon-button master-room-action" data-action="close" data-room-key="${key}">FORCE CLOSE</button>
                    <button class="neon-button master-room-action danger-action" data-action="delete" data-room-key="${key}">DELETE</button>
                </div>
            </div>
        `;
    }).join("");
}

function renderLogs(logs){
    latestLogs=logs||{};
    const entries=Object.values(logs||{})
        .sort((a,b)=>(b.createdAt??0)-(a.createdAt??0))
        .slice(0,50);

    if(entries.length===0){
        masterLogList.innerHTML=`<div class="master-log-item">LOGなし</div>`;
        return;
    }

    masterLogList.innerHTML=entries.map(log=>`
        <div class="master-log-item">
            <div>${log.message||""}</div>
            <div class="master-log-meta">
                ${log.createdAt ? new Date(log.createdAt).toLocaleString("ja-JP") : ""}
            </div>
        </div>
    `).join("");
}

function renderComments(comments){
    latestComments=comments||{};
    const entries=Object.entries(comments||{})
        .sort((a,b)=>(b[1].createdAt??0)-(a[1].createdAt??0));

    const newCount=entries.filter(([key,comment])=>comment.status==="new").length;
    const checkedCount=entries.filter(([key,comment])=>comment.status==="checked").length;
    const doneCount=entries.filter(([key,comment])=>comment.status==="done").length;

    commentSummary.innerHTML=
        `<span>ALL : ${entries.length}</span>
        <span>NEW : ${newCount}</span>
        <span>CHECKED : ${checkedCount}</span>
        <span>DONE : ${doneCount}</span>`;

    if(entries.length===0){
        masterCommentList.innerHTML=`<div class="master-comment-item">コメントなし</div>`;
        return;
    }

    masterCommentList.innerHTML=entries.map(([key,comment])=>`
        <div class="master-comment-item status-${comment.status||"new"}">
            <div class="master-comment-top">
                <div>
                    <span class="comment-type">${comment.type||"other"}</span>
                    <span class="comment-status">${(comment.status||"new").toUpperCase()}</span>
                </div>
                <div class="comment-date">${comment.createdAt ? new Date(comment.createdAt).toLocaleString("ja-JP") : ""}</div>
            </div>

            <div class="comment-name">FROM : ${comment.name||"匿名"}</div>
            <div class="comment-message">${String(comment.message||"").replaceAll("<","&lt;").replaceAll(">","&gt;")}</div>

            <div class="master-comment-actions">
                <button class="neon-button comment-action" data-action="checked" data-comment-key="${key}">CHECKED</button>
                <button class="neon-button comment-action" data-action="done" data-comment-key="${key}">DONE</button>
                <button class="neon-button comment-action danger-action" data-action="delete" data-comment-key="${key}">DELETE</button>
            </div>
        </div>
    `).join("");
}

async function updateCommentStatus(commentKey,status){
    await update(ref(db,`comments/${commentKey}`),{status,updatedAt:Date.now()});
    await writeLog(`COMMENT ${status.toUpperCase()} : ${commentKey}`);
}

async function deleteComment(commentKey){
    const confirmed=confirm("このコメントを削除しますか？");
    if(!confirmed) return;

    await remove(ref(db,`comments/${commentKey}`));
    await writeLog(`COMMENT DELETE : ${commentKey}`);
}

function isTodayTimestamp(timestamp){
    const date=new Date(timestamp||0);
    const today=new Date();

    return(
        date.getFullYear()===today.getFullYear()&&
        date.getMonth()===today.getMonth()&&
        date.getDate()===today.getDate()
    );
}

function updateCommunityAdminStats(entries){
    const authors=
        new Set(
            entries.map(([key,post])=>String(post.name||"匿名").trim())
        );

    if(adminCommunityTotal){
        adminCommunityTotal.innerText=entries.length;
    }

    if(adminCommunityToday){
        adminCommunityToday.innerText=
            entries.filter(([key,post])=>isTodayTimestamp(post.createdAt)).length;
    }

    if(adminCommunityAuthors){
        adminCommunityAuthors.innerText=authors.size;
    }

    if(adminNgWordCount){
        adminNgWordCount.innerText=
            Object.keys(latestNgWords||{}).length;
    }
}

function renderCommunityPosts(posts){
    latestCommunity=posts||{};
    latestCommunityPosts=posts||{};

    const filterText=
        String(communityAuthorFilter?.value||"")
        .trim()
        .toLowerCase();

    const allEntries=
        Object.entries(latestCommunityPosts)
        .sort(
            (a,b)=>
                (b[1].createdAt??0)-
                (a[1].createdAt??0)
        );

    const entries=
        filterText
        ?
        allEntries.filter(
            ([key,post])=>
                String(post.name||"匿名")
                .toLowerCase()
                .includes(filterText)
        )
        :
        allEntries;

    updateCommunityAdminStats(allEntries);

    communityPostCount.innerText=
        `${entries.length} POSTS`;

    communityManageSummary.innerHTML=
        `<span>ALL : ${allEntries.length}</span>
        <span>DISPLAY : ${entries.length}</span>`;

    if(entries.length===0){
        masterCommunityPostList.innerHTML=
            `<div class="community-admin-empty">投稿なし</div>`;
        return;
    }

    masterCommunityPostList.innerHTML=
        entries
        .map(([key,post])=>`
            <div class="community-admin-post">
                <div class="community-admin-post-top">
                    <div>
                        <strong>${String(post.name||"匿名").replaceAll("<","&lt;").replaceAll(">","&gt;")}</strong>
                        <span>${post.createdAt ? new Date(post.createdAt).toLocaleString("ja-JP") : ""}</span>
                    </div>
                    <button class="neon-button danger-action community-post-delete" data-post-key="${key}">DELETE</button>
                </div>
                <div class="community-admin-message">${String(post.message||"").replaceAll("<","&lt;").replaceAll(">","&gt;")}</div>
            </div>
        `)
        .join("");
}

function renderNgWordRequests(requests){
    const entries=Object.entries(requests||{})
        .sort((a,b)=>(b[1].createdAt??0)-(a[1].createdAt??0));

    ngRequestCount.innerText=`${entries.length} REQUESTS`;

    if(entries.length===0){
        masterNgRequestList.innerHTML=`<div class="community-admin-empty">申請なし</div>`;
        return;
    }

    masterNgRequestList.innerHTML=entries.map(([key,request])=>`
        <div class="ng-request-item">
            <div class="ng-request-top">
                <div>
                    <strong>${String(request.word||"").replaceAll("<","&lt;").replaceAll(">","&gt;")}</strong>
                    <span>${request.createdAt ? new Date(request.createdAt).toLocaleString("ja-JP") : ""}</span>
                </div>

                <div class="ng-request-actions">
                    <button class="neon-button ng-request-approve" data-request-key="${key}">APPROVE</button>
                    <button class="neon-button danger-action ng-request-reject" data-request-key="${key}">REJECT</button>
                </div>
            </div>

            <div class="community-admin-message">
                申請者: ${String(request.name||"匿名").replaceAll("<","&lt;").replaceAll(">","&gt;")}<br>
                理由: ${String(request.reason||"").replaceAll("<","&lt;").replaceAll(">","&gt;")}
            </div>
        </div>
    `).join("");
}

async function deleteCommunityPost(postKey){
    const confirmed=confirm("この投稿を削除しますか？");
    if(!confirmed) return;

    await remove(ref(db,`community/${postKey}`));
    await writeLog(`COMMUNITY POST DELETE : ${postKey}`);
}

async function approveNgWordRequest(requestKey){
    const snapshot=await get(ref(db,`ngWordRequests/${requestKey}`));
    const request=snapshot.val();

    if(!request){
        alert("申請が見つかりません");
        return;
    }

    const word=String(request.word||"").trim();

    if(!word){
        alert("NGワードが空です");
        return;
    }

    await set(push(ngWordsRef),{word,createdAt:Date.now(),sourceRequest:requestKey});
    await remove(ref(db,`ngWordRequests/${requestKey}`));
    await writeLog(`NG WORD APPROVE : ${word}`);
    await createOwnerNotification("ngword","NG WORD APPROVED",word);
}

async function rejectNgWordRequest(requestKey){
    const confirmed=confirm("このNGワード申請を却下しますか？");
    if(!confirmed) return;

    await remove(ref(db,`ngWordRequests/${requestKey}`));
    await writeLog(`NG WORD REQUEST REJECT : ${requestKey}`);
}

function renderNgWords(words){
    latestNgWords=words||{};

    if(adminNgWordCount){
        adminNgWordCount.innerText=
            Object.keys(latestNgWords).length;
    }

    if(latestCommunityPosts){
        renderCommunityPosts(latestCommunityPosts);
    }
}


function createOwnerNotification(type,title,message){
    return set(
        push(notificationsRef),
        {
            type,
            title,
            message,
            status:"new",
            createdAt:Date.now()
        }
    );
}



function updateMasterEmblems(){
    const emergencyActive=
        latestEmergency?.active
        ||
        latestMasterTheme==="emergency-red";

    const logoPath=
        emergencyActive
        ?
        "../assets/rescon-logo-emergency.svg"
        :
        "../assets/rescon-logo-master.svg";

    document
        .querySelectorAll("#master-container .rescon-logo img,#master-boot-overlay .master-boot-logo img")
        .forEach(img=>{
            img.src=logoPath;
        });
}

function applyMasterTheme(theme){
    latestMasterTheme=theme||"royal-purple";

    localStorage.setItem(
        MASTER_THEME_STORAGE_KEY,
        latestMasterTheme
    );

    document.body.classList.remove(
        "theme-royal-purple",
        "theme-neon-cyan",
        "theme-gold-command",
        "theme-midnight-black",
        "theme-emergency-red"
    );

    document.body.classList.add(
        `theme-${latestMasterTheme}`
    );

    if(themeCurrentBadge){
        themeCurrentBadge.innerText=
            latestMasterTheme
            .replaceAll("-"," ")
            .toUpperCase();
    }

    themeCards.forEach(card=>{
        card.classList.toggle(
            "active",
            card.dataset.theme===latestMasterTheme
        );
    });

    updateMasterEmblems();
}

async function saveMasterTheme(theme){
    await set(
        masterThemeRef,
        theme
    );

    await writeLog(
        `MASTER THEME : ${theme}`
    );

    await createOwnerNotification(
        "theme",
        "MASTER THEME CHANGED",
        theme
    );
}

function renderEmergency(emergency){
    latestEmergency=emergency||{active:false};

    const active=
        latestEmergency.active??false;

    emergencyToggle.checked=active;

    emergencyBadge.innerText=
        active
        ?
        "ON"
        :
        "OFF";

    emergencyBadge.classList.toggle(
        "active",
        active
    );

    emergencyMessageInput.value=
        latestEmergency.message
        ??
        "緊急停止中です。MASTERからの指示を待ってください。";

    if(emergencyPreview){
        emergencyPreview.innerHTML=
            active
            ?
            `<div class="emergency-preview-card">
                <div>⚠ EMERGENCY MODE ACTIVE</div>
                <p>${escapeMasterHtml(latestEmergency.message||"緊急停止中です。")}</p>
            </div>`
            :
            `<div class="announcement-empty">EMERGENCY MODE OFF</div>`;
    }

    document.body.classList.toggle(
        "master-emergency-active",
        active
    );

    updateMasterEmblems();
}

async function saveEmergency(){
    const active=
        emergencyToggle.checked;

    const message=
        emergencyMessageInput.value.trim()
        ||
        "緊急停止中です。MASTERからの指示を待ってください。";

    await set(
        emergencyRef,
        {
            active,
            message,
            createdAt:Date.now()
        }
    );

    await writeLog(
        `EMERGENCY MODE : ${active ? "ON" : "OFF"}`
    );

    await createOwnerNotification(
        "emergency",
        active ? "EMERGENCY MODE ON" : "EMERGENCY MODE OFF",
        message
    );
}

async function clearEmergency(){
    emergencyToggle.checked=false;

    await set(
        emergencyRef,
        {
            active:false,
            message:"",
            clearedAt:Date.now()
        }
    );

    await writeLog(
        "EMERGENCY MODE CLEAR"
    );

    await createOwnerNotification(
        "emergency",
        "EMERGENCY MODE CLEARED",
        "Emergency mode disabled."
    );
}

async function measureHealthLatency(){
    const start=
        Date.now();

    await set(
        healthPingRef,
        {
            pingAt:start
        }
    );

    latestLatency=
        Date.now()-start;

    renderSystemHealth();
}

function countErrorLogs(){
    return Object.values(latestLogs||{})
        .filter(log=>{
            const message=
                String(log.message||"")
                .toLowerCase();

            return(
                message.includes("error")||
                message.includes("failed")||
                message.includes("失敗")
            );
        })
        .length;
}

function renderSystemHealth(){
    const roomEntries=
        Object.entries(latestRooms||{});

    const activeRooms=
        roomEntries
        .filter(([key,room])=>!room.finished)
        .length;

    const users=
        roomEntries.reduce((sum,[key,room])=>{
            return sum+Object.keys(room.players||{}).length;
        },0);

    const errorCount=
        countErrorLogs();

    let status="NORMAL";

    if(!latestConnected||errorCount>=5||(latestLatency!==null&&latestLatency>300)){
        status="DANGER";
    }else if(errorCount>0||(latestLatency!==null&&latestLatency>120)){
        status="WARNING";
    }

    if(healthFirebase){
        healthFirebase.innerText=
            latestConnected
            ?
            "ONLINE"
            :
            "OFFLINE";
    }

    if(healthLatency){
        healthLatency.innerText=
            latestLatency===null
            ?
            "-- ms"
            :
            `${latestLatency} ms`;
    }

    if(healthUsers){
        healthUsers.innerText=users;
    }

    if(healthRooms){
        healthRooms.innerText=activeRooms;
    }

    if(healthErrors){
        healthErrors.innerText=errorCount;
    }

    if(healthStatus){
        healthStatus.innerText=status;
    }

    if(healthOverallBadge){
        healthOverallBadge.innerText=status;
        healthOverallBadge.className=`health-${status.toLowerCase()}`;
    }
}

function renderLiveEventFeed(){
    if(!dashboardLiveFeedList){
        return;
    }

    const logs=
        Object.values(latestLogs||{})
        .sort((a,b)=>(b.createdAt??0)-(a.createdAt??0))
        .slice(0,16);

    if(logs.length===0){
        dashboardLiveFeedList.innerHTML=
            `<div class="dashboard-empty">EVENTなし</div>`;
        return;
    }

    dashboardLiveFeedList.innerHTML=
        logs
        .map(log=>`
            <div class="live-feed-item">
                <span>${log.createdAt ? new Date(log.createdAt).toLocaleTimeString("ja-JP") : "--:--"}</span>
                <strong>▶ ${escapeMasterHtml(log.message||"EVENT")}</strong>
            </div>
        `)
        .join("");
}


function getCommandRoomState(room){
    if(latestEmergency?.active){
        return "emergency";
    }

    if(room.finished){
        return "finished";
    }

    const state=
        String(room.matchState||"waiting").toLowerCase();

    if(state.includes("running")){
        return "running";
    }

    if(state.includes("countdown")||state.includes("ready")){
        return "ready";
    }

    if(state.includes("finish")){
        return "finished";
    }

    return "waiting";
}

function getCommandStateLabel(state){
    const labels={
        waiting:"WAITING",
        ready:"READY",
        running:"RUNNING",
        finished:"FINISHED",
        emergency:"EMERGENCY"
    };

    return labels[state]||"WAITING";
}


function renderRoomUtilization(roomEntries){
    const total=
        roomEntries.length;

    const counts={
        waiting:0,
        ready:0,
        running:0,
        finished:0,
        emergency:0
    };

    roomEntries.forEach(([key,room])=>{
        const state=
            getCommandRoomState(room);

        counts[state]=
            (counts[state]||0)+1;
    });

    const active=
        counts.ready+
        counts.running+
        counts.emergency;

    const percent=
        total===0
        ?
        0
        :
        Math.round((active/total)*100);

    if(utilizationPercent){
        utilizationPercent.innerText=
            `${percent}%`;
    }

    if(utilizationDetail){
        utilizationDetail.innerText=
            `${active} / ${total} ACTIVE`;
    }

    if(utilizationBarFill){
        utilizationBarFill.style.width=
            `${percent}%`;

        utilizationBarFill.className=
            percent>=80
            ?
            "high"
            :
            (
                percent>=40
                ?
                "middle"
                :
                "low"
            );
    }

    if(utilizationBreakdown){
        utilizationBreakdown.innerHTML=`
            <span class="util-waiting">WAITING ${counts.waiting}</span>
            <span class="util-ready">READY ${counts.ready}</span>
            <span class="util-running">RUNNING ${counts.running}</span>
            <span class="util-finished">FINISHED ${counts.finished}</span>
            <span class="util-emergency">EMERGENCY ${counts.emergency}</span>
        `;
    }
}

function renderCommandCenterMap(){
    if(!commandCenterMap){
        return;
    }

    const entries=
        Object.entries(latestRooms||{})
        .sort(
            (a,b)=>
                (b[1].createdAt??0)-
                (a[1].createdAt??0)
        );

    if(commandMapSummary){
        commandMapSummary.innerText=
            `${entries.length} ROOMS`;
    }

    renderRoomUtilization(entries);

    if(entries.length===0){
        commandCenterMap.innerHTML=
            `<div class="command-empty">ROOMなし</div>`;
        return;
    }

    commandCenterMap.innerHTML=
        entries
        .map(([key,room])=>{
            const state=getCommandRoomState(room);
            const players=Object.values(room.players||{});
            const refereeCount=players.filter(player=>player.role==="referee").length;
            const playerCount=players.filter(player=>player.role==="player").length;
            const spectatorCount=players.filter(player=>player.role==="spectator").length;

            return `
                <button class="command-room-node state-${state}" data-room-key="${key}">
                    <div class="command-node-top">
                        <span class="command-dot"></span>
                        <strong>${escapeMasterHtml(room.roomName||"NO NAME")}</strong>
                    </div>

                    <div class="command-node-state">
                        ${getCommandStateLabel(state)}
                    </div>

                    <div class="command-node-meta">
                        REF ${refereeCount} / PLAYER ${playerCount} / SPEC ${spectatorCount}
                    </div>

                    <div class="command-node-live">
                        <span>TIME ${formatSecondsForMaster(getRoomTimerRemain(room))}</span>
                        <span>DUMMY ${getDummyEntries(room).length}</span>
                    </div>
                </button>
            `;
        })
        .join("");
}

function showMasterBootSequence(){
    const overlay=document.getElementById("master-boot-overlay");
    const linesBox=document.getElementById("master-boot-lines");

    if(!overlay||!linesBox){
        return Promise.resolve();
    }

    overlay.classList.remove("master-boot-hidden");
    overlay.classList.remove("master-boot-fade-out");
    linesBox.innerHTML="";

    const lines=[
        "AUTHORIZATION SUCCESS",
        "LOADING MASTER MODULES...",
        "SYSTEM HEALTH ONLINE",
        "ROOM CONTROL ONLINE",
        "COMMUNITY CONTROL ONLINE",
        "COMMAND CENTER ONLINE",
        "MASTER CONSOLE READY"
    ];

    return new Promise(resolve=>{
        setTimeout(()=>{
            let index=0;

            const timer=setInterval(()=>{
                const line=document.createElement("div");
                line.className="master-boot-line";
                line.innerText=lines[index];
                linesBox.appendChild(line);

                index++;

                if(index>=lines.length){
                    clearInterval(timer);

                    setTimeout(()=>{
                        overlay.classList.add("master-boot-fade-out");

                        setTimeout(()=>{
                            overlay.classList.add("master-boot-hidden");
                            overlay.classList.remove("master-boot-fade-out");
                            resolve();
                        },620);
                    },760);
                }
            },430);
        },250);
    });
}


function renderDashboard(){
    const rooms=latestRooms||{};
    const roomEntries=Object.entries(rooms);
    const activeRooms=roomEntries.filter(([key,room])=>!room.finished).length;
    const runningMatches=roomEntries.filter(([key,room])=>{
        const state=room.matchState||"";
        return state==="running"||state==="countdown";
    }).length;

    const onlineUsers=roomEntries.reduce((sum,[key,room])=>{
        return sum+Object.keys(room.players||{}).length;
    },0);

    if(dashActiveRooms) dashActiveRooms.innerText=activeRooms;
    if(dashRunningMatches) dashRunningMatches.innerText=runningMatches;
    if(dashOnlineUsers) dashOnlineUsers.innerText=onlineUsers;
    if(dashCommunityPosts) dashCommunityPosts.innerText=Object.keys(latestCommunity||{}).length;
    if(dashNgWords) dashNgWords.innerText=Object.keys(latestNgWords||{}).length;
    if(dashComments) dashComments.innerText=Object.keys(latestComments||{}).length;
    if(dashboardUpdated) dashboardUpdated.innerText=new Date().toLocaleTimeString("ja-JP");

    renderDashboardActivity();
    renderDashboardRooms();
    renderCommandCenterMap();
    renderLiveEventFeed();
    renderSystemHealth();
}

function renderDashboardActivity(){
    if(!dashboardActivityList) return;

    const logs=Object.values(latestLogs||{})
        .sort((a,b)=>(b.createdAt??0)-(a.createdAt??0))
        .slice(0,10);

    if(logs.length===0){
        dashboardActivityList.innerHTML=`<div class="dashboard-empty">ACTIVITYなし</div>`;
        return;
    }

    dashboardActivityList.innerHTML=logs.map(log=>`
        <div class="dashboard-activity">
            <div>${escapeMasterHtml(log.message||"")}</div>
            <span>${log.createdAt ? new Date(log.createdAt).toLocaleString("ja-JP") : ""}</span>
        </div>
    `).join("");
}

function renderDashboardRooms(){
    if(!dashboardRoomList) return;

    const rooms=Object.entries(latestRooms||{})
        .sort((a,b)=>(b[1].createdAt??0)-(a[1].createdAt??0))
        .slice(0,8);

    if(rooms.length===0){
        dashboardRoomList.innerHTML=`<div class="dashboard-empty">ROOMなし</div>`;
        return;
    }

    dashboardRoomList.innerHTML=rooms.map(([key,room])=>{
        const state=room.finished?"FINISHED":(room.matchState||"waiting");
        const players=Object.keys(room.players||{}).length;

        return `
            <div class="dashboard-room">
                <div>
                    <strong>${escapeMasterHtml(room.roomName||"NO NAME")}</strong>
                    <span>${escapeMasterHtml(room.roomId||key)}</span>
                </div>
                <div>
                    <b>${escapeMasterHtml(state)}</b>
                    <span>${players} USERS</span>
                </div>
            </div>
        `;
    }).join("");
}

function renderNotifications(notifications){
    latestNotifications=notifications||{};

    const entries=Object.entries(latestNotifications)
        .sort((a,b)=>(b[1].createdAt??0)-(a[1].createdAt??0));

    const unread=entries.filter(([key,item])=>item.status!=="read").length;

    if(notificationSummary){
        notificationSummary.innerHTML=
            `<span>ALL : ${entries.length}</span><span>NEW : ${unread}</span>`;
    }

    if(!notificationList) return;

    if(entries.length===0){
        notificationList.innerHTML=`<div class="notification-empty">通知なし</div>`;
        return;
    }

    notificationList.innerHTML=entries.map(([key,item])=>`
        <div class="notification-item ${item.status==="read"?"read":"new"}">
            <div class="notification-top">
                <div>
                    <span class="notification-type">${escapeMasterHtml(item.type||"INFO")}</span>
                    <strong>${escapeMasterHtml(item.title||"NO TITLE")}</strong>
                </div>
                <button class="neon-button notification-read" data-notification-key="${key}">
                    ${item.status==="read"?"READ":"MARK READ"}
                </button>
            </div>
            <div class="notification-message">${escapeMasterHtml(item.message||"")}</div>
            <div class="notification-date">${item.createdAt ? new Date(item.createdAt).toLocaleString("ja-JP") : ""}</div>
        </div>
    `).join("");
}

async function markNotificationRead(key){
    await update(
        ref(db,`notifications/${key}`),
        {
            status:"read",
            readAt:Date.now()
        }
    );
}

async function clearReadNotifications(){
    const entries=Object.entries(latestNotifications||{})
        .filter(([key,item])=>item.status==="read");

    await Promise.all(
        entries.map(([key])=>remove(ref(db,`notifications/${key}`)))
    );

    await writeLog("NOTIFICATION CLEAR READ");
}


function getNoticeEffectiveStatus(item){
    const now=Date.now();
    if(item.deleteAt&&item.deleteAt<=now) return "expired";
    if(item.status==="draft") return "draft";
    if(item.publishAt&&item.publishAt>now) return "scheduled";
    return "published";
}
function formatNoticeDate(timestamp){
    return timestamp?new Date(timestamp).toLocaleString("ja-JP"):"--";
}
function readDateTimeLocalValue(input){
    if(!input||!input.value) return null;
    const time=new Date(input.value).getTime();
    return Number.isNaN(time)?null:time;
}
function clearNoticeForm(){
    if(noticeTitleInput) noticeTitleInput.value="";
    if(noticeStatusInput) noticeStatusInput.value="published";
    if(noticePinnedInput) noticePinnedInput.checked=false;
    if(noticePublishAtInput) noticePublishAtInput.value="";
    if(noticeDeleteAtInput) noticeDeleteAtInput.value="";
    if(noticeBodyInput) noticeBodyInput.value="";
}
async function addNotice(){
    const title=(noticeTitleInput?.value||"").trim();
    const body=(noticeBodyInput?.value||"").trim();
    const selectedStatus=noticeStatusInput?.value||"published";
    const pinned=!!noticePinnedInput?.checked;
    const publishAt=readDateTimeLocalValue(noticePublishAtInput);
    const deleteAt=readDateTimeLocalValue(noticeDeleteAtInput);
    if(!title||!body){
        alert("タイトルと本文を入力してください");
        return;
    }
    if(deleteAt&&publishAt&&deleteAt<=publishAt){
        alert("予約削除は公開日時より後にしてください");
        return;
    }
    const status=selectedStatus==="scheduled"?"scheduled":selectedStatus==="draft"?"draft":"published";
    await set(push(noticesRef),{
        title,body,pinned,status,
        publishAt:status==="scheduled"?(publishAt||Date.now()):Date.now(),
        deleteAt:deleteAt||null,
        createdAt:Date.now(),
        updatedAt:Date.now(),
        reactions:{good:0,check:0,thanks:0}
    });
    clearNoticeForm();
    await writeLog(`NOTICE ADD : ${title}`);
}
async function toggleNoticePinned(key,item){
    await update(ref(db,`notices/${key}`),{pinned:!item.pinned,updatedAt:Date.now()});
    await writeLog(`NOTICE PIN TOGGLE : ${item.title||key}`);
}
async function changeNoticeStatus(key,status){
    await update(ref(db,`notices/${key}`),{status,updatedAt:Date.now()});
    await writeLog(`NOTICE STATUS : ${status}`);
}
async function deleteNotice(key,item){
    if(!confirm("このお知らせを完全削除しますか？")) return;
    await remove(ref(db,`notices/${key}`));
    await writeLog(`NOTICE DELETE : ${item.title||key}`);
}
function renderNoticeCenter(data){
    latestNotices=data||{};
    const entries=Object.entries(latestNotices).sort((a,b)=>{
        const ap=a[1].pinned?1:0;
        const bp=b[1].pinned?1:0;
        if(ap!==bp) return bp-ap;
        return (b[1].createdAt??0)-(a[1].createdAt??0);
    });
    if(noticeCenterCount) noticeCenterCount.innerText=`${entries.length} NOTICES`;
    if(!noticeCenterList) return;
    const filtered=entries.filter(([key,item])=>{
        const status=getNoticeEffectiveStatus(item);
        return currentNoticeFilter==="all"||status===currentNoticeFilter;
    });
    if(filtered.length===0){
        noticeCenterList.innerHTML=`<div class="notice-empty">NOTICEなし</div>`;
        return;
    }
    noticeCenterList.innerHTML=filtered.map(([key,item])=>{
        const status=getNoticeEffectiveStatus(item);
        const reactions=item.reactions||{};
        return `
            <article class="notice-admin-item status-${status} ${item.pinned?"pinned":""}">
                <div class="notice-admin-head">
                    <div>
                        <div class="notice-admin-title">
                            ${item.pinned?`<span class="notice-pin">PINNED</span>`:""}
                            <span class="notice-status">${status.toUpperCase()}</span>
                            <strong>${escapeMasterHtml(item.title||"NO TITLE")}</strong>
                        </div>
                        <div class="notice-admin-meta">
                            CREATED ${formatNoticeDate(item.createdAt)}
                            / PUBLISH ${formatNoticeDate(item.publishAt)}
                            / DELETE ${formatNoticeDate(item.deleteAt)}
                        </div>
                    </div>
                </div>
                <div class="notice-admin-body">${escapeMasterHtml(item.body||"")}</div>
                <div class="notice-admin-reactions">👍 ${reactions.good||0}　✅ ${reactions.check||0}　🙏 ${reactions.thanks||0}</div>
                <div class="notice-admin-actions">
                    <button class="neon-button notice-action" data-action="pin" data-key="${key}">${item.pinned?"UNPIN":"PIN"}</button>
                    <button class="neon-button notice-action" data-action="publish" data-key="${key}">PUBLISH</button>
                    <button class="neon-button notice-action" data-action="draft" data-key="${key}">DRAFT</button>
                    <button class="neon-button danger-action notice-action" data-action="delete" data-key="${key}">DELETE</button>
                </div>
            </article>`;
    }).join("");
}

function renderAnnouncement(announcement){
    latestAnnouncement=announcement||null;

    if(!announcement||!announcement.active){
        announcementStatusBadge.innerText="STANDBY";
        announcementStatusBadge.className="";
        announcementPreview.innerHTML=`<div class="announcement-empty">現在アナウンスはありません</div>`;
        return;
    }

    announcementStatusBadge.innerText=String(announcement.type||"info").toUpperCase();
    announcementStatusBadge.className=`announcement-${announcement.type||"info"}`;

    announcementPreview.innerHTML=`
        <div class="announcement-preview-card ${announcement.type||"info"}">
            <div class="announcement-preview-title">${escapeMasterHtml(announcement.title||"MASTER ANNOUNCEMENT")}</div>
            <div class="announcement-preview-message">${escapeMasterHtml(announcement.message||"")}</div>
            <div class="announcement-preview-date">
                ${announcement.createdAt ? new Date(announcement.createdAt).toLocaleString("ja-JP") : ""}
            </div>
        </div>
    `;
}

async function sendAnnouncement(){
    const title=announcementTitleInput.value.trim()||"MASTER ANNOUNCEMENT";
    const message=announcementMessageInput.value.trim();

    if(!message){
        alert("本文を入力してください");
        return;
    }

    await set(
        announcementRef,
        {
            active:true,
            type:announcementType.value,
            title,
            message,
            createdAt:Date.now()
        }
    );

    await writeLog(`ANNOUNCEMENT SEND : ${announcementType.value}`);
    await createOwnerNotification("announcement","ANNOUNCEMENT SENT",`${title} / ${message}`);
}

async function clearAnnouncement(){
    await set(
        announcementRef,
        {
            active:false,
            clearedAt:Date.now()
        }
    );

    announcementTitleInput.value="";
    announcementMessageInput.value="";

    await writeLog("ANNOUNCEMENT CLEAR");
    await createOwnerNotification("announcement","ANNOUNCEMENT CLEARED","Master announcement cleared.");
}

async function unlockMaster(){
    authenticated=true;
    loginCard.classList.add("master-hidden");
    setOnlineStatus();

    await showMasterBootSequence();

    masterConsole.classList.remove("master-hidden");
    startListeners();
    await writeLog("MASTER LOGIN");
    await createOwnerNotification("owner","MASTER LOGIN","Master Console login succeeded.");
}

btnMasterLogin.onclick=async()=>{
    const inputHash=await sha256Text(masterPassInput.value);

    if(inputHash!==MASTER_PASS_HASH){
        loginMessage.innerText="MASTER PASSが違います";
        masterPassInput.value="";
        return;
    }

    await unlockMaster();
};

masterPassInput.onkeydown=(event)=>{
    if(event.key==="Enter"){
        btnMasterLogin.click();
    }
};

async function saveSystem(){
    const maintenance=
        maintenanceToggle.checked;

    const communityDisabled=
        communityDisabledToggle.checked;

    await update(
        systemRef,
        {
            maintenance,
            masterMaintenance:maintenance,
            communityDisabled,
            updatedAt:Date.now()
        }
    );

    latestSystem={
        ...(latestSystem||{}),
        maintenance,
        masterMaintenance:maintenance,
        communityDisabled
    };

    updateMaintenanceBadge();

    await writeLog(
        `SYSTEM SAVE MAINTENANCE:${maintenance} COMMUNITY_DISABLED:${communityDisabled}`
    );
}


async function saveManualUpdateMode(){
    const active=
        manualUpdateToggle?.checked
        ??false;

    const schedule=
        manualUpdateScheduleInput?.value.trim()
        ||
        "更新完了までしばらくお待ちください";

    const message=
        manualUpdateMessageInput?.value.trim()
        ||
        "マニュアルを更新中です。";

    await update(
        systemRef,
        {
            manualUpdating:active,
            manualMaintenance:active,
            manualUpdate:{
                active,
                schedule,
                message,
                updatedAt:Date.now()
            },
            updatedAt:Date.now()
        }
    );

    latestSystem={
        ...(latestSystem||{}),
        manualUpdating:active,
        manualMaintenance:active,
        manualUpdate:{
            active,
            schedule,
            message,
            updatedAt:Date.now()
        }
    };

    document.body.classList.toggle(
        "manual-update-master-active",
        active
    );

    await writeLog(
        `MANUAL UPDATE MODE : ${active ? "ON" : "OFF"}`
    );

    await createOwnerNotification(
        "manual",
        active ? "MANUAL UPDATE MODE ON" : "MANUAL UPDATE MODE OFF",
        message
    );
}

async function saveText(type,value){
    await update(
        systemRef,
        {
            [type]:value,
            updatedAt:Date.now()
        }
    );

    await writeLog(`${type.toUpperCase()} SAVE`);
}
if(btnSaveManualUpdateMode){
    btnSaveManualUpdateMode.onclick=()=>saveManualUpdateMode();
}
if(btnSaveSystem){
    btnSaveSystem.onclick=()=>saveSystem();
}
if(btnSaveNotice&&noticeInput){
    btnSaveNotice.onclick=()=>saveText("notice",noticeInput.value);
}
if(typeof btnSaveUpdate!=="undefined"&&btnSaveUpdate&&typeof updateInput!=="undefined"&&updateInput){
    btnSaveUpdate.onclick=()=>saveText("update",updateInput.value);
}
if(btnSaveManual&&manualInput){
    if(btnSaveManual&&manualInput){
    btnSaveManual.onclick=()=>saveText("manual",manualInput.value);
}

if(btnSaveManualMatch&&manualMatchInput){
    btnSaveManualMatch.onclick=()=>saveText("manualMatch",manualMatchInput.value);
}

if(btnSaveManualSystem&&manualSystemInput){
    btnSaveManualSystem.onclick=()=>saveText("manualSystem",manualSystemInput.value);
}
}

if(btnSaveManualMatch&&manualMatchInput){
    btnSaveManualMatch.onclick=()=>saveText("manualMatch",manualMatchInput.value);
}

if(btnSaveManualSystem&&manualSystemInput){
    btnSaveManualSystem.onclick=()=>saveText("manualSystem",manualSystemInput.value);
}
if(btnSendAnnouncement){
    btnSendAnnouncement.onclick=()=>sendAnnouncement();
}
if(btnClearAnnouncement){
    btnClearAnnouncement.onclick=()=>clearAnnouncement();
}
if(btnSaveEmergency){
    btnSaveEmergency.onclick=()=>saveEmergency();
}
if(btnClearEmergency){
    btnClearEmergency.onclick=()=>clearEmergency();
}

themeCards.forEach(card=>{
    card.onclick=()=>{
        saveMasterTheme(
            card.dataset.theme
        );
    };
});

btnMarkAllNotifications.onclick=async()=>{
    const entries=Object.entries(latestNotifications||{})
        .filter(([key,item])=>item.status!=="read");

    await Promise.all(
        entries.map(([key])=>markNotificationRead(key))
    );

    await writeLog("NOTIFICATION MARK ALL READ");
};

btnClearReadNotifications.onclick=()=>clearReadNotifications();

notificationList.onclick=async(event)=>{
    const button=event.target.closest(".notification-read");

    if(!button){
        return;
    }

    await markNotificationRead(
        button.dataset.notificationKey
    );
};

btnCloseRoomDetail.onclick=()=>closeRoomDetail();
btnCloseRoomMonitor.onclick=()=>closeRoomMonitor();

roomDetailModal.onclick=event=>{
    if(event.target===roomDetailModal){
        closeRoomDetail();
    }
};

roomMonitorModal.onclick=event=>{
    if(event.target===roomMonitorModal){
        closeRoomMonitor();
    }
};

btnRefreshRooms.onclick=async()=>{
    const snapshot=await get(roomsRef);
    renderRooms(snapshot.val()||{});
};

if(commandCenterMap){
    commandCenterMap.onclick=event=>{
        const node=event.target.closest(".command-room-node");

        if(!node){
            return;
        }

        openRoomMonitor(
            node.dataset.roomKey
        );
    };
}

masterRoomList.onclick=async(event)=>{
    const button=event.target.closest(".master-room-action");
    if(!button) return;

    const roomKey=button.dataset.roomKey;
    const action=button.dataset.action;
    const room=latestRooms?.[roomKey];
    const roomName=room?.roomName??roomKey;

    if(action==="detail") openRoomDetail(roomKey);
    if(action==="monitor") openRoomMonitor(roomKey);
    if(action==="extend") await extendRoom(roomKey,roomName,7);
    if(action==="close") await forceCloseRoom(roomKey,roomName);
    if(action==="delete") await deleteRoom(roomKey,roomName);
};

masterCommentList.onclick=async(event)=>{
    const button=event.target.closest(".comment-action");
    if(!button) return;

    const commentKey=button.dataset.commentKey;
    const action=button.dataset.action;

    if(action==="delete"){
        await deleteComment(commentKey);
        return;
    }

    await updateCommentStatus(commentKey,action);
};


if(communityAuthorFilter){
    communityAuthorFilter.oninput=()=>{
        renderCommunityPosts(
            latestCommunityPosts
        );
    };
}

if(btnClearCommunityFilter){
    btnClearCommunityFilter.onclick=()=>{
        communityAuthorFilter.value="";
        renderCommunityPosts(
            latestCommunityPosts
        );
    };
}

masterCommunityPostList.onclick=async(event)=>{
    const button=event.target.closest(".community-post-delete");
    if(!button) return;

    await deleteCommunityPost(button.dataset.postKey);
};

masterNgRequestList.onclick=async(event)=>{
    const approveButton=event.target.closest(".ng-request-approve");
    const rejectButton=event.target.closest(".ng-request-reject");

    if(approveButton){
        await approveNgWordRequest(approveButton.dataset.requestKey);
        return;
    }

    if(rejectButton){
        await rejectNgWordRequest(rejectButton.dataset.requestKey);
    }
};

function startListeners(){
    onValue(systemRef,snapshot=>renderSystem(snapshot.val()||{}));
    onValue(noticesRef,snapshot=>renderNoticeCenter(snapshot.val()||{}));
    onValue(updatesRef,snapshot=>renderVersionCenter(snapshot.val()||{}));
    onValue(roomsRef,snapshot=>{
        const rooms=snapshot.val()||{};
        renderRooms(rooms);
        renderDashboard();

        if(
            monitoringRoomKey&&
            rooms[monitoringRoomKey]&&
            !roomMonitorModal.classList.contains("hidden")
        ){
            renderRoomMonitor(
                monitoringRoomKey,
                rooms[monitoringRoomKey]
            );
        }
    });
    onValue(commentsRef,snapshot=>{renderComments(snapshot.val()||{});renderDashboard();});
    onValue(communityRef,snapshot=>{renderCommunityPosts(snapshot.val()||{});renderDashboard();});
    onValue(ngWordRequestsRef,snapshot=>renderNgWordRequests(snapshot.val()||{}));
    onValue(ngWordsRef,snapshot=>{renderNgWords(snapshot.val()||{});renderDashboard();});
    onValue(logsRef,snapshot=>{renderLogs(snapshot.val()||{});renderDashboard();});
    onValue(notificationsRef,snapshot=>renderNotifications(snapshot.val()||{}));
    onValue(announcementRef,snapshot=>renderAnnouncement(snapshot.val()||null));
    onValue(emergencyRef,snapshot=>renderEmergency(snapshot.val()||{active:false}));
    onValue(masterThemeRef,snapshot=>applyMasterTheme(snapshot.val()||"royal-purple"));
    onValue(connectedRef,snapshot=>{
        latestConnected=snapshot.val()===true;
        renderSystemHealth();
    });
}

await ensureSystemData();
setOnlineStatus();
setInterval(measureHealthLatency,15000);



/* ===== v9.2 SUBTAB REPAIR ===== */
