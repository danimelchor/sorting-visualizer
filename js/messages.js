// Need a counter function to update text
async function countIncrease(reset) {
  reset = reset || false;
  counter++;

  if (reset) counter = 0;
  $("#count").html("Number of moves: " + counter);
}

async function showError() {
  var $error = $("<div>");
  $error.text("Please select a sorting algorithm");
  $error.addClass("errorMsg");
  $error.appendTo("body");
  $error.css("z-index", "100");
  await sleep(2000);

  $error.remove();
}

function updateStats() {
  let best;
  let avg;
  let worst;

  if (selectedAlgo == "bubble") {
    best = "O(n²)";
    avg = best;
    worst = best;
  } else if (selectedAlgo == "insert") {
    best = "O(n)";
    avg = "O(n²)";
    worst = avg;
  } else if (selectedAlgo == "merge") {
    best = "O(n log2(n))";
    avg = best;
    worst = best;
  } else if (selectedAlgo == "quick") {
    best = "O(n log2(n))";
    avg = best;
    worst = "O(n²)";
  } else if (selectedAlgo == "selection") {
    best = "O(n²)";
    avg = best;
    worst = best;
  } else {
    best = "-";
    avg = best;
    worst = best;
  }

  $("#stats div:nth-child(1)").text(
    "Worst case scenario: " + worst + " Operations"
  );
  $("#stats div:nth-child(2)").text(
    "Average case scenario: " + avg + " Operations"
  );
  $("#stats div:nth-child(3)").text(
    "Best case scenario: " + best + " Operations"
  );
}

function adjustInputVisuals() {
  var animText = window.innerWidth < 640 ? "Speed: " : "Animation time: ";
  var barText = window.innerWidth < 640 ? "Bars: " : "Number of bars: ";
  var widthText = window.innerWidth < 640 ? "Width: " : "Bars width: ";

  $("#animTimeInput").attr("value", Math.round(Math.sqrt(animTime) * 5));
  $("#animTimeLabel").text(animText + animTime + "ms");

  $("#numBarsInput").attr("max", window_width_offset / (barWidth * 1.2));
  $("#numBarsInput").attr("value", numBars);
  $("#numBarsLabel").text(barText + numBars);

  $("#barWidthInput").attr("max", window_width_offset / (numBars * 1.2));
  $("#barWidthInput").attr("value", barWidth);
  $("#barWidthLabel").text(widthText + barWidth);

  $("#displayAnims").prop("checked", displayAnims);
}
