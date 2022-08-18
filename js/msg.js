//display msg to user

function showHowManyScores() {
  var msgCollect = document.querySelector(".counter-scores");

  msgCollect.innerHTML = `scores:${gScores}`;
}

function showHowManySteps() {
  var msgCollect = document.querySelector(".counter-steps");

  msgCollect.innerHTML = `steps:${gCounterSteps}`;
}

function displayMsgStart() {
  var elMsg = document.querySelector(".msg");
  elMsg.innerHTML = "🎯";
}

function displayMsgGameOver() {
  var elMsg = document.querySelector(".msg");
  elMsg.innerHTML = gScores > 0 ? "Victorious  🏆" : "game over";
}

function sayYesWin() {
  sayYes.play();
}
