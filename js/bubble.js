async function bubbleSort() {
  for (let i = 0; i < numBars; i++) {
    for (let j = 0; j < numBars - i - 1; j++) {
      if (arr[j + 1] < arr[j]) {
        swap(j, j + 1);
      }
      setColor(DEFAULT, 0, numBars - i);
      setColor(SWAPPING, j);
      setColor(SWAPPING, j + 1);
      await sleep(animTime);
    }
    setColor(SORTED, numBars - i - 1, numBars);
  }

  await sleep(animTime * 2);
  setColor(DEFAULT, 0, numBars);
}
