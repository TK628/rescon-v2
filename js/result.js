import { app } from "./firebase.js";

import {
    getDatabase,
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);

const params=
    new URLSearchParams(
        location.search
    );

const roomId=
    params.get("room");

const timeScore=
    document.getElementById(
        "time-score"
    );

const taskScore=
    document.getElementById(
        "task-score"
    );

const reportScore=
    document.getElementById(
        "report-score"
    );

const rescueScore=
    document.getElementById(
        "rescue-score"
    );

const totalScore=
    document.getElementById(
        "total-score"
    );

const stoveScore=
    document.getElementById(
        "stove-score"
    );

const resultRoomName=
    document.getElementById(
        "result-room-name"
    );

const resultDate=
    document.getElementById(
        "result-date"
    );

const btnHome=
    document.getElementById(
        "btn-home"
    );

const btnRefereeSetting=
    document.getElementById(
        "btn-referee-setting"
    );

const btnPdfExport=
    document.getElementById(
        "btn-pdf-export"
    );

let latestRoomData=null;
let latestResult=null;

function formatDateTime(timestamp){
    const date=
        timestamp
        ?
        new Date(timestamp)
        :
        new Date();

    const yyyy=
        date.getFullYear();

    const mm=
        String(
            date.getMonth()+1
        ).padStart(2,"0");

    const dd=
        String(
            date.getDate()
        ).padStart(2,"0");

    const hh=
        String(
            date.getHours()
        ).padStart(2,"0");

    const mi=
        String(
            date.getMinutes()
        ).padStart(2,"0");

    return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
}

function escapeHtml(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function getResultValue(key){
    return latestResult?.[key]??0;
}

function buildPdfHtml(){
    const roomName=
        latestRoomData?.roomName
        ??"ROOM";

    const dateText=
        formatDateTime(
            latestRoomData?.finishedAt
        );

    const time=
        getResultValue("timeScore");

    const task=
        getResultValue("taskScore");

    const stove=
        getResultValue("stoveScore");

    const report=
        getResultValue("reportScore");

    const rescue=
        getResultValue("rescueScore");

    const total=
        getResultValue("total");

    return `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>MISSION RESULT PDF</title>
<style>
@page{
    size:A4;
    margin:16mm;
}

*{
    box-sizing:border-box;
}

body{
    margin:0;
    color:#111827;
    font-family:
        "Noto Sans JP",
        "Yu Gothic",
        "Meiryo",
        sans-serif;
}

.pdf-page{
    width:100%;
}

.pdf-header{
    border-bottom:3px solid #111827;
    padding-bottom:14px;
    margin-bottom:22px;
}

.pdf-kicker{
    font-size:12px;
    letter-spacing:3px;
    color:#0f766e;
    font-weight:700;
}

.pdf-title{
    margin-top:6px;
    font-size:34px;
    font-weight:800;
    letter-spacing:2px;
}

.pdf-meta{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
    margin-bottom:20px;
}

.pdf-meta-card{
    border:1px solid #d1d5db;
    border-radius:10px;
    padding:12px 14px;
}

.pdf-meta-label{
    font-size:11px;
    color:#6b7280;
    letter-spacing:1.5px;
    font-weight:700;
}

.pdf-meta-value{
    margin-top:6px;
    font-size:18px;
    font-weight:800;
}

.pdf-score-table{
    width:100%;
    border-collapse:collapse;
    margin-top:12px;
}

.pdf-score-table th,
.pdf-score-table td{
    border:1px solid #d1d5db;
    padding:14px 16px;
}

.pdf-score-table th{
    text-align:left;
    background:#f3f4f6;
    color:#374151;
    letter-spacing:1px;
}

.pdf-score-table td{
    text-align:right;
    font-size:24px;
    font-weight:800;
}

.pdf-total{
    margin-top:22px;
    padding:18px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    border:3px solid #111827;
    border-radius:14px;
}

.pdf-total-label{
    font-size:22px;
    font-weight:800;
    letter-spacing:2px;
}

.pdf-total-value{
    font-size:42px;
    font-weight:900;
}

.pdf-footer{
    margin-top:28px;
    padding-top:12px;
    border-top:1px solid #d1d5db;
    color:#6b7280;
    font-size:11px;
    text-align:center;
}

@media print{
    body{
        -webkit-print-color-adjust:exact;
        print-color-adjust:exact;
    }
}
</style>
</head>
<body>
<div class="pdf-page">
    <header class="pdf-header">
        <div class="pdf-kicker">RESCON SYSTEM</div>
        <div class="pdf-title">MISSION RESULT</div>
    </header>

    <section class="pdf-meta">
        <div class="pdf-meta-card">
            <div class="pdf-meta-label">ROOM</div>
            <div class="pdf-meta-value">${escapeHtml(roomName)}</div>
        </div>
        <div class="pdf-meta-card">
            <div class="pdf-meta-label">DATE</div>
            <div class="pdf-meta-value">${escapeHtml(dateText)}</div>
        </div>
    </section>

    <table class="pdf-score-table">
        <tr>
            <th>TIME SCORE</th>
            <td>${time}</td>
        </tr>
        <tr>
            <th>TASK SCORE</th>
            <td>${task}</td>
        </tr>
        <tr>
            <th>STOVE SCORE</th>
            <td>${stove}</td>
        </tr>
        <tr>
            <th>REPORT SCORE</th>
            <td>${report}</td>
        </tr>
        <tr>
            <th>RESCUE SCORE</th>
            <td>${rescue}</td>
        </tr>
    </table>

    <section class="pdf-total">
        <div class="pdf-total-label">TOTAL SCORE</div>
        <div class="pdf-total-value">${total}</div>
    </section>

    <footer class="pdf-footer">
        Generated by RESCON SYSTEM
    </footer>
</div>
<script>
window.onload=()=>{
    setTimeout(()=>{
        window.print();
    },300);
};
</script>
</body>
</html>
`;
}

function exportPdf(){
    if(!latestResult){
        alert("RESULTデータがありません");
        return;
    }

    const printWindow=
        window.open(
            "",
            "_blank",
            "width=900,height=1200"
        );

    if(!printWindow){
        alert("ポップアップがブロックされています");
        return;
    }

    printWindow.document.open();
    printWindow.document.write(
        buildPdfHtml()
    );
    printWindow.document.close();
}

btnHome.onclick=()=>{
    location.href=
        "./home.html";
};

if(btnRefereeSetting){
    btnRefereeSetting.onclick=()=>{
        location.href=
            `./referee.html?room=${roomId}&role=referee&name=REFEREE&openSettings=1`;
    };
}

if(btnPdfExport){
    btnPdfExport.onclick=()=>{
        exportPdf();
    };
}

const roomRef=
    ref(
        db,
        `rooms/${roomId}`
    );

onValue(
    roomRef,
    (snapshot)=>{

        const roomData=
            snapshot.val();

        if(!roomData){
            return;
        }

        latestRoomData=
            roomData;

        const result=
            roomData.result;

        if(!result){
            return;
        }

        latestResult=
            result;

        if(resultRoomName){
            resultRoomName.innerText=
                roomData.roomName??"ROOM";
        }

        if(resultDate){
            resultDate.innerText=
                formatDateTime(
                    roomData.finishedAt
                );
        }

        timeScore.innerText=
            result.timeScore??0;

        taskScore.innerText=
            result.taskScore??0;

        if(stoveScore){
            stoveScore.innerText=
                result.stoveScore??0;
        }

        reportScore.innerText=
            result.reportScore??0;

        rescueScore.innerText=
            result.rescueScore??0;

        totalScore.innerText=
            result.total??0;
    }
);
