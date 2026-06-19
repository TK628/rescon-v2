// home.js の一番上へ追加

if(
    sessionStorage.getItem("resconBootPassed")
    !=="true"
){
    location.href="./index.html";
}

window.addEventListener(
    "pageshow",
    event=>{
        if(event.persisted){
            location.href="./index.html";
        }
    }
);

import { app } from "./firebase.js";

import {
    getDatabase,
    ref,
    get,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);

const btnRoom=document.getElementById("btn-room");
const btnCommunity=document.getElementById("btn-community");
const btnManual=document.getElementById("btn-manual");
const btnUpdates=document.getElementById("btn-updates");
const btnFeedback=document.getElementById("btn-feedback");

const homeNoticeList=document.getElementById("home-notice-list");
const noticeNewBadge=document.getElementById("notice-new-badge");
const btnNoticeMarkRead=document.getElementById("btn-notice-mark-read");
const noticeFilterButtons=document.querySelectorAll(".notice-filter");

const noticesRef=ref(db,"notices");

const NOTICE_READ_KEY="resconNoticeLastReadAt";
const NOTICE_REACTION_KEY="resconNoticeReactions";
let latestHomeNotices={};
let currentNoticeFilter="all";
let noticeAutoReadTimer=null;

if(btnRoom){
    btnRoom.onclick=()=>{
        location.href="./room.html";
    };
}

if(btnCommunity){
    btnCommunity.onclick=()=>{
        location.href="./community.html";
    };
}

if(btnManual){
    btnManual.onclick=()=>{
        location.href="./manual.html";
    };
}

if(btnUpdates){
    btnUpdates.onclick=()=>{
        location.href="./updates.html";
    };
}

if(btnFeedback){
    btnFeedback.onclick=()=>{
        location.href="./feedback.html";
    };
}

let masterCommandBuffer="";
let titleClickCount=0;
let titleClickTimer=null;

document.addEventListener("keydown",event=>{
    masterCommandBuffer+=event.key.toLowerCase();

    if(masterCommandBuffer.length>12){
        masterCommandBuffer=masterCommandBuffer.slice(-12);
    }

    if(masterCommandBuffer.endsWith("master")){
        location.href="./master.html";
    }
});

