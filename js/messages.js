async function countIncrease(reset) {
  reset = reset || false;
  counter++;

  if (reset) counter = 0;
  $("#count").html("Number of moves: " + counter);
}

async function showError() {
  console.log("error");

  var $error = $("<div>");
  $error.text("Please select a sorting algorithm");
  $error.addClass("errorMsg");
  $error.appendTo("body");
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
    best = "O(n)";
    avg = best;
    worst = "O(n²)";
  } else if (selectedAlgo == "selection") {
    best = "O(n)";
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
