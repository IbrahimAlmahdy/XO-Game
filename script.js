let currentPlayer = "X";
let NumberOfRows = 3;
let turns = Math.pow(NumberOfRows, 2);
let turnsCounter = 0;
let xScore = 0;
let oScore = 0;
let round = 1;

const startButton = document.querySelector("#start");
const boardSizeInput = document.querySelector("#board-size");
const resetButton = document.querySelector("#reset");
const gameTitle = document.querySelector(".game-title");
const gameSettings = document.querySelector(".game-settings");
const backHomeButton = document.querySelector("#back-home");
const scoreboard = document.querySelector(".scoreboard");
const xScoreElement = document.querySelector("#x-score");
const oScoreElement = document.querySelector("#o-score");
const roundElement = document.querySelector("#round");

startButton.onclick = () => {
  NumberOfRows = Number(boardSizeInput.value);
  turns = Math.pow(NumberOfRows, 2);

  board = createBoardArray();
  createBoard();

  gameTitle.style.display = "none";
  gameSettings.style.display = "none";
  resetButton.style.display = "block";
  backHomeButton.style.display = "block";
  scoreboard.style.display = "flex";
};

const backToHome = () => {
  document.querySelector(".board").remove();

  gameSettings.style.display = "flex";
  gameTitle.style.display = "block";
  resetButton.style.display = "none";
  backHomeButton.style.display = "none";
  scoreboard.style.display = "none";

  currentPlayer = "X";
  turnsCounter = 0;
  board = createBoardArray();
};

backHomeButton.onclick = backToHome;

const createBoardArray = () => {
  let board = [];

  for (let row = 0; row < NumberOfRows; row++) {
    board.push(Array.from({ length: NumberOfRows }, () => "_"));
  }

  return board;
};

let board = createBoardArray();

const getCellPlacement = (index, numberOfRows) => {
  const row = Math.floor(index / numberOfRows);
  const col = index % numberOfRows;

  return { row, col };
};

const checkRow = (currentPlayer) => {
  for (let row = 0; row < NumberOfRows; row++) {
    let column = 0;
    while (column < NumberOfRows) {
      if (board[row][column] !== currentPlayer) {
        column = 0;
        break;
      }
      column++;
    }

    if (column === NumberOfRows) {
      return true;
    }
  }
  return false;
};

const checkCol = (currentPlayer) => {
  for (let column = 0; column < NumberOfRows; column++) {
    let row = 0;
    while (row < NumberOfRows) {
      if (board[row][column] !== currentPlayer) {
        row = 0;
        break;
      }
      row++;
    }

    if (row === NumberOfRows) {
      return true;
    }
  }
  return false;
};

const checkDiagonals = () => {
  let counter = 0;

  while (counter < NumberOfRows) {
    if (board[counter][counter] !== currentPlayer) {
      break;
    }
    counter++;
  }
  return counter === NumberOfRows;
};

const checkReverseDiagonal = () => {
  let counter = 0;

  while (counter < NumberOfRows) {
    if (board[counter][NumberOfRows - 1 - counter] !== currentPlayer) {
      break;
    }
    counter++;
  }
  return counter === NumberOfRows;
};

const checkWinner = (currentPlayer) => {
  return (
    checkRow(currentPlayer) ||
    checkCol(currentPlayer) ||
    checkDiagonals(currentPlayer) ||
    checkReverseDiagonal(currentPlayer)
  );
};

const resetGame = () => {
  document.querySelector(".board").remove();
  createBoard();
  board = createBoardArray();
  currentPlayer = "X";
  turnsCounter = 0;
};

const runWinEvent = (currentPlayer) => {
  setTimeout(() => {
    alert(`Player ${currentPlayer} wins!`);
    resetGame();
  }, 100);
};

const runDrawEvent = () => {
  setTimeout(() => {
    alert("Draw!");
    resetGame();
  }, 100);
};

const drawMarkInCell = (cell, currentPlayer) => {
  cell.querySelector(".value").textContent = currentPlayer;
  cell.classList.add(`cell--${currentPlayer}`);
};

const cellClickHandler = (event, index) => {
  const cell = event.target;
  const { row, col } = getCellPlacement(index, NumberOfRows);
  console.log({ row, col });

  if (board[row][col] === "_") {
    turnsCounter++;
    board[row][col] = currentPlayer;

    drawMarkInCell(cell, currentPlayer);

    if (checkWinner(currentPlayer)) {
      if (currentPlayer === "X") {
        xScore++;
        xScoreElement.textContent = xScore;

        if (xScore === 5) {
          round++;
          roundElement.textContent = round;

          xScore = 0;
          oScore = 0;

          xScoreElement.textContent = xScore;
          oScoreElement.textContent = oScore;
        }
      } else {
        oScore++;
        oScoreElement.textContent = oScore;

        if (oScore === 5) {
          round++;
          roundElement.textContent = round;

          xScore = 0;
          oScore = 0;

          xScoreElement.textContent = xScore;
          oScoreElement.textContent = oScore;
        }
      }

      runWinEvent(currentPlayer);
    } else {
      turnsCounter === turns && runDrawEvent();

      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  }
};

const createCell = (index) => {
  const cellElementString = `<div class="cell" role="button" tabindex="${index + 1}"><span class="value"></span></div>`;
  const cellElement = document
    .createRange()
    .createContextualFragment(cellElementString);
  cellElement.querySelector(".cell").onclick = (event) =>
    cellClickHandler(event, index);
  cellElement.querySelector(".cell").onkeydown = (event) =>
    event.key === "Enter" ? cellClickHandler(event, index) : true;

  return cellElement;
};

const createBoard = () => {
  let container = document.querySelector(".container");
  const board = document.createElement("div");

  board.classList.add("board");

  for (let i = 0; i < turns; i++) {
    const cellElement = createCell(i);
    board.appendChild(cellElement);
    document.documentElement.style.setProperty("--grid-rows", NumberOfRows);
  }
  scoreboard.insertAdjacentElement("afterend", board);
};

resetButton.onclick = resetGame;
