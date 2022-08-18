const audioGame = new Audio("sound/calm_game_music.mp3");
const sayYes = new Audio("sound/child-says-yes.mp3");
const audioCorrect = new Audio("sound/correct.mp3");
const audioWin = new Audio("sound/win_player.mp3");
const BOX_IMG = '<img src="img/box.jpeg" />';

const EAT_ELEMENT = "EAT_ELEMENT";
const GOLD_TILE = "GOLD_TILE";
const GLUE_MODE = "GLUE_MODE";
const MATCHING = "matching";
const TARGET = "TARGET";
const GAMER = "GAMER";
const FLOOR = "FLOOR";
const CLOCK = "CLOCK";
const GOLD = "GOLD";
const GLUE = "GLUE";
const WALL = "WALL";
const BOX = "BOX";

const GAMER_ELEMENT = "🧍";
const CLOCK_ELEMENT = "⏳";
const GOLD_ELEMENT = "⚱️";
const GLUE_ELEMENT = `🟢`;

var gBoxesPosAfterClick = [];
var gBoxesPosBefClick = [];
var gCounterFreeSteps = 0;
var gCounterSteps = 0;
var gStepsIndex = -1;

var gIsElementsIntervalsIsStart = false;
var gIsSolRevealedLevThree = false;
var gIsSolRevealedLevTwo = false;
var gIsSolRevealedLevOne = false;
var gIsFirstStep = false;
var gIsEatClock = false;
var gIsEatGold = false;
var gIsGaming = true;
var gIsUndo = false;

var gRemoveClockInterval;
var gAddClockInterval;
var gAddGoldInterval;
var gAddGlueInterval;
var gIsPushExposeBtn;
var gIsGoldMode;
var audioPlay;
var gGamerPos;
var gLastPos;
var gIsGlue;
var gBoxPos;
var gScores;
var gBoard;
var gLevel;
var gSteps;

function initGame() {
  // audioGame.play();
  displayMsgStart();
  gBoard = buildBoard();
  // addElementsGame();
  levelOne();
  // addElementsGame();
  renderBoard(gBoard);
}

