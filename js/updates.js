import { app } from "./firebase.js";
import { getDatabase,ref,onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
const db=getDatabase(app);
const btnBackHome=document.getElementById("btn-back-home");
const latestVersion=document.getElementById("latest-version");
const latestVersionTag=document.getElementById("latest-version-tag");
const latestVersionTitle=document.getElementById("latest-version-title");
const latestVersionDate=document.getElementById("latest-version-date");
const updatesList=document.getElementById("updates-list");
btnBackHome.onclick=()=>{location.href="./home.html";};
function escapeHtml(value){return String(value??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");}
function formatDate(timestamp){return timestamp?new Date(timestamp).toLocaleDateString("ja-JP"):"--";}
function tagClass(tag){return `version-tag tag-${String(tag||"FEATURE").toLowerCase()}`;}
function renderUpdates(data){
    const entries=Object.entries(data||{}).sort((a,b)=>(b[1].createdAt??0)-(a[1].createdAt??0));
    if(entries.length===0){
        latestVersion.innerText="v---";
        latestVersionTag.innerText="---";
        latestVersionTag.className="";
        latestVersionTitle.innerText="更新情報はありません";
        latestVersionDate.innerText="--";
        updatesList.innerHTML=`<div class="updates-empty">更新情報はまだありません</div>`;
        return;
    }
    const latest=entries[0][1];
    latestVersion.innerText=latest.version||"v---";
    latestVersionTag.innerText=latest.tag||"FEATURE";
    latestVersionTag.className=tagClass(latest.tag);
    latestVersionTitle.innerText=latest.title||"RESCON UPDATE";
    latestVersionDate.innerText=formatDate(latest.createdAt);
    updatesList.innerHTML=entries.map(([key,item])=>`
        <article class="version-item">
            <div class="version-head">
                <div>
                    <span class="version-number">${escapeHtml(item.version||"v---")}</span>
                    <span class="${tagClass(item.tag)}">${escapeHtml(item.tag||"FEATURE")}</span>
                    <strong>${escapeHtml(item.title||"RESCON UPDATE")}</strong>
                </div>
                <time>${formatDate(item.createdAt)}</time>
            </div>
            <div class="version-body">${escapeHtml(item.body||item.message||"").replaceAll("\\n","<br>")}</div>
        </article>
    `).join("");
}
onValue(ref(db,"updates"),snapshot=>renderUpdates(snapshot.val()||{}));