function escapeHomeHtml(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function getLastNoticeReadAt(){
    return Number(localStorage.getItem(NOTICE_READ_KEY)||0);
}

function setLastNoticeReadAt(timestamp){
    localStorage.setItem(
        NOTICE_READ_KEY,
        String(timestamp||Date.now())
    );
}

function getNoticeReactionMap(){
    try{
        return JSON.parse(localStorage.getItem(NOTICE_REACTION_KEY)||"{}");
    }catch(error){
        return {};
    }
}

function setNoticeReactionMap(map){
    localStorage.setItem(
        NOTICE_REACTION_KEY,
        JSON.stringify(map)
    );
}

function getNoticeEffectiveStatus(item){
    const now=Date.now();

    if(item.deleteAt&&item.deleteAt<=now){
        return "expired";
    }

    if(item.status==="draft"){
        return "draft";
    }

    if(item.publishAt&&item.publishAt>now){
        return "scheduled";
    }

    return "published";
}

function isNoticeVisible(item){
    return getNoticeEffectiveStatus(item)==="published";
}

function formatNoticeDate(timestamp){
    if(!timestamp){
        return "--";
    }

    return new Date(timestamp).toLocaleString("ja-JP");
}

function getVisibleNoticeEntries(){
    const lastReadAt=getLastNoticeReadAt();

    return Object.entries(latestHomeNotices||{})
        .filter(([key,item])=>isNoticeVisible(item))
        .sort((a,b)=>{
            const ap=a[1].pinned?1:0;
            const bp=b[1].pinned?1:0;

            if(ap!==bp){
                return bp-ap;
            }

            return (b[1].createdAt??0)-(a[1].createdAt??0);
        })
        .filter(([key,item])=>{
            if(currentNoticeFilter==="pinned"){
                return !!item.pinned;
            }

            if(currentNoticeFilter==="new"){
                return (item.createdAt??0)>lastReadAt;
            }

            return true;
        });
}

function updateNewBadge(){
    const lastReadAt=getLastNoticeReadAt();

    const newCount=
        Object.values(latestHomeNotices||{})
        .filter(item=>isNoticeVisible(item))
        .filter(item=>(item.createdAt??0)>lastReadAt)
        .length;

    if(!noticeNewBadge){
        return;
    }

    if(newCount>0){
        noticeNewBadge.classList.remove("hidden");
        noticeNewBadge.innerText=`NEW ${newCount}`;
    }else{
        noticeNewBadge.classList.add("hidden");
        noticeNewBadge.innerText="NEW 0";
    }
}


function markVisibleNoticesAsReadSoon(){
    if(noticeAutoReadTimer){
        clearTimeout(noticeAutoReadTimer);
    }

    noticeAutoReadTimer=setTimeout(()=>{
        const visibleEntries=Object.entries(latestHomeNotices||{})
            .filter(([key,item])=>isNoticeVisible(item));

        if(visibleEntries.length===0){
            return;
        }

        const latestCreatedAt=Math.max(
            ...visibleEntries.map(([key,item])=>item.createdAt??0)
        );

        if(latestCreatedAt>getLastNoticeReadAt()){
            setLastNoticeReadAt(latestCreatedAt);
            renderHomeNotices();
        }
    },1200);
}

function renderHomeNotices(){
    if(!homeNoticeList){
        return;
    }

    updateNewBadge();
    markVisibleNoticesAsReadSoon();

    const lastReadAt=getLastNoticeReadAt();
    const reactedMap=getNoticeReactionMap();
    const entries=getVisibleNoticeEntries();

    if(entries.length===0){
        homeNoticeList.innerHTML=`
            <div class="home-notice-empty">
                表示できるお知らせはありません。
            </div>
        `;
        return;
    }

    homeNoticeList.innerHTML=
        entries.map(([key,item])=>{
            const reactions=item.reactions||{};
            const isNew=(item.createdAt??0)>lastReadAt;
            const reacted=reactedMap[key];

            return `
                <article class="home-notice-card ${item.pinned?"pinned":""} ${isNew?"new":""}" data-notice-key="${key}">
                    <div class="home-notice-top">
                        <div class="home-notice-labels">
                            ${item.pinned?`<span class="notice-label pinned-label">PINNED</span>`:""}
                            ${isNew?`<span class="notice-label new-label">NEW</span>`:""}
                        </div>
                        <div class="home-notice-date">${formatNoticeDate(item.publishAt||item.createdAt)}</div>
                    </div>

                    <div class="home-notice-title">${escapeHomeHtml(item.title||"NO TITLE")}</div>
                    <div class="home-notice-body">${escapeHomeHtml(item.body||"")}</div>

                    <div class="home-notice-reactions">
                        <button class="notice-reaction ${reacted==="good"?"selected":""}" data-reaction="good" data-notice-key="${key}">👍 ${reactions.good||0}</button>
                        <button class="notice-reaction ${reacted==="check"?"selected":""}" data-reaction="check" data-notice-key="${key}">✅ ${reactions.check||0}</button>
                        <button class="notice-reaction ${reacted==="thanks"?"selected":""}" data-reaction="thanks" data-notice-key="${key}">🙏 ${reactions.thanks||0}</button>
                    </div>
                </article>
            `;
        }).join("");
}

function markAllVisibleNoticesRead(){
    const maxCreatedAt=
        Object.values(latestHomeNotices||{})
        .filter(item=>isNoticeVisible(item))
        .reduce(
            (max,item)=>Math.max(max,item.createdAt||0),
            Date.now()
        );

    setLastNoticeReadAt(maxCreatedAt);
    renderHomeNotices();
}

async function addNoticeReaction(noticeKey,reaction){
    const item=latestHomeNotices[noticeKey];

    if(!item){
        return;
    }

    const reactedMap=getNoticeReactionMap();

    if(reactedMap[noticeKey]){
        return;
    }

    const currentCount=Number(item.reactions?.[reaction]||0);

    await set(
        ref(db,`notices/${noticeKey}/reactions/${reaction}`),
        currentCount+1
    );

    reactedMap[noticeKey]=reaction;
    setNoticeReactionMap(reactedMap);

    const maxRead=Math.max(
        getLastNoticeReadAt(),
        item.createdAt||Date.now()
    );
    setLastNoticeReadAt(maxRead);
}

if(btnNoticeMarkRead){
    btnNoticeMarkRead.onclick=()=>{
        markAllVisibleNoticesRead();
    };
}

noticeFilterButtons.forEach(button=>{
    button.onclick=()=>{
        currentNoticeFilter=button.dataset.noticeHomeFilter||"all";

        noticeFilterButtons.forEach(item=>{
            item.classList.toggle("active",item===button);
        });

        renderHomeNotices();
    };
});

if(homeNoticeList){
    homeNoticeList.onclick=async(event)=>{
        const reactionButton=event.target.closest(".notice-reaction");

        if(reactionButton){
            await addNoticeReaction(
                reactionButton.dataset.noticeKey,
                reactionButton.dataset.reaction
            );
            return;
        }

        const card=event.target.closest(".home-notice-card");

        if(card){
            const noticeKey=card.dataset.noticeKey;
            const item=latestHomeNotices[noticeKey];

            if(item){
                setLastNoticeReadAt(
                    Math.max(
                        getLastNoticeReadAt(),
                        item.createdAt||Date.now()
                    )
                );
                renderHomeNotices();
            }
        }
    };
}

onValue(noticesRef,snapshot=>{
    latestHomeNotices=snapshot.val()||{};
    renderHomeNotices();
});