// Render the board to an HTML table
function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var cellClass = getClassName({ i: i, j: j });

      if (currCell.type === FLOOR) cellClass += " floor";
      else if (currCell.type === WALL) cellClass += " wall";
      else if (currCell.type === TARGET) cellClass += " target";
      else if (currCell.type === MATCHING) cellClass += " matching";
      else if (currCell.type === GLUE_MODE) cellClass += " glue-mode";
      else if (currCell.type === EAT_ELEMENT) cellClass += " clock-mode";
      else if (currCell.type === GOLD_TILE) cellClass += " gold-element";

      strHTML += `\t<td class="cell ${cellClass} "  onclick="moveTo(${i}, ${j})" >\n`;

      if (currCell.gameElement === GAMER) {
        strHTML += GAMER_ELEMENT;
      } else if (currCell.gameElement === BOX) {
        strHTML += BOX_IMG;
      } else if (currCell.gameElement === CLOCK) {
        strHTML += CLOCK_ELEMENT;
      } else if (currCell.gameElement === GOLD) {
        strHTML += GOLD_ELEMENT;
      } else if (currCell.gameElement === GLUE) {
        strHTML += GLUE_ELEMENT;
      }

      strHTML += "\t</td>\n";
    }
    strHTML += "</tr>\n";
  }

  var elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
  if (gIsGlue) return;
  if (!gIsGaming) return;

  // Calculate distance to make sure we are moving to a neighbor cell
  var iAbsDiff = Math.abs(i - gGamerPos.i);
  var jAbsDiff = Math.abs(j - gGamerPos.j);
  var iDiff = i - gGamerPos.i;
  var jDiff = j - gGamerPos.j;
  var targetCell = gBoard[i][j];
  var conditions = checkTheEdges(i, j, iDiff, jDiff);

  if (targetCell.type === WALL) return;

  // check -- not push box into wall
  if (conditions[0] || conditions[1] || conditions[2] || conditions[3]) {
    return;
  }

  // user must make interaction with page for music. addition , we want to call audioGame.play() only one time
  if (gCounterSteps === 0) audioGame.play();

  startStopper();
  //check if can move - assume he can move - it's more easy to
  var canMove = true;

  // use at the undo function
  var didBoxMove = false;

  // If the clicked Cell is one of the four allowed
  var targetCellHtml = document.querySelector(
    `.cell-${i + iDiff}-${j + jDiff}`
  );

  if (
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0)
  ) {
    // check if elements 'eaten'
    if (gBoard[i][j].gameElement === GLUE) {
      gBoard[i][j].type = GLUE_MODE;
      targetCellHtml.classList.add("glue-mode");
      // glue-mode
      gScores -= 5;
      delayGlueMode(i, j, targetCellHtml);
    }

    if (gBoard[i][j].gameElement === GOLD) {
      gIsEatGold = true;
      gBoard[i][j].type = EAT_ELEMENT;
      targetCellHtml.classList.add("clock-mode");
      gScores += 100;
    }

    if (gBoard[i][j].gameElement === CLOCK) {
      gCounterFreeSteps = 0;
      gIsEatClock = true;
    }

    if (gCounterFreeSteps === 11) {
      //update gIsEatClock boolean
      gIsEatClock = false;
      // restart gCounterFreeSteps
      gCounterFreeSteps = 0;
    }

    // clock mode
    if (
      gIsEatClock ||
      (!gIsEatClock && gBoard[gGamerPos.i][gGamerPos.j].type === EAT_ELEMENT)
    ) {
      clockMode(i, j, iDiff, jDiff);
    }

    // the player can move
    if (gBoard[i][j].gameElement === BOX) {
      //write all movement of BOX -- before the box moved
      //check  -  A: not move on wll B: move only on null (not move on box etc.)
      if (
        gBoard[i + iDiff][j + jDiff].type !== WALL &&
        gBoard[i + iDiff][j + jDiff].gameElement === null
      ) {
        didBoxMove = true;

        if (
          gBoard[i + iDiff][j + jDiff].type === TARGET &&
          gBoard[i + iDiff][j + jDiff].gameElement !== BOX
        ) {
          audioCorrect.play();
          gBoard[i + iDiff][j + jDiff].type = MATCHING;
          targetCellHtml.classList.add(MATCHING);
        }
        if (gBoard[i][j].type === MATCHING) {
          gBoard[i][j].type = TARGET;

          targetCellHtml.classList.remove(MATCHING);
          targetCellHtml.classList.add("target");

          renderBoard(gBoard);
        }

        gBoard[i][j].gameElement = null;
        gBoard[i + iDiff][j + jDiff].gameElement = BOX;

        gLastPos = { i: i + iDiff, j: j + jDiff };

        addStepToHistory(i + iDiff, j + jDiff, iDiff, jDiff, BOX);

        boxStepI = iDiff;
        boxStepJ = jDiff;
      } else {
        canMove = false;
      }
    }

    // MOVING from current position
    // Model:
    if (!canMove) return;

    if (!gIsEatClock) {
      // gCounterFreeSteps ++
      gCounterSteps++;
      gScores--;

      //first ster we sure not clock mode because there is no elements
    }

    if (gIsEatClock) gCounterFreeSteps++;
    //

    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;

    // Dom:
    renderCell(gGamerPos, "");
    // MOVING to selected position
    // Model:
    gGamerPos.i = i;
    gGamerPos.j = j;

    gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

    if (!didBoxMove) {
      addStepToHistory(i, j, iDiff, jDiff, GAMER);
      gLastPos.i = i;
      gLastPos.j = j;
    }

    //add elements to the board , NOTE : we open intervals
    if (gCounterSteps === 1) checkFirstStep();
    if (gCounterSteps === 1 && gIsFirstStep && !gIsElementsIntervalsIsStart) {
      addElementsGame();
      gIsElementsIntervalsIsStart = true;
    }

    //print board
    renderBoard(gBoard);
    // print counter of steps
    showHowManySteps();
    //print counter of scores
    showHowManyScores();
    //check if victory
    checkWin();
    //  check game over
    checkGameOver();
  }
}
