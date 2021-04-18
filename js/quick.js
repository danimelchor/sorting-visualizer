async function quickSort(first, last) {
  if (first < last) {
    let split = await partition(first, last);
    await quickSort(first, split);
    await quickSort(split + 1, last);
  }

  if (first == 0 && last == numBars - 1) {
    await sleep(animTime*2);
    setColor(DEFAULT, first, last + 1);
  }
}

async function partition(first, last) {
  let avg = Math.floor((first + last) / 2);
  let animPivot = avg;
  let pivot = arr[avg];
  let i = first - 1;
  let j = last + 1;

  do {
    do {
      i++;
    } while (arr[i] < pivot);
    do {
      j--;
    } while (arr[j] > pivot);

    if (i < j) {
      if (i == animPivot || j == animPivot) animPivot = animPivot == i ? j : i;

      swap(i, j);

      setColor(UNSELECTED, 0, first);
      setColor(UNSELECTED, last, numBars);
      setColor(DEFAULT, first, last);
      setColor(SWAPPING, i);
      setColor(SWAPPING, j);
      setColor(PIVOT, animPivot);
      await sleep(animTime);
    }
  } while (i < j);
  return j;
}
