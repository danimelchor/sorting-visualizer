// Colors used for the animations
const DEFAULT = ["#d85151", "#b93939"];
const SORTED = ["#3fed00", "#35c600"];
const PIVOT = ["#8f8f8f", "#595959"];
const UNSELECTED = ["#ffa5a5", "#bc7676"];
const SWAPPING = ["#fcac00", "#e08002"];

// How much the bars width is (97% of screen by default)
const WIDTH = 0.97;

// Stores the width of screen * WIDTH constant
var window_width_offset;

var animationRunning = false;
var userPaused = false;
var displayAnims = true;

// arr is the main array of values to sort
var arr = [];
var selectedAlgo;

var numBars;
var maxNumBars;

var barWidth;
var maxbarWidth;

var barHeightMult;
var animTime;

var counter = 0;

// Basic sleep method
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createLeyed() {
  let listColors = [DEFAULT, SORTED, PIVOT, UNSELECTED, SWAPPING];
  let colorNames = ["Default", "Sorted", "Pivot", "Unselected", "Swapping"];

  for (let i = 0; i < listColors.length; i++) {
    var $leyendItem = $("<div>");
    $leyendItem.attr("class", "inline-block m-3 md:my-0");
    $leyendItem.append(
      "<div style='background: " +
        listColors[i][0] +
        "' class='w-6 h-6 mr-2 inline-block align-middle'></div>"
    );
    $leyendItem.append(
      "<span class='text-white align-middle'>" + colorNames[i] + "</span>"
    );
    $("#leyend").append($leyendItem);
  }
}

// i is the index of the bar
// n is an optional argument for the height of n
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

// Changes color of bars from i to j (or only bar i)
// Allows an optional argument init to allow recoloring
// even when the user set their preference to false
function setColor(color, i, j, init) {
  j = j || -1; // Optional argument
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

// Creates a unique list of numbers from x to y
function uniqueList(x, y) {
  let list = [];

  for (let index = x; index < y; index++) {
    list.push(index);
  }

  return list;
}

function createArray() {
  // Bars take 1/2 of the screen height where the tallest bar is 1/2 of screen
  barHeightMult =
    window.innerWidth >= 640
      ? window.innerHeight / (2 * numBars)
      : window.innerHeight / (2.5 * numBars);
  let unique = uniqueList(1, numBars + 1);
  arr = [];
  console.log(barHeightMult * numBars);

  $("#bars").html("");
  for (let i = 0; i < numBars; i++) {
    // Selecting random unique number
    let randomIndex = Math.floor(Math.random() * unique.length);
    var n = unique[randomIndex];
    unique.splice(randomIndex, 1);
    arr.push(n);

    // Creating the bar div
    var $bar = $("<div>");
    $bar.attr("class", "bar transition-colors duration-150");
    $bar.attr("id", "bar" + i);
    $bar.css("width", barWidth.toString() + "px");
    $bar.css("height", (barHeightMult * n).toString() + "px");
    $bar.css("margin-right", barWidth * 0.1 + "px");
    $bar.css("margin-left", barWidth * 0.1 + "px");

    $bar.appendTo("#bars");
  }

  setColor(DEFAULT, 0, arr.length, true);
}

$(document).ready(function () {
  window_width_offset = window.innerWidth * WIDTH;
  createLeyed();

  // Getting stored values or setting a default one
  animTime = parseInt(localStorage.getItem("animTime")) || 10;
  numBars = parseInt(localStorage.getItem("numBars")) || 30;
  barWidth =
    parseInt(localStorage.getItem("barWidth")) ||
    (window.innerWidth < 640
      ? Math.floor(window_width_offset / (numBars * 1.2))
      : Math.floor(window_width_offset / (3 * numBars * 1.2))); // 1/3rd of screen for computers or full screen mobile
  displayAnims = JSON.parse(localStorage.getItem("displayAnims")) ?? true;

  // Adjusting the range input values and label text
  adjustInputVisuals();

  // Initial array creation
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

      await sleep(300);

      setColor(DEFAULT, 0, numBars);
      userPaused = false;
    }
    createArray();
  });

  $("#animTimeInput").on("input", function () {
    animTime = parseInt($(this).val());

    // Squaring the slider value provides more control with smaller values
    animTime = Math.round(Math.pow(animTime / (100 * Math.sqrt(5)), 2));
    adjustInputVisuals();

    localStorage.setItem("animTime", animTime);
  });

  $("#numBarsInput").on("input", function () {
    numBars = parseInt($(this).val());
    adjustInputVisuals();

    localStorage.setItem("numBars", $(this).val());
    $("#barWidthInput").attr(
      "max",
      Math.floor(window_width_offset / (numBars * 1.2)) // Update the max value the slider can have
    );
    createArray();
  });

  $("#barWidthInput").on("input", function () {
    barWidth = parseInt($(this).val());
    adjustInputVisuals();

    localStorage.setItem("barWidth", $(this).val());
    $("#numBarsInput").attr(
      "max",
      Math.floor(window_width_offset / (barWidth * 1.2)) // Update the max value the slider can have
    );
    createArray();
  });

  $("#sort").click(async function () {
    selectedAlgo = $("#algo-select option:selected").val();
    countIncrease(true);

    if (animationRunning) {
      userPaused = true;
      animationRunning = false;

      // Styling the play button
      $(this).css("cursor", "wait");
      $(this).prop("disabled", true);

      await sleep(300);
      setColor(DEFAULT, 0, numBars);
      userPaused = false;

      // Styling back the play button
      $(this).css("cursor", "default");
      $(this).prop("disabled", false);
    } else {
      $(this).text("Pause");
      $(this).addClass("pause");

      // Displaying the algo stats
      updateStats();

      animationRunning = true;

      if (selectedAlgo == "bubble") {
        await bubbleSort();
      } else if (selectedAlgo == "insert") {
        await insertSort();
      } else if (selectedAlgo == "merge") {
        await mergeSort(0, numBars - 1);
      } else if (selectedAlgo == "quick") {
        await quickSort(0, numBars - 1);
      } else if (selectedAlgo == "selection") {
        await selectionSort();
      } else {
        showError();
      }

      animationRunning = false;
      $(this).text("Sort!");
      $(this).removeClass("pause");
    }
  });
});

$(window).on("resize", function () {
  window_width_offset = window.innerWidth * WIDTH;
  numBars = Math.floor(window_width_offset / (barWidth * 1.2));
  adjustInputVisuals();
  localStorage.setItem("numBars", numBars);
});
