async function insertSort() {
  for (let i = 1; i < numBars; i++) {
    let copy = arr[i];
    let replaceIndex = 0;
    let temp = [...arr];

    setColor(PIVOT, i);

    for (let j = i - 1; j >= 0; j--) {
      if (userPaused) {
        return;
      }

      if (arr[j] < copy) {
        replaceIndex = j + 1;
        break;
      } else {
        temp[j + 1] = temp[j];
      }
      await countIncrease();

      setColor(SORTED, 0, i);
      setColor(SWAPPING, j);
      await sleep(animTime);
    }

    temp[replaceIndex] = copy;
    arr = temp;
    for (let i = 0; i < numBars; i++) {
      adjustHeight(i);
    }
  }
}
