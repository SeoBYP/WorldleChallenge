let index = 0;
let attempts = 0;
let timerID;

function appStart() {

    const displayGameOver = () => {
        const div = document.createElement("div");
        div.innerText = "게임이 종료되었습니다.";
        div.style = "display: flex; justify-content: center; align-items: center; " +
            "position: absolute; top: 45vh; left: 38%; background-color:white;" +
            "width: 200px; height: 100px;";
        document.body.appendChild(div);
    }

    const nextLine = () => {
        if(attempts >= 6){
            gameOver();
            return;
        }
        attempts++;
        index = 0;
    }

    const gameOver = () =>{
        window.removeEventListener("keydown", handleKeyDown);
        displayGameOver();
        clearInterval(timerID);
    }

    const handleBackSpace = () =>{
        if(index > 0){
            const thisBlock = document.querySelector(
                `.board-block[data-index='${attempts}${index - 1}']`);
            thisBlock.innerText = "";
            index--;
        }
    }

    const handleEnter = async() => {
        let collectCount = 0;
        const response = await fetch("/answer");
        const answer = response.json();

        for(let i = 0; i < 5; i++){
            const block = document.querySelector(
                `.board-block[data-index='${attempts}${i}']`);
            const inputText = block.innerText;
            const answerText = answer[i];
            if(inputText === answerText){
                block.style.backgroundColor = "#6aaa64";
                collectCount++;
            }
            else if(answer.includes(inputText)){
                block.style.backgroundColor = "#C9b458";
            }
            else{
                block.style.backgroundColor = "#787C7E";
            }
            block.style.color = "white";
        }
        if(collectCount >= 5){
            gameOver();
        }
        nextLine();
    }

    const handleKeyDown = (event) => {
        const key = event.key;
        const keyCode = event.keyCode;
        const thisBlock = document.querySelector(
            `.board-block[data-index='${attempts}${index}']`);

        if(keyCode === 8){
            handleBackSpace();
        }
        if (index >= 5) {
            if (event.keyCode === 13) handleEnter();
        } else if (keyCode >= 65 && keyCode <= 90) {
            thisBlock.innerText = key.toUpperCase();
            index++;
        }
    }

    const startTimer = () => {
        const startTime = new Date();

        function setTime(){
            const currentTime = new Date();
            const timer = new Date(currentTime - startTime);
            const minutes = timer.getMinutes().toString().padStart(2, "0");
            const seconds = timer.getSeconds().toString().padStart(2, "0");
            const timeH1 = document.querySelector("#timer");
            timeH1.innerText = `${minutes}:${seconds}`;
        }
        timerID = setInterval(setTime, 1000);
    }

    startTimer();

    window.addEventListener("keydown", handleKeyDown);
}

appStart();
