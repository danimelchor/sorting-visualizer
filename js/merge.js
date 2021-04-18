async function mergeSort(start, end) {
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
    if (j >= right.length || (i < left.length && left[i] < right[j])) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    await mergeAdjust(k, start1, end2);
    await sleep(animTime);
  }
  setColor(UNSELECTED, 0, start1);
  setColor(DEFAULT, start1, end2+1);
  setColor(UNSELECTED, end2+1, numBars);
}

async function mergeAdjust(k, start, end) {
  adjustHeight(k);

  setColor(DEFAULT, start, end+1);
  setColor(SWAPPING, k);

  await sleep(animTime);
}
