import { app } from "./firebase.js";

import {
    getDatabase,
    ref,
    set,
    push,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);
const MAX_MESSAGE_LENGTH=200;

const btnBackHome=document.getElementById("btn-back-home");
const communityName=document.getElementById("community-name");
const communityMessage=document.getElementById("community-message");
const btnSendCommunity=document.getElementById("btn-send-community");
const btnClearCommunity=document.getElementById("btn-clear-community");
const communitySendStatus=document.getElementById("community-send-status");
const communityList=document.getElementById("community-list");
const communityCount=document.getElementById("community-count");
const communityTotalCount=document.getElementById("community-total-count");
const communityTodayCount=document.getElementById("community-today-count");
const communityLatestTime=document.getElementById("community-latest-time");
const communityCharCount=document.getElementById("community-char-count");

const btnOpenNgRequest=document.getElementById("btn-open-ng-request");
const btnCloseNgRequest=document.getElementById("btn-close-ng-request");
const ngRequestModal=document.getElementById("ng-request-modal");
const ngRequestWord=document.getElementById("ng-request-word");
const ngRequestReason=document.getElementById("ng-request-reason");
const btnSendNgRequest=document.getElementById("btn-send-ng-request");
const ngRequestStatus=document.getElementById("ng-request-status");

const communityRef=ref(db,"community");
const systemRef=ref(db,"system");
const ngWordRequestsRef=ref(db,"ngWordRequests");
const ngWordsRef=ref(db,"ngWords");

let latestNgWords={};

let isCommunityDisabled=false;

const savedName=localStorage.getItem("communityUserName");

if(savedName){
    communityName.value=savedName;
}

btnBackHome.onclick=()=>{
    location.href="./home.html";
};

btnOpenNgRequest.onclick=()=>{
    ngRequestModal.classList.remove("hidden");
};

btnCloseNgRequest.onclick=()=>{
    ngRequestModal.classList.add("hidden");
};

ngRequestModal.onclick=event=>{
    if(event.target===ngRequestModal){
        ngRequestModal.classList.add("hidden");
    }
};

function setCommunityDisabled(isDisabled){

    isCommunityDisabled=isDisabled;

    btnSendCommunity.disabled=isDisabled;
    communityMessage.disabled=isDisabled;

    if(isDisabled){
        communitySendStatus.innerText=
            "COMMUNITYは現在停止中です。閲覧のみ可能です。";

        communitySendStatus.style.color=
            "#ffcc00";
    }else if(
        communitySendStatus.innerText===
        "COMMUNITYは現在停止中です。閲覧のみ可能です。"
    ){
        communitySendStatus.innerText="";
    }
}

function restoreDisabledMessageIfNeeded(){

    if(!isCommunityDisabled){
        return;
    }

    communitySendStatus.innerText=
        "COMMUNITYは現在停止中です。閲覧のみ可能です。";

    communitySendStatus.style.color=
        "#ffcc00";
}

function updateCharCount(){
    const length=communityMessage.value.length;
    communityCharCount.innerText=`${length} / ${MAX_MESSAGE_LENGTH}`;
    communityCharCount.classList.toggle("limit-warning",length>=MAX_MESSAGE_LENGTH*0.9);
}

communityMessage.addEventListener("input",()=>{
    if(communityMessage.value.length>MAX_MESSAGE_LENGTH){
        communityMessage.value=communityMessage.value.slice(0,MAX_MESSAGE_LENGTH);
    }
    updateCharCount();
});

function formatDate(timestamp){
    const date=new Date(timestamp);
    const mm=String(date.getMonth()+1).padStart(2,"0");
    const dd=String(date.getDate()).padStart(2,"0");
    const hh=String(date.getHours()).padStart(2,"0");
    const mi=String(date.getMinutes()).padStart(2,"0");
    return `${mm}/${dd} ${hh}:${mi}`;
}

function formatTime(timestamp){
    const date=new Date(timestamp);
    const hh=String(date.getHours()).padStart(2,"0");
    const mi=String(date.getMinutes()).padStart(2,"0");
    return `${hh}:${mi}`;
}

function isToday(timestamp){
    const date=new Date(timestamp);
    const today=new Date();
    return date.getFullYear()===today.getFullYear()&&date.getMonth()===today.getMonth()&&date.getDate()===today.getDate();
}

function escapeHtml(value){
    return String(value??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function sanitizeMessageText(value){
    return String(value??"").replaceAll("\r\n","\n").replaceAll("\r","\n").split("\n").map(line=>line.trimStart()).join("\n").trim();
}

function containsNgWord(message){
    const text=String(message||"").toLowerCase();

    const words=
        Object.values(latestNgWords||{})
        .map(item=>String(item.word||"").trim().toLowerCase())
        .filter(Boolean);

    return words.find(word=>text.includes(word))||"";
}

function normalizeName(name){
    return String(name||"").trim().toLowerCase();
}

function getMyCommunityName(){
    return normalizeName(localStorage.getItem("communityUserName"));
}

function getInitial(name){
    const text=String(name||"匿名").trim();
    return text.charAt(0).toUpperCase()||"U";
}

async function cleanupExpiredPosts(posts){
    const now=Date.now();
    const expiredEntries=Object.entries(posts||{}).filter(([key,post])=>post.expiresAt&&post.expiresAt<now);
    await Promise.all(expiredEntries.map(([key])=>remove(ref(db,`community/${key}`))));
}

function renderStats(entries){
    communityTotalCount.innerText=entries.length;
    communityTodayCount.innerText=entries.filter(([key,post])=>isToday(post.createdAt||0)).length;
    communityLatestTime.innerText=entries.length===0?"--:--":formatTime(entries[0][1].createdAt||Date.now());
}

function renderPosts(posts){
    const now=Date.now();
    const myName=getMyCommunityName();
    const entries=Object.entries(posts||{}).filter(([key,post])=>!post.expiresAt||post.expiresAt>=now).sort((a,b)=>(b[1].createdAt??0)-(a[1].createdAt??0));

    renderStats(entries);
    communityCount.innerText=`${entries.length} POSTS`;

    if(entries.length===0){
        communityList.innerHTML=`<div class="empty-community">投稿はまだありません</div>`;
        return;
    }

    communityList.innerHTML=entries.map(([key,post])=>{
        const name=post.name||"匿名";
        const isMine=myName&&normalizeName(name)===myName;
        const message=escapeHtml(sanitizeMessageText(post.message||""));
        return `<article class="chat-message ${isMine?"chat-mine":"chat-other"}"><div class="chat-line"><div class="chat-avatar">${escapeHtml(getInitial(name))}</div><div class="chat-body"><div class="chat-meta"><span class="chat-name">${escapeHtml(name)}</span><span class="chat-time">${formatDate(post.createdAt||Date.now())}</span></div><div class="chat-bubble">${message}</div></div></div></article>`;
    }).join("");
}

btnClearCommunity.onclick=()=>{

    communityName.value="";
    communityMessage.value="";

    if(isCommunityDisabled){
        restoreDisabledMessageIfNeeded();
    }else{
        communitySendStatus.innerText="";
    }

    localStorage.removeItem(
        "communityUserName"
    );

    updateCharCount();
};

btnSendCommunity.onclick=async()=>{
    const message=sanitizeMessageText(communityMessage.value);
    const name=communityName.value.trim()||"匿名";

    if(!message){
        communitySendStatus.innerText="メッセージを入力してください";
        communitySendStatus.style.color="#ffcc00";
        return;
    }

    if(message.length>MAX_MESSAGE_LENGTH){
        communitySendStatus.innerText=`メッセージは${MAX_MESSAGE_LENGTH}文字以内にしてください`;
        communitySendStatus.style.color="#ffcc00";
        return;
    }

    localStorage.setItem("communityUserName",name);
    btnSendCommunity.disabled=true;
    communitySendStatus.innerText="送信中...";
    communitySendStatus.style.color="#66e3ff";

    const now=Date.now();
    await set(push(communityRef),{name,message,createdAt:now,expiresAt:now+(5*24*60*60*1000)});

    communityMessage.value="";
    updateCharCount();
    communitySendStatus.innerText="送信しました";
    communitySendStatus.style.color="#00ff9c";
    btnSendCommunity.disabled=false;
};

btnSendNgRequest.onclick=async()=>{
    const word=ngRequestWord.value.trim();

    if(!word){
        ngRequestStatus.innerText="NGワードを入力してください";
        ngRequestStatus.style.color="#ffcc00";
        return;
    }

    btnSendNgRequest.disabled=true;
    ngRequestStatus.innerText="申請中...";
    ngRequestStatus.style.color="#66e3ff";

    await set(push(ngWordRequestsRef),{
        word,
        reason:ngRequestReason.value.trim(),
        name:communityName.value.trim()||"匿名",
        status:"new",
        createdAt:Date.now()
    });

    ngRequestWord.value="";
    ngRequestReason.value="";
    ngRequestStatus.innerText="申請しました。オーナー確認待ちです。";
    ngRequestStatus.style.color="#00ff9c";
    btnSendNgRequest.disabled=false;
};

communityMessage.addEventListener("keydown",event=>{
    if(event.ctrlKey&&event.key==="Enter"){
        btnSendCommunity.click();
    }
});

onValue(ngWordsRef,snapshot=>{
    latestNgWords=snapshot.val()||{};
});

onValue(systemRef,snapshot=>{
    const system=snapshot.val()||{};
    setCommunityDisabled(system.communityDisabled??false);
});

onValue(communityRef,snapshot=>{
    const posts=snapshot.val()||{};
    cleanupExpiredPosts(posts);
    renderPosts(posts);
});

updateCharCount();
