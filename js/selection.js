async function selectionSort() {
  for (let index = 0; index < numBars - 1; index++) {
    let smallest = index;
    setColor(PIVOT, smallest);

    for (let x = index + 1; x < numBars; x++) {
      if (userPaused) {
        return;
      }

      setColor(SWAPPING, x);
      if (arr[smallest] > arr[x]) {
        setColor(DEFAULT, smallest);
        smallest = x;
        setColor(PIVOT, smallest);
      }

      await countIncrease();

      if (x - 1 != smallest) setColor(DEFAULT, x - 1);
      await sleep(animTime);
    }

    swap(index, smallest);
    setColor(SORTED, 0, index);
    setColor(DEFAULT, index + 1, numBars);
  }

  await sleep(animTime);
  setColor(SORTED, 0, numBars);
}
