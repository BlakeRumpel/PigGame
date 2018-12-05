/*
    GAME RULES:

    - The game has 2 players, playing in rounds
    - In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
    - BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
    - The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
    - The first player to reach 100 points on GLOBAL score wins the game
*/

function Player(id) {
    this.id = id;
    this.round = 0;
    this.global = 0;
    this.wins = 0;
    this.currentScore = document.getElementById(`current-${id}`);
    this.totalScore = document.getElementById(`score-${id}`);
    this.container = document.querySelector(`.player-${id}-panel`);
    this.name = document.getElementById(`name-${id}`);
    this.currentWins = document.getElementById(`wins-${id}`);
}

const player1 = new Player(0);
const player2 = new Player(1);

let currentPlayer = player1;
let bestOf = 1;

const inputWinningScore = document.getElementById("winning-score");
let winningScore = inputWinningScore.value;

const dice1 = document.getElementById("dice-0");
const dice2 = document.getElementById("dice-1");

const buttonRules = document.querySelector(".btn-rules");
const buttonNew = document.querySelector(".btn-new");
const buttonBof = document.querySelector(".btn-bof");
const buttonRoll = document.querySelector(".btn-roll");
const buttonHold = document.querySelector(".btn-hold");

function switchPlayers() {
    updateRoundScore(0);

    if (currentPlayer === player1) {
        currentPlayer = player2;
        player1.container.classList.remove("active");
        player2.container.classList.add("active");
    } else {
        currentPlayer = player1;
        player1.container.classList.add("active");
        player2.container.classList.remove("active");
    }
}

function updateRoundScore(score) {
    if (score === 0) {
        currentPlayer.round = 0;
    } else {
        currentPlayer.round += score;
    }

    currentPlayer.currentScore.textContent = currentPlayer.round;
}

function updateTotalScore(score) {
    currentPlayer.global += score;
    currentPlayer.totalScore.textContent = currentPlayer.global;

    if (currentPlayer.global >= winningScore) {
        currentPlayer.wins++;
        currentPlayer.currentWins.textContent = "Wins: " +  currentPlayer.wins;

        if (currentPlayer.wins >= bestOf / 2) {
            currentPlayer.container.classList.add("winner");
            currentPlayer.name.textContent = "Winner!";
            buttonRoll.disabled = true;
            buttonHold.disabled = true;
            swal(`Player ${currentPlayer.id + 1} wins!`, "", "success");
        } else {
            currentPlayer.global = 0;
            currentPlayer.totalScore.textContent = currentPlayer.global;

            updateRoundScore(0);
            switchPlayers();
        }
    } else {
        switchPlayers();
    }
}
h
function showRules() {
    swal({
        titleText: "Rules",
        text: `- The game has 2 players, playing in rounds
            - In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
            - BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
            - The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
            - The first player to reach ${winningScore} points on GLOBAL score wins the game`,
        type: "info",
    });
}

function rollDice() {
    const roll1 = Math.floor(Math.random() * 6 + 1);
    const roll2 = Math.floor(Math.random() * 6 + 1);

    if (roll1 === 1 || roll2 === 1) {
        swal("You rolled a 1!", "You lose your current points.", "error");
        switchPlayers();
    } else {
        updateRoundScore(roll1 + roll2);
    }

    dice1.setAttribute("src", `dice-${roll1}.png`);
    dice2.setAttribute("src", `dice-${roll2}.png`);
}

function changeBof() {
    let prev = bestOf;
    bestOf += 2;
    if (bestOf > 5) bestOf = 1;

    buttonBof.innerHTML = buttonBof.innerHTML.replace(prev, bestOf);
} 

function holdScore() {
    updateTotalScore(currentPlayer.round);   
    updateRoundScore(0);
}

function reset() {
    player1.global = 0;
    player1.round = 0;
    player1.wins = 0;
    player1.totalScore.textContent = "0";
    player1.currentScore.textContent = "0";
    player1.currentWins.textContent = "Wins: 0";

    player2.global = 0;
    player2.round = 0;
    player2.wins = 0;
    player2.totalScore.textContent = "0";
    player2.currentScore.textContent = "0";
    player2.currentWins.textContent = "Wins: 0";

    buttonRoll.disabled = false;
    buttonHold.disabled = false;

    currentPlayer.container.classList.remove("winner");
    currentPlayer.name.textContent = `Player ${currentPlayer.id + 1}`;

    switchPlayers();
}

buttonRules.addEventListener("click", showRules)
buttonRoll.addEventListener("click", rollDice);
buttonBof.addEventListener("click", changeBof)
buttonHold.addEventListener("click", holdScore);
buttonNew.addEventListener("click", reset);
inputWinningScore.addEventListener("input", () => winningScore = inputWinningScore.value);

// TODO: Debugging only, don't cheat >:(
dice1.addEventListener("click", () => {
    while (player1.global < winningScore && player2.global < winningScore) {
        rollDice();

        if (Math.random() > 0.5) {
            holdScore();
        }
    }
});