async function quickSort(first, last) {
  if (userPaused) {
    return;
  }

  if (first < last) {
    let split = await partition(first, last);
    await quickSort(first, split);
    await quickSort(split + 1, last);
  }

  if (first == 0 && last == numBars - 1 && !userPaused) {
    await sleep(animTime*2);
    setColor(SORTED, first, last + 1);
  }
}

async function partition(first, last) {
  let avg = Math.floor((first + last) / 2);
  let animPivot = avg;
  let pivot = arr[avg];
  let i = first - 1;
  let j = last + 1;

  do {
    if (userPaused) {
      return;
    }

    do {
      i++;
      await countIncrease();
    } while (arr[i] < pivot);

    do {
      j--;
      await countIncrease();
    } while (arr[j] > pivot);

    counter -= 2;

    if (i < j) {
      if (i == animPivot || j == animPivot) animPivot = animPivot == i ? j : i;

      swap(i, j);

      setColor(UNSELECTED, 0, first);
      setColor(UNSELECTED, last+1, numBars);
      setColor(DEFAULT, first, last);
      setColor(SWAPPING, i);
      setColor(SWAPPING, j);
      setColor(PIVOT, animPivot);
      await sleep(animTime);
    }
  } while (i < j);
  return j;
}
