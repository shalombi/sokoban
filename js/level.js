function levelOne() {
  gIsUndo = false;
  //IF WE WANT TO PLAY IN THIS LEVEL ANOTHER TIME AND WANT TO EXPOSE
  gIsSolRevealedLevOne = false;
  resetStopper();
  // define global counter of undo operation
  gSteps = [];

  gLevel = 1;
  displayMsgStart();
  gBoard = buildBoard();
  levelOneElements();
  renderBoard(gBoard);
}

function levelTwo() {
  gIsUndo = false;
  //IF WE WANT TO PLAY IN THIS LEVEL ANOTHER TIME AND WANT TO EXPOSE
  gIsSolRevealedLevTwo = false;
  resetStopper();
  // define global counter of undo operation
  gSteps = [];

  gLevel = 2;
  displayMsgStart();
  gBoard = buildBoard();
  levelTwoElements();
  wallInLevelTwo();
  renderBoard(gBoard);
}

function levelThree() {
  gIsUndo = false;
  //IF WE WANT TO PLAY IN THIS LEVEL ANOTHER TIME AND WANT TO EXPOSE
  gIsSolRevealedLevThree = false;
  //reset stopper (and start this stopper automatically)
  resetStopper();
  // define global counter of undo operation
  gCounterBackSteps = 0;
  // define global counter of undo operation
  gSteps = [];

  gLevel = 3;
  displayMsgStart();
  gBoard = buildBoard();
  //put elements for game
  levelThreeElements();
  //render board
  renderBoard(gBoard);
  //mark Targets
  markTargets(gBoard);
}

function levelOneElements() {
  //start game
  gIsGaming = true;
  //reset the Counter steps
  gCounterSteps = 0;
  //set the score
  gScores = 100;
  // display scores
  showHowManyScores();
  // display steps
  showHowManySteps();
  //choose gammer coordinates
  gGamerPos = { i: 1, j: 2 };
  gLastPos = { i: 1, j: 2 };

  gBoxPos = [
    { i: 2, j: 2 },
    { i: 2, j: 3 },
  ];
  //
  // Place the gamer at selected position
  gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

  // Place the BOX
  gBoard[gBoxPos[0].i][gBoxPos[0].j].gameElement = BOX;
  gBoard[gBoxPos[1].i][gBoxPos[1].j].gameElement = BOX;

  // Place the TARGET
  gBoard[2][4].type = TARGET;
  gBoard[4][2].type = TARGET;

  //wall level one
  gBoard[3][2].type = WALL;
}

function levelTwoElements() {
  //start game
  gIsGaming = true;
  //reset the Counter steps
  gCounterSteps = 0;
  //set the score
  gScores = 100;
  // display steps
  showHowManySteps();
  // display scores
  showHowManyScores();
  //choose gammer coordinates
  gGamerPos = { i: 5, j: 5 };
  // Place the gamer at selected position
  gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

  // Place the BOX
  gBoard[5][2].gameElement = BOX;
  gBoard[5][3].gameElement = BOX;

  // Place the TARGET
  gBoard[4][4].type = TARGET;
  gBoard[4][5].type = TARGET;

  wallInLevelTwo();
  renderBoard(gBoard);
}

function wallInLevelTwo() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      // put a box and not a wall
      if (gBoard[i][j].gameElement === BOX) continue;
      if (gBoard[i][j].type === TARGET) continue;

      gBoard[i][j].type = WALL;
      reOrganizerBoardLevTwo(i, j);
      // board[i][j] = cell;
    }
  }
}

function reOrganizerBoardLevTwo(I, J) {
  var indexes = [
    { i: 1, j: 2 },
    { i: 1, j: 3 },
    { i: 1, j: 4 },
    { i: 2, j: 2 },
    { i: 2, j: 4 },
    { i: 3, j: 4 },
    { i: 3, j: 1 },
    { i: 3, j: 2 },
    { i: 3, j: 3 },
    { i: 4, j: 1 },
    { i: 4, j: 3 },
    { i: 4, j: 4 },
    { i: 4, j: 5 },
    { i: 5, j: 1 },
    { i: 5, j: 5 },
    { i: 6, j: 3 },
    { i: 6, j: 4 },
    { i: 6, j: 5 },
  ];
  for (var i = 0; i < indexes.length; i++) {
    if (indexes[i].i === I && indexes[i].j === J) {
      gBoard[I][J].type = FLOOR;
    }
  }
}

function levelThreeElements() {
  //start game
  gIsGaming = true;
  //reset the Counter steps
  gCounterSteps = 0;
  showHowManySteps();
  //set the score
  gScores = 100;
  showHowManyScores();
  // display scores

  //choose gammer coordinates
  gGamerPos = { i: 4, j: 5 };
  // Place the gamer at selected position
  gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
  // Place the more WALL
  gBoard[1][3].type = WALL;
  gBoard[3][3].type = WALL;
  gBoard[5][3].type = WALL;
  gBoard[6][3].type = WALL;
  gBoard[6][4].type = WALL;
  gBoard[7][1].type = WALL;
  // Place the BOX
  gBoard[2][4].gameElement = BOX;
  gBoard[3][1].gameElement = BOX;
  gBoard[3][2].gameElement = BOX;
  gBoard[4][4].gameElement = BOX;
  gBoard[6][2].gameElement = BOX;

  // Place the TARGET
  gBoard[1][2].type = TARGET;
  gBoard[2][1].type = TARGET;
  gBoard[3][2].type = TARGET;
  gBoard[4][1].type = TARGET;
  gBoard[5][2].type = TARGET;

  //   wallInLevelTwo();
  renderBoard(gBoard);
}
