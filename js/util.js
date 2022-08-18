//Stopper//

var buttonReset = document.getElementById("button-reset");
var buttonStart = document.getElementById("button-start");
var buttonStop = document.getElementById("button-stop");
var appendSeconds = document.getElementById("seconds");
var appendTens = document.getElementById("tens");
var seconds = 00;
var tens = 00;
var Interval;

function startStopper() {
  clearInterval(Interval);
  Interval = setInterval(startTimer, 10);
}

function stopStopper() {
  clearInterval(Interval);
}

function resetStopper() {
  clearInterval(Interval);
  tens = "00";
  seconds = "00";
  appendTens.innerHTML = tens;
  appendSeconds.innerHTML = seconds;
}

function startTimer() {
  tens++;

  if (tens <= 9) {
    appendTens.innerHTML = "0" + tens;
  }

  if (tens > 9) {
    appendTens.innerHTML = tens;
  }

  if (tens > 99) {
    seconds++;
    appendSeconds.innerHTML = "0" + seconds;
    tens = 0;
    appendTens.innerHTML = "0" + 0;
  }

  if (seconds > 9) {
    appendSeconds.innerHTML = seconds;
  }
}

function markTargets(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].type === MATCHING && board[i][j].gameElement !== BOX) {
        board[i][j].type = TARGET;
      } else if (
        board[i][j].type === TARGET &&
        board[i][j].gameElement === BOX
      ) {
        board[i][j].type = MATCHING;
      }
    }
  }
  // console.log(gBoard);
  renderBoard(gBoard);
}

function cleanBoard(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var targetCellHtml = document.querySelector(`.cell-${i}-${j}`);
      if (
        gBoard[i][j].type === EAT_CLOCK &&
        gBoard[i][j].gameElement === null
      ) {
        gBoard[i][j].type = FLOOR;
        targetCellHtml.classList.remove("clock-mode");
      }
    }
    renderBoard(gBoard);
  }
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  var cellSelector = "." + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

function getClassName(location) {
  var cellClass = `cell-${location.i}-${location.j}`;
  return cellClass;
}

function addStepToHistory(posI, posJ, dirI, dirJ, moved) {
  gSteps.push({
    event: { posI, posJ, dirI, dirJ, moved },
  });
  gStepsIndex++;
}

function checkWin() {
  var isVictory = true;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].type === TARGET && gBoard[i][j].gameElement !== BOX)
        isVictory = false;
    }
  }

  if (isVictory) {
    stopStopper();
    gIsGaming = false;
    audioWin.play();
    if (gLevel === 3) setTimeout(sayYesWin, 3300);
    displayMsgGameOver();
  }
}

function checkGameOver() {
  if (gScores === 0) {
    stopStopper();
    console.log("game over");
    gIsGaming = false;
    displayMsgGameOver();
  }
}

// Disable arrow key scrolling page in users browser
window.addEventListener(
  "keydown",
  function (e) {
    if (
      ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
        e.code
      ) > -1
    ) {
      e.preventDefault();
    }
  },
  false
);

function handleKey(event) {
  var i = gGamerPos.i;
  var j = gGamerPos.j;

  switch (event.key) {
    case "ArrowLeft":
      moveTo(i, j - 1);
      break;
    case "ArrowRight":
      moveTo(i, j + 1);
      break;
    case "ArrowUp":
      moveTo(i - 1, j);
      break;
    case "ArrowDown":
      moveTo(i + 1, j);
      break;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function checkTheEdges(i, j, iDiff, jDiff) {
  var conditions = [];

  for (var i = 0; i < conditions.length; i++) {
    var conditionNumberOne =
      i === 1 && jDiff === 0 && gBoard[i][j].gameElement === BOX;
    var conditionNumberTwo =
      j === 1 && iDiff === 0 && gBoard[i][j].gameElement === BOX;
    var conditionNumberThree =
      i === gBoard.length - 2 &&
      jDiff === 0 &&
      gBoard[i][j].gameElement === BOX;
    var conditionNumberFour =
      j === 5 && iDiff === 0 && gBoard[i][j].gameElement === BOX;

    conditions.push(
      conditionNumberOne,
      conditionNumberTwo,
      conditionNumberThree,
      conditionNumberFour
    );
  }
  return conditions;
}

function checkFirstStep() {
  if (gCounterSteps === 1) {
    gIsFirstStep = true;
  } else {
    gIsFirstStep = false;
  }
}

function withoutElements() {
  //This way we will cancel the interval of the elements and then we can only use the undo function
  gIsElementsIntervalsIsStart = true;
}
