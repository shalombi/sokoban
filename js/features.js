function addElementsGame() {
  if (!gIsGaming) return;

  gAddGoldInterval = setInterval(function () {
    // use undo feather without elements
    if (gIsUndo || gIsPushExposeBtn) return;
    // if (gIsUndo) return; //to find sol to use  this condition one time,i tried and this not work.
    addGold(gBoard);
  }, 10000);

  //TODO: fix bug - if we push box to wall the box is disappears
  gAddClockInterval = setInterval(function () {
    // use undo feather without elements
    if (gIsUndo || gIsPushExposeBtn) return;

    addClock(gBoard);
  }, 10000);

  gAddGlueInterval = setInterval(function () {
    // use undo feather without elements
    if (gIsUndo || gIsPushExposeBtn) return;

    addGlue(gBoard);
  }, 10000);
}

function addClock(board) {
  if (!gIsGaming) return;

  var emptyCellCoordinate = findCoordinateEmptyCell(gBoard);
  var i = emptyCellCoordinate.i;
  var j = emptyCellCoordinate.j;

  //Model
  board[i][j].gameElement = CLOCK;
  //DOM
  renderCell({ i: i, j: j }, CLOCK_ELEMENT);

  //TODO :REMOVE CLOCK AFTER 3 SEC

  var gRemoveClockInterval = setInterval(function () {
    clearInterval(gRemoveClockInterval);
    // clearInterval(gAddClockInterval);
    removeClock(i, j, board);
  }, 5000);

  renderBoard(gBoard);
}

function addGold(board) {
  if (!gIsGaming) return;

  var emptyCellCoordinate = findCoordinateEmptyCell(gBoard);
  var i = emptyCellCoordinate.i;
  var j = emptyCellCoordinate.j;
  //Model
  board[i][j].gameElement = GOLD;
  //DOM
  renderCell({ i: i, j: j }, GOLD_ELEMENT);

  //TODO :REMOVE CLOCK AFTER 3 SEC

  var gRemoveClockInterval = setInterval(function () {
    clearInterval(gRemoveClockInterval);

    removeGold(i, j, board);
  }, 5000);

  renderBoard(gBoard);
}

function addGlue(board) {
  if (!gIsGaming) return;

  var emptyCellCoordinate = findCoordinateEmptyCell(gBoard);
  var i = emptyCellCoordinate.i;
  var j = emptyCellCoordinate.j;

  //Model
  board[i][j].gameElement = GLUE;
  //DOM
  renderCell({ i: i, j: j }, GLUE_ELEMENT);

  var gGlueInterval = setInterval(function () {
    removeGlue(i, j, board);
    clearInterval(gGlueInterval);
  }, 5000);
}

function removeClock(i, j, board) {
  if (!gIsGaming) return;
  //make sure the rest rest game will not disappear
  if (board[i][j].gameElement === CLOCK) {
    //Model
    board[i][j].gameElement = null;
    //DOM
    renderCell({ i: i, j: j }, "");
  }
}

function removeGold(i, j, board) {
  if (!gIsGaming) return;
  //make sure the rest rest game will not disappear
  if (board[i][j].gameElement === GOLD) {
    //Model
    board[i][j].gameElement = null;
    //DOM
    renderCell({ i: i, j: j }, "");
  }
}

function removeGlue(i, j, board) {
  if (!gIsGaming) return;
  //make sure the rest rest game will not disappear
  if (board[i][j].gameElement === GLUE) {
    //Model
    board[i][j].gameElement = null;
    //DOM
    renderCell({ i: i, j: j }, "");
    // prevent bugs
    gGlueInterval = "";
  }
}

function clockMode(i, j, iDiff, jDiff) {
  var targetCellHtml = document.querySelector(
    `.cell-${i + iDiff}-${j + jDiff}`
  );

  if (gIsEatClock) {
    if (gBoard[gGamerPos.i][gGamerPos.j].type === EAT_ELEMENT) {
      gBoard[gGamerPos.i][gGamerPos.j].type = FLOOR;
      targetCellHtml.classList.remove("clock-mode");
    }

    if (gBoard[i][j].type === FLOOR && gBoard[i][j].gameElement === null) {
      gBoard[i][j].type = EAT_ELEMENT;
      targetCellHtml.classList.add("clock-mode");
    }
  } else if (
    !gIsEatClock &&
    gBoard[gGamerPos.i][gGamerPos.j].type === EAT_ELEMENT
  ) {
    gBoard[gGamerPos.i][gGamerPos.j].type = FLOOR;
    targetCellHtml.classList.remove("clock-mode");
  }
}

function delayGlueMode(i, j, targetCellHtml) {
  gIsGlue = true;

  var glueMode = setTimeout(function () {
    gIsGlue = false;
    gBoard[i][j].type = FLOOR;
    targetCellHtml.classList.remove("glue-mode");
  }, 5000);
}

function undo() {
  if (!gIsGaming) return;
  //if the player back all his route OR if the player click on UNDO at the begin
  if (gSteps.length === 0) return;

  gIsUndo = true;

  var undoI = gSteps[gStepsIndex].event.dirI * -1;
  var undoJ = gSteps[gStepsIndex].event.dirJ * -1;

  gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;

  gGamerPos.i += undoI;
  gGamerPos.j += undoJ;
  gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

  if (gSteps[gStepsIndex].event.moved == BOX) {
    gBoard[gSteps[gStepsIndex].event.posI][
      gSteps[gStepsIndex].event.posJ
    ].gameElement = null;

    gBoard[gSteps[gStepsIndex].event.posI + undoI][
      gSteps[gStepsIndex].event.posJ + undoJ
    ].gameElement = BOX;
  }
  gLastPos.i += undoI;
  gLastPos.j += undoJ;

  gSteps = gSteps.slice(0, gStepsIndex);
  gStepsIndex--;
  markTargets(gBoard);

  renderBoard(gBoard);
}

function findCoordinateEmptyCell(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      i = getRandomInt(1, board.length - 1);
      j = getRandomInt(1, board[0].length - 1);

      if (board[i][j].type === FLOOR && board[i][j].gameElement === null)
        return { i: i, j: j };
    }
  }
}
