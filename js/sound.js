const readySound=new Audio("../sounds/ready.mp3");

const startSound=new Audio("../sounds/start.mp3");

const warningSound=new Audio("../sounds/warning.mp3");

function playReadySound(){

    readySound.currentTime=0;

    readySound.play();
}

function playStartSound(){

    startSound.currentTime=0;

    startSound.play();
}

function playWarningSound(){

    warningSound.currentTime=0;

    warningSound.play();
}

export {
    playReadySound,
    playStartSound,
    playWarningSound
};