import { app } from "./firebase.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);
const systemRef=ref(db,"system");

const btnBackHome=document.getElementById("btn-back-home");
const searchInput=document.getElementById("manual-search-input");
const manualTabs=document.querySelectorAll(".manual-tab");
const manualPanels=document.querySelectorAll(".manual-panel");

const matchContent=document.getElementById("match-manual-content");
const systemContent=document.getElementById("system-manual-content");
const matchUpdated=document.getElementById("match-manual-updated");
const systemUpdated=document.getElementById("system-manual-updated");

let latestSystem={};
let searchText="";

const defaultManualItems={
    match:[
        {
            title:"ルーム作成",
            body:"ROOM SELECTからルームを作成します。ルーム名、ROOM ID、ROOM PASS、レフリー人数、保持日数を設定します。"
        },
        {
            title:"レフリー操作",
            body:"レフリーは試合タイマー、ダミーライフ、発見状態、救助状態、タスクを操作します。複数レフリーでもタイマーは終了時刻から逆算して同期します。"
        },
        {
            title:"プレイヤー操作",
            body:"プレイヤーは試合状況を確認し、ストーブ報告やダミー詳細報告を行います。"
        },
        {
            title:"観客画面",
            body:"観客は試合状況を閲覧専用で確認します。操作はできません。"
        }
    ],
    system:[
        {
            title:"HOME",
            body:"RESCON SYSTEMの入口です。ROOM SELECT、COMMUNITY、MANUAL、UPDATESへ移動できます。"
        },
        {
            title:"NOTICE",
            body:"MASTERから配信されたお知らせを確認できます。ピン止め、新着表示、リアクションに対応しています。"
        },
        {
            title:"COMMUNITY",
            body:"利用者同士でメッセージを投稿できます。NGワード申請もできます。"
        },
        {
            title:"MASTER",
            body:"管理者専用コンソールです。ROOM管理、NOTICE管理、MANUAL管理、LOG確認などを行います。"
        }
    ]
};

if(btnBackHome){
    btnBackHome.onclick=()=>{
        location.href="./home.html";
    };
}

manualTabs.forEach(tab=>{
    tab.onclick=()=>{
        const target=tab.dataset.manualTab;

        manualTabs.forEach(item=>{
            item.classList.toggle("active",item.dataset.manualTab===target);
        });

        manualPanels.forEach(panel=>{
            panel.classList.toggle("active",panel.dataset.manualPanel===target);
        });
    };
});

if(searchInput){
    searchInput.oninput=()=>{
        searchText=searchInput.value.trim().toLowerCase();
        renderManuals();
    };
}

function escapeHtml(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function formatDate(timestamp){
    if(!timestamp){
        return "--";
    }

    return new Date(timestamp).toLocaleString("ja-JP");
}

function getManualItems(type){
    const saved=latestSystem?.manuals?.[type];

    if(!saved){
        return defaultManualItems[type]||[];
    }

    return Object.values(saved)
        .sort((a,b)=>(a.order??a.createdAt??0)-(b.order??b.createdAt??0));
}

function filterItems(items){
    if(!searchText){
        return items;
    }

    return items.filter(item=>{
        const target=`${item.title||""} ${item.body||""}`.toLowerCase();
        return target.includes(searchText);
    });
}

function renderManualGroup(type,targetElement){
    if(!targetElement){
        return;
    }

    const items=filterItems(getManualItems(type));

    if(items.length===0){
        targetElement.innerHTML=`<div class="manual-empty">表示できる項目がありません。</div>`;
        return;
    }

    targetElement.innerHTML=items.map((item,index)=>`
        <article class="manual-section-item">
            <h3>${index+1}. ${escapeHtml(item.title||"NO TITLE")}</h3>
            <p>${escapeHtml(item.body||"")}</p>
        </article>
    `).join("");
}

function renderManuals(){
    renderManualGroup("match",matchContent);
    renderManualGroup("system",systemContent);

    const updatedText=latestSystem.updatedAt
        ? `UPDATED ${formatDate(latestSystem.updatedAt)}`
        : "DEFAULT";

    if(matchUpdated){
        matchUpdated.innerText=updatedText;
    }

    if(systemUpdated){
        systemUpdated.innerText=updatedText;
    }
}

function activateHashTab(){
    const hash=location.hash.replace("#","");

    if(hash==="system"){
        document.querySelector('[data-manual-tab="system"]')?.click();
    }

    if(hash==="match"){
        document.querySelector('[data-manual-tab="match"]')?.click();
    }
}

onValue(systemRef,snapshot=>{
    latestSystem=snapshot.val()||{};
    renderManuals();
    activateHashTab();
});
