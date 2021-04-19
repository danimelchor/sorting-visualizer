const DEFAULT = ["#d85151", "#b93939"];
const SORTED = ["#3fed00", "#35c600"];
const PIVOT = ["#8f8f8f", "#595959"];
const UNSELECTED = ["#ffa5a5", "#bc7676"];
const SWAPPING = ["#fcac00", "#e08002"];

var animationRunning = false;
var userPaused = false;
var displayAnims = true;

var arr = [];

var numBars;
var maxNumBars;

var barWidth;
var maxbarWidth;

var barHeightMult;
var animTime;

var counter = 0;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function countIncrease(reset) {
  reset = reset || false;
  counter++;

  if (reset) counter = 0;
  $("#count").html("Number of moves: " + counter);
}

async function adjustHeight(i, n) {
  n = n || arr[i];
  $("#bar" + i).css("height", barHeightMult * n);
}

async function swap(i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;

  adjustHeight(i);
  adjustHeight(j);
}

function setColor(color, i, j, init) {
  j = j || -1;
  init = init || false;

  if (!(displayAnims || init)) return;

  if (j != -1)
    for (i = i; i < j; i++) {
      $("#bar" + i).css("background-color", color[0]);
      $("#bar" + i).css("border-color", color[1]);
    }
  else {
    $("#bar" + i).css("background-color", color[0]);
    $("#bar" + i).css("border-color", color[1]);
  }
}

function uniqueList(x, y) {
  let list = [];

  for (let index = x; index < y; index++) {
    list.push(index);
  }

  return list;
}

function createArray() {
  barHeightMult = (window.innerHeight) / (2 * numBars);
  let unique = uniqueList(1, numBars + 1);
  arr = [];

  $("#bars").html("");
  for (let i = 0; i < numBars; i++) {
    let randomIndex = Math.floor(Math.random() * unique.length);
    var n = unique[randomIndex];

    unique.splice(randomIndex, 1);
    arr.push(n);

    var $bar = $("<div>");
    $bar.attr("class", "bar transition-colors duration-150");
    $bar.css("width", barWidth.toString() + "px");
    $bar.css("height", (barHeightMult * n).toString() + "px");
    $bar.css("margin-right", barWidth * 0.1 + "px");
    $bar.css("margin-left", barWidth * 0.1 + "px");

    $bar.attr("id", "bar" + i);

    $bar.appendTo("#bars");
  }

  setColor(DEFAULT, 0, arr.length, true);
}

$(document).ready(function () {
  animTime = parseInt(localStorage.getItem("animTime")) || 30;
  numBars = parseInt(localStorage.getItem("numBars")) || 30;
  barWidth = parseInt(localStorage.getItem("barWidth")) || 30;
  displayAnims = JSON.parse(localStorage.getItem("displayAnims")) || true;

  $("#animTimeInput").attr("value", Math.round(Math.sqrt(animTime) * 5));
  $("#animTimeLabel").text("Animation time: " + animTime + "ms");

  $("#numBarsInput").attr("max", window.innerWidth / (barWidth * 1.2));
  $("#numBarsInput").attr("value", numBars);
  $("#numBarsLabel").text("Number of bars: " + numBars);

  $("#barWidthInput").attr("max", window.innerWidth / (numBars * 1.2));
  $("#barWidthInput").attr("value", barWidth);
  $("#barWidthLabel").text("Bars width: " + barWidth);

  $("#displayAnims").prop("checked", displayAnims);

  createArray();

  $("#displayAnims").click(function () {
    localStorage.setItem("displayAnims", !displayAnims);
    displayAnims = !displayAnims;
    setColor(DEFAULT, 0, numBars, true);
  });

  $("#random-data").click(async function () {
    if (animationRunning) {
      countIncrease(true);

      userPaused = true;
      animationRunning = false;

      await sleep(100);
      setColor(DEFAULT, 0, numBars);
      userPaused = false;
    }
    createArray();
  });

  $("#animTimeInput").on("input", function () {
    animTime = parseInt($(this).val());

    // Squaring the slider value provides more control with smaller values
    animTime = Math.round(Math.pow(animTime / Math.sqrt(5), 2));
    $("#animTimeLabel").text("Animation time: " + animTime + "ms");

    localStorage.setItem("animTime", animTime);
  });

  $("#numBarsInput").on("input", function () {
    numBars = parseInt($(this).val());
    $("#numBarsLabel").text("Number of bars: " + numBars);

    localStorage.setItem("numBars", $(this).val());
    $("#barWidthInput").attr("max", window.innerWidth / (numBars * 1.2));
    createArray();
  });

  $("#barWidthInput").on("input", function () {
    barWidth = parseInt($(this).val());
    $("#barWidthLabel").text("Bars width: " + barWidth);

    localStorage.setItem("barWidth", $(this).val());
    $("#numBarsInput").attr("max", window.innerWidth / (barWidth * 1.2));
    createArray();
  });

  $("#sort").click(async function () {
    let selected = $("#algo-select option:selected").val();
    countIncrease(true);

    if (animationRunning) {
      userPaused = true;
      animationRunning = false;
      $("#sort").css("cursor", "wait");
      $("#sort").prop("disabled", true);

      await sleep(100);
      setColor(DEFAULT, 0, numBars);
      userPaused = false;
      $("#sort").css("cursor", "default");
      $("#sort").prop("disabled", false);
    } else {
      animationRunning = true;

      if (selected == "bubble") {
        await bubbleSort();
      } else if (selected == "insert") {
        await insertSort();
      } else if (selected == "merge") {
        await mergeSort(0, numBars - 1);
      } else if (selected == "quick") {
        await quickSort(0, numBars - 1);
      } else if (selected == "selection") {
        await selectionSort();
      }

      animationRunning = false;
    }
    $(this).prop("disabled", false);
  });
});