import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey:"AIzaSyAbCUXuETozAmXTtFD6QgEl9oNIrphKbHo",
    authDomain:"hidamari-pj-v2.firebaseapp.com",
    databaseURL:"https://hidamari-pj-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId:"hidamari-pj-v2",
    storageBucket:"hidamari-pj-v2.firebasestorage.app",
    messagingSenderId:"741012757496",
    appId:"1:741012757496:web:8948bc703c3bb2eaead40d",
    measurementId:"G-HR5GL7D0W2"
};

const app=initializeApp(firebaseConfig);

export { app };