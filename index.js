const getRandomInt = () => {
  let random = Math.floor(Math.random() * (14 - 2 + 1)) + 2;
  return random;
};

const getSuit = () => {
  let suit = Math.floor(Math.random() * (4 - 1 + 1)) + 2;

  if (suit === 1) {
    return "H";
  } else if (suit === 2) {
    return "D";
  } else if (suit === 3) {
    return "C";
  } else {
    return "S";
  }
};

let counter = 0;
let dcounter = 0;
let dbackcounter = 10;
let left = 18;
let dleft = 75;
let totalScore = [];
let totalDealerScore = [];
let gameRunning = false;

let init = false;
const newGame = () => {
  if (gameRunning) {
    return;
  }

  gameRunning = true;

  if (init) {
    clearTable();
    revealDealerCards();
    counter = 0;
    dcounter = 0;
    dbackcounter = 10;
    left = 18;
    dleft = 75;
    totalScore = [];
    totalDealerScore = [];
  }

  const p1 = getRandomInt();
  const p2 = getRandomInt();
  const d1 = getRandomInt();
  const d2 = getRandomInt();
  const p1s = getSuit();
  const p2s = getSuit();
  const d1s = getSuit();
  const d2s = getSuit();

  const p1card = `
    <img src="./PNG/${p1}${p1s}.png" class="cardp" id="playercard0" />
  `;
  const p2card = `
    <img src="./PNG/${p2}${p2s}.png" class="cardp" id="playercard1" style="left: 13%;" />
  `;
  const d1card = `
    <img src="./PNG/${d1}${d1s}.png" class="cardd" id="dealercard0"/>
  `;
  const d2card = `
      <img src="./PNG/${d2}${d2s}.png" class="cardd" id="dealercard1" style="left: 70%; z-index: 2"/>
    `;
  const d2cardback = `
        <img src="./PNG/red_back.png" class="cardd" id="dealercard10" style="left: 70%; z-index: 2"/>
      `;

  document
    .querySelector(".player-cards")
    .insertAdjacentHTML("beforeend", p1card);
  document
    .querySelector(".player-cards")
    .insertAdjacentHTML("beforeend", p2card);
  document
    .querySelector(".player-cards")
    .insertAdjacentHTML("beforeend", d1card);
  document
    .querySelector(".player-cards")
    .insertAdjacentHTML("beforeend", d2card);
  document
    .querySelector(".player-cards-back")
    .insertAdjacentHTML("beforeend", d2cardback);

  let playerTotal = 0;
  let dealerTotal = 0;
  let playerDone = false;
  let dealerDone = false;

  if (p1 < 11 && p2 < 11) {
    playerTotal += p1;
    playerTotal += p2;
    currentScore(playerTotal);
    playerDone = true;
  }

  if (d1 < 11 && d2 < 11) {
    dealerTotal += d1;
    dealerTotal += d2;
    currentScore(dealerTotal, totalDealerScore);
    dealerDone = true;
  }

  if (p1 > 10) {
    playerTotal += 10;
  } else {
    playerTotal += p1;
  }
  if (p2 > 10) {
    playerTotal += 10;
  } else {
    playerTotal += p2;
  }

  if (d1 > 10) {
    dealerTotal += 10;
  } else {
    dealerTotal += d1;
  }
  if (d2 > 10) {
    dealerTotal += 10;
  } else {
    dealerTotal += d2;
  }

  if (playerDone == false) {
    currentScore(playerTotal);
  }
  if (dealerDone == false) {
    currentScore(dealerTotal, totalDealerScore);
  }

  init = true;
  updateScore();
  document.getElementById("current-1").textContent = "--";
};

const getNewCard = () => {
  if (gameRunning === false) {
    return;
  }
  gameRunning = true;

  counter++;

  const currentCard = document.getElementById(`playercard${counter}`);
  const card = getRandomInt();
  const suit = getSuit();

  const string = `
        <img src="./PNG/${card}${suit}.png" class="cardp" id="playercard${
    counter + 1
  }" style = "left: ${left}%;"/>
    `;

  currentCard.insertAdjacentHTML("afterend", string);
  left += 5;

  currentScore(card);
  updateScore();
  let state = status();

  if (state == false) {
    winlose(false);
    return;
  }
  if (state == true) {
    winlose(true);
    return;
  }
};

const dealercard = () => {
  dcounter++;
  dbackcounter++;

  const currentCard = document.getElementById(`dealercard${counter}`);
  const card = getRandomInt();
  const suit = getSuit();

  const string = `
        <img src="./PNG/${card}${suit}.png" class="cardd" id="dealercard${
    dcounter + 1
  }" style = "left: ${dleft}%; z-index: ${dcounter + 2}"/>
    `;

  const backstring = `
        <img src="./PNG/red_back.png" class="cardd" id="dealercard${dbackcounter}" style = "left: ${dleft}%; z-index: ${
    dcounter + 3
  }"/>
    `;

  currentCard.insertAdjacentHTML("afterend", string);
  document
    .getElementById(`dealercard10`)
    .insertAdjacentHTML("afterend", backstring);
  dleft += 5;

  currentScore(card, totalDealerScore);
  updateDealerScore();
};

const currentScore = (score = 0, arr = totalScore) => {
  arr.push(score);
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > 10) {
      arr[i] = 10;
    }
  }
  let finalScore = arr.reduce((a, b) => a + b, 0);
  return finalScore;
};

const status = () => {
  let current = currentScore();
  if (current > 21) {
    return false;
  }
  if (current == 21) {
    return true;
  }
};

const winlose = (result) => {
  if (result === true) {
    document.querySelector(".result").innerHTML = "Win!";
    gameRunning = false;
    return;
  }
  if (result === false) {
    document.querySelector(".result").innerHTML = "Bust!";
    gameRunning = false;
    return;
  }
  document.querySelector(".result").innerHTML = "Lose!";
  gameRunning = false;
  return;
};

const stand = () => {
  if (gameRunning === false) {
    return;
  }

  updateDealerScore();
  let playerScore = currentScore();
  let dealerScore = currentScore(0, totalDealerScore);
  let finalDealerScore = dealerScore;
  while (dealerScore < 18) {
    dealercard();
    finalDealerScore = currentScore(0, totalDealerScore);
    if (finalDealerScore > 18) {
      break;
    }
  }

  revealDealerCards();

  if (finalDealerScore <= 21 && finalDealerScore > playerScore) {
    winlose();
  } else {
    winlose(true);
  }
};

const updateScore = () => {
  let playerScore = currentScore();
  document.getElementById("current-0").textContent = `${playerScore}`;
};

const updateDealerScore = () => {
  let dealerScore = currentScore(0, totalDealerScore);
  document.getElementById("current-1").textContent = `${dealerScore}`;
};

const clearTable = () => {
  document.querySelector(".player-cards").innerHTML = " ";
  document.querySelector(".player-cards-back").innerHTML = " ";
  document.querySelector(".result").innerHTML = " ";
};

const revealDealerCards = () => {
  document.querySelector(".player-cards-back").innerHTML = " ";
};

document.querySelector(".btn-roll").addEventListener("click", getNewCard);
document.querySelector(".btn-new").addEventListener("click", newGame);
document.querySelector(".btn-hold").addEventListener("click", stand);

newGame();
