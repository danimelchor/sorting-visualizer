async function quickSort(first, last) {
  if (userPaused) {
    return;
  }

  if (first < last) {
    let split = await partition(first, last);
    await quickSort(first, split);
    await quickSort(split + 1, last);
  }

  // There is no way to know which elements are sorted until
  // the end, so when its done I turn it green
  if (first == 0 && last == numBars - 1 && !userPaused) {
    await sleep(animTime);
    setColor(SORTED, first, last + 1);
  }
}

async function partition(first, last) {
  let avg = Math.floor((first + last) / 2);
  let animPivot = avg; // Keeping track of where the pivot is
  let pivot = arr[avg];
  let i = first - 1;
  let j = last + 1;

  do {
    if (userPaused) {
      return;
    }

    do {
      i++;
      if (arr[i] < pivot) await countIncrease();
    } while (arr[i] < pivot);

    do {
      j--;
      if (arr[j] > pivot) await countIncrease();
    } while (arr[j] > pivot);

    if (i < j) {
      if (i == animPivot || j == animPivot) animPivot = animPivot == i ? j : i;

      swap(i, j);

      setColor(UNSELECTED, 0, first);
      setColor(UNSELECTED, last + 1, numBars);
      setColor(DEFAULT, first, last);
      setColor(SWAPPING, i);
      setColor(SWAPPING, j);
      setColor(PIVOT, animPivot);
      await sleep(animTime);
    }
  } while (i < j);
  return j;
}
