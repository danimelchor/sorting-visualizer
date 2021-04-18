const DEFAULT = ["#d85151", "#b93939"];
const SORTED = ["#3fed00", "#35c600"];
const PIVOT = ["#8f8f8f", "#595959"];
const UNSELECTED = ["#ffa5a5", "#bc7676"];
const SWAPPING = ["#fcac00", "#e08002"];

var arr = [];

var numBars;
var maxNumBars;

var barWidth;
var maxbarWidth;

var barHeightMult;
var animTime;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function adjustHeight(i, n) {
  n = n || arr[i];
  $("#bar" + i).css("height", barHeightMult * n);
}

async function swap(i, j) {
  console.log(i, j);
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;

  adjustHeight(i);
  adjustHeight(j);
}

function setColor(color, i, j) {
  j = j || -1;

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

function createArray() {
  barHeightMult = window.innerHeight / (2 * numBars);

  arr = [];

  $("#bars").html("");
  for (let i = 0; i < numBars; i++) {
    var n = Math.floor(Math.random() * numBars) + 1;
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

  setColor(DEFAULT, 0, arr.length);
}

$(document).ready(function () {
  animTime = localStorage.getItem("animTime") ?? 30;
  numBars = localStorage.getItem("numBars") ?? 30;
  barWidth = localStorage.getItem("barWidth") ?? 30;

  $("#animTimeInput").attr("value", animTime);
  $("#animTimeLabel").text("Animation time: " + animTime + "ms");

  $("#numBarsInput").attr("value", numBars);
  $("#numBarsInput").attr("max", window.innerWidth / (barWidth * 1.2));
  $("#numBarsLabel").text("Number of bars: " + numBars);

  $("#barWidthInput").attr("value", barWidth);
  $("#barWidthInput").attr("max", window.innerWidth / (numBars * 1.2));
  $("#barWidthLabel").text("Bars width: " + barWidth);

  createArray();

  $("#random-data").click(() => createArray());

  $("#animTimeInput").on("input", function () {
    animTime = $(this).val();
    $("#animTimeLabel").text("Animation time: " + animTime + "ms");

    localStorage.setItem("animTime", $(this).val());
  });

  $("#numBarsInput").on("input", function () {
    numBars = $(this).val();
    $("#numBarsLabel").text("Number of bars: " + numBars);

    localStorage.setItem("numBars", $(this).val());
    $("#barWidthInput").attr("max", window.innerWidth / (numBars * 1.2));
    createArray();
  });

  $("#barWidthInput").on("input", function () {
    barWidth = $(this).val();
    $("#barWidthLabel").text("Bars width: " + barWidth);

    localStorage.setItem("barWidth", $(this).val());
    $("#numBarsInput").attr("max", window.innerWidth / (barWidth * 1.2));
    createArray();
  });

  $("#sort").click(async function () {
    let selected = $("#algo-select option:selected").val();
    
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
  });
});
