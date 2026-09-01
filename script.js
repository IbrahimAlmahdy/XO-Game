let currentPlayer = "X";
const NumberOfRows = 4;
const turns = Math.pow(NumberOfRows, 2);
let turnsCounter = 0;
const resetButton = document.querySelector("#reset");

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
    event.key === "Enter" ? cellClickHandler(event, i) : true;

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
  container.insertAdjacentElement("afterbegin", board);
};

resetButton.onclick = resetGame;
createBoard();
