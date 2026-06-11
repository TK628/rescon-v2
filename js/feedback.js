import { app } from "./firebase.js";

import {
    getDatabase,
    ref,
    set,
    push
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const db=getDatabase(app);

const btnBackHome=document.getElementById("btn-back-home");
const feedbackType=document.getElementById("feedback-type");
const feedbackName=document.getElementById("feedback-name");
const feedbackMessage=document.getElementById("feedback-message");
const feedbackStatus=document.getElementById("feedback-status");
const btnSubmitFeedback=document.getElementById("btn-submit-feedback");
const btnClearFeedback=document.getElementById("btn-clear-feedback");

btnBackHome.onclick=()=>{
    location.href="./home.html";
};

btnClearFeedback.onclick=()=>{
    feedbackType.value="bug";
    feedbackName.value="";
    feedbackMessage.value="";
    feedbackStatus.innerText="";
};

btnSubmitFeedback.onclick=async()=>{
    const message=
        feedbackMessage.value.trim();

    if(!message){
        feedbackStatus.innerText="内容を入力してください";
        feedbackStatus.style.color="#ffcc00";
        return;
    }

    btnSubmitFeedback.disabled=true;
    feedbackStatus.innerText="送信中...";
    feedbackStatus.style.color="#66e3ff";

    const feedbackRef=
        push(
            ref(db,"comments")
        );

    await set(
        feedbackRef,
        {
            type:feedbackType.value,
            name:feedbackName.value.trim()||"匿名",
            message,
            status:"new",
            createdAt:Date.now(),
            updatedAt:Date.now()
        }
    );

    feedbackMessage.value="";
    feedbackStatus.innerText="送信しました。ありがとうございます。";
    feedbackStatus.style.color="#00ff9c";
    btnSubmitFeedback.disabled=false;
};
