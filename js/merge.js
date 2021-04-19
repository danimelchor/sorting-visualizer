async function mergeSort(start, end) {
  if (userPaused) {
    return;
  }

  if (start < end) {
    let middle = Math.floor((start + end) / 2);
    await mergeSort(start, middle);
    await mergeSort(middle + 1, end);

    await merge(start, middle, middle + 1, end);
  }
}

async function merge(start1, end1, start2, end2) {
  let i = 0;
  let j = 0;

  let left = [...arr.slice(start1, end1 + 1)];
  let right = [...arr.slice(start2, end2 + 1)];

  for (k = start1; k <= end2; k++) {
    if (userPaused) {
      return;
    }
    if (j >= right.length || (i < left.length && left[i] < right[j])) {
      swap(k, await findElement(start1, end2, left[i]));
      i++;
    } else {
      swap(k, await findElement(start1, end2, right[j]));
      j++;
    }
    
    await countIncrease();
    await mergeAdjust(k, start1, end2);
    await sleep(animTime);
  }

  if (start1 > 0 || end2 < numBars - 1) {
    setColor(UNSELECTED, 0, start1);
    setColor(DEFAULT, start1, end2 + 1);
    setColor(UNSELECTED, end2 + 1, numBars);
  }
}

async function mergeAdjust(k, start, end) {
  if (start == 0 && end == numBars - 1) {
    setColor(DEFAULT, k + 1, end + 1);
    setColor(SORTED, k);
  } else {
    setColor(DEFAULT, start, end + 1);
    setColor(SWAPPING, k);
  }
}

async function findElement(start, end, i) {
  for (let index = start; index < end + 1; index++) {
    if (arr[index] == i) return index;
  }
}
