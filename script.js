const gameContainer = document.getElementById("game");
const currentScoreContainer = document.getElementById("current-score");
const gameOverContainer = document.getElementById("game-over");
const numCardsInput = document.getElementById("num-cards");
const newGameButton = document.getElementById("new-game");
const resetGameButton = document.getElementById("reset-game");
const gameOverButton = document.getElementById("game-over-button");

// game state variables
let numCards = 0;
let numPairs = 0;
let numFinalPairs = 0;
let currentScore = 0;
let card1 = null;
let card2 = null;

const MEMES = [
  "./images/ancient-aliens.png",
  "./images/baby.png",
  "./images/batman.png",
  "./images/boyfriend.png",
  "./images/brian.png",
  "./images/cat.png",
  "./images/crazy-girl.png",
  "./images/dawson.png",
  "./images/futurama.png",
  "./images/keanu.png",
  "./images/kermit.png",
  "./images/kevin-hart.png",
  "./images/wonka.png",
];

const WINS = [
  "./images/gifs/medalian.gif",
  "./images/gifs/poeler.gif",
  "./images/gifs/trophy.gif",
  "./images/gifs/wonka.gif",
  "./images/gifs/baby.gif",
  "./images/gifs/borat.gif",
  "./images/gifs/colbert.gif",
  "./images/gifs/napoleon.gif",
  "./images/gifs/pete.gif",
  "./images/gifs/skeletor.gif",
  "./images/gifs/stefon.gif",
  "./images/gifs/tenacious.gif",
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// this function loops over the array of memes
// it creates a new div and gives it a class with the value of the meme
// it also adds an event listener for a click for each card
function createDivsForMemes(memeArray) {
  const cardContainer = document.getElementById("card-container");

  for (let meme of memeArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add("card");
    newDiv.classList.add(meme);
    // give it a data attribute for the value to be used for comparison
    newDiv.setAttribute("data-url", meme);

    // create inner card container
    const cardInnerDiv = document.createElement("div");
    cardInnerDiv.classList.add("card__inner");

    // create front side card
    const cardFrontDiv = document.createElement("div");
    cardFrontDiv.className = "card__content card_content--front";

    // create back side card
    const cardBackDiv = document.createElement("div");
    cardBackDiv.className = "card__content card__content--back";
    // set meme as background image of card
    cardBackDiv.style.backgroundImage = `url(${meme})`;

    // assemble card
    cardInnerDiv.appendChild(cardFrontDiv);
    cardInnerDiv.appendChild(cardBackDiv);
    newDiv.appendChild(cardInnerDiv);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    cardContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  let card;

  // get the card element based on parent element tree of event
  if (event.target.parentElement.classList.contains("card")) {
    card = event.target.parentElement;
  } else if (
    event.target.parentElement.parentElement.classList.contains("card")
  ) {
    card = event.target.parentElement.parentElement;
  } else if (
    event.target.parentElement.parentElement.parentElement.classList.contains(
      "card"
    )
  ) {
    card = event.target.parentElement.parentElement.parentElement;
  }

  // handle if card already flipped
  if (card.classList.contains("flipped")) {
    return;
  }
  // card selection logic
  if (!card1 && card !== card1) {
    // This is the first card of the comparison
    card1 = card;
    flipCard(card1);
  } else {
    if (card1 === card) {
      // the user clicked the same card that was already showing
      return;
    }
    // This is the first card of the comparison
    card2 = card;
    flipCard(card2);

    // compare card url values
    const c1 = card1.getAttribute("data-url");
    const c2 = card2.getAttribute("data-url");
    if (c1 !== c2) {
      // cards do not equal so turn both cards back over and reset global variables
      resetCards(card1, card2);
      card1 = null;
      card2 = null;
    } else if (c1 === c2) {
      // cards equal each other so keep cards showing and reset global variables
      card1 = null;
      card2 = null;
      numPairs += 1;
    }
  }
  incrementCurrentScore();
  checkGameOver();
}

// flip selected cards back over
const resetCards = (card1, card2) => {
  setTimeout(() => {
    flipCard(card1);
    flipCard(card2);
  }, 1000);
};

// flip individual card
const flipCard = (card) => {
  card.classList.toggle("flipped");
};

// Get best score from localstorage (if it exists)
const setBestScore = () => {
  const bestScore = window.localStorage.bestScore;
  let bestScoreSpan = document.getElementById("best-score");
  bestScoreSpan.innerText = `Best Score: ${bestScore ? bestScore : "Not Set"}`;
};

// add one to the currentScore global variable and update variable with new value
const incrementCurrentScore = () => {
  currentScore += 1;
  currentScoreContainer.innerText = `Current Score: ${currentScore}`;
};

// remove all card divs from the DOM
const clearCards = () => {
  const cards = document.querySelectorAll(".card");
  for (card of cards) {
    card.remove();
  }
};

// take into account how many cards the user wants to play with and return a shuffled array of that many cards
const getShuffledMemes = () => {
  let numPairs = numCards / 2;
  let shuffledMemes = [];

  while (numPairs > 0) {
    const rand = Math.floor(Math.random() * MEMES.length);
    shuffledMemes.push(MEMES[rand]);
    shuffledMemes.push(MEMES[rand]);

    numPairs -= 1;
  }
  shuffledMemes = shuffle(shuffledMemes);
  return shuffledMemes;
};

// initialize a new game
const startNewGame = () => {
  numCards = 0;
  numPairs = 0;
  numFinalPairs = 0;
  currentScore = 0;
  card1 = null;
  card2 = null;

  const newGamePage = document.getElementById("new-game-page");
  if (numCardsInput.value % 2 !== 0) {
    alert("# Cards must be even");
    return;
  }

  numCards = numCards === 0 ? numCardsInput.value : numCards;
  numFinalPairs = numCards / 2;
  newGamePage.style.display = "none";
  gameOverContainer.style.display = "none";
  const gifContainer = document.getElementById("gif-container");
  try {
    gifContainer.firstChild.remove();
  } catch (err) {
    console.log(err);
  }
  gameContainer.style.display = "block";
  currentScoreContainer.innerText = `Current Score: 0`;
  clearCards();
  let shuffledMemes = getShuffledMemes();
  createDivsForMemes(shuffledMemes);
};

// check if the game is over based on current global variables and display a win screen if the game is over
const checkGameOver = () => {
  if (numPairs === numFinalPairs) {
    if (
      !window.localStorage.bestScore ||
      currentScore < Number(window.localStorage.bestScore)
    ) {
      window.localStorage.setItem("bestScore", currentScore);
    }
    gameContainer.style.display = "none";
    gameOverContainer.style.display = "flex";

    const finalScore = document.getElementById("final-score");
    finalScore.innerText = `Your score: ${currentScore}`;

    // get random victory gif
    const rn = Math.floor(Math.random() * WINS.length);
    const gifWin = WINS[rn];

    const imgWin = document.createElement("img");
    imgWin.src = gifWin;

    const gifContainer = document.getElementById("gif-container");
    gifContainer.prepend(imgWin);
  }
};

// when the DOM loads
setBestScore();
numCardsInput.value = 18;
gameContainer.style.display = "none";
gameOverContainer.style.display = "none";

newGameButton.addEventListener("click", startNewGame);
resetGameButton.addEventListener("click", startNewGame);
gameOverButton.addEventListener("click", startNewGame);
