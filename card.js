const startGameScreen = document.querySelector(".startGame");
const startBtn = document.getElementById("startGameBtn");
const restartBtn = document.getElementById("restartBtn");
const playground = document.querySelector(".playground");
const difficultyCards = document.querySelectorAll(".difficulty-card");

let levels = 2, columns = 2, rows = 2;
let cardOne, cardTwo, matched = 0;
let disableDeck = false;

// Emoji set
const emojis = ["❤️","⭐","🍀","🍕","🎵","⚡","🌈","🐶","🐱","🌸","🍎","👑"];

// Difficulty selection
difficultyCards.forEach(card => {
  card.addEventListener("click", () => {
    difficultyCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    levels = parseInt(card.getAttribute("level")) || 2;
    columns = parseInt(card.getAttribute("column")) || 2;
    rows = parseInt(card.getAttribute("row")) || 2;
  });
});

// Start game
startBtn.addEventListener("click", () => {
  // defaults if nothing selected
    matched = 0;
  cardOne = cardTwo = "";
  disableDeck = false;

  startGameScreen.classList.add("hidden");
  playground.classList.remove("hidden");
  restartBtn.classList.remove("hidden");
  initGame();
});

// Restart game
restartBtn.addEventListener("click", () => {

  startGameScreen.classList.remove("hidden");
  playground.classList.add("hidden");
  restartBtn.classList.add("hidden");
});

// Game setup
function initGame() {
  matched = 0;
  cardOne = cardTwo = "";
  disableDeck = false;

  // Pick unique emojis based on levels
  let chosen = emojis.slice(0, levels);
  let gameEmojis = [...chosen, ...chosen]; // duplicate
  gameEmojis.sort(() => Math.random() - 0.5); // shuffle

  playground.innerHTML = "";
  playground.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  playground.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  gameEmojis.forEach(emoji => {
    playground.insertAdjacentHTML("beforeend", `
      <div class="card">
        <div class="card-inner">
          <div class="card-front">?</div>
          <div class="card-back">${emoji}</div>
        </div>
      </div>
    `);
  });

  addCardEvents();
}

function addCardEvents() {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      if(disableDeck || card === cardOne || card.classList.contains("matched")) return;
      card.classList.add("flipped");

      let cardBack = card.querySelector(".card-back").textContent;
      if(!cardOne) {
        cardOne = card;
        return;
      }
      cardTwo = card;
      disableDeck = true;

      let cardOneVal = cardOne.querySelector(".card-back").textContent;
      let cardTwoVal = cardTwo.querySelector(".card-back").textContent;

      if(cardOneVal === cardTwoVal) {
        matched++;
        cardOne.classList.add("matched");
        cardTwo.classList.add("matched");
        resetTurn();
        if(matched === levels) setTimeout(() => alert("You Win! 🎉"), 500);
      } else {
        setTimeout(() => {
          cardOne.classList.remove("flipped");
          cardTwo.classList.remove("flipped");
          resetTurn();
        }, 1000);
      }
    });
  });
}

function resetTurn() {
  cardOne = cardTwo = "";
  disableDeck = false;
}
