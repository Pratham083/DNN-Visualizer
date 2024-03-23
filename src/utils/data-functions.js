export function generateCheckerData() {
  const numSamples = 5000;
  const dataX = []; // coordinates
  const dataY = []; // label

  for (let i = 0; i < numSamples; i++) {
    const x = Math.random();
    const y = Math.random();
    let label;

    if (x <= 0.5 && y >= 0.5) {
      label = 0;
    } else if (x >= 0.5 && y <= 0.5) {
      label = 0;
    } else if (x > 0.5 && y > 0.5) {
      label = 1;
    } else {
      label = 1;
    }

    dataX.push([x, y]);
    dataY.push(label);
  }

  return [dataX, dataY];
}

export function generateXShapeData() {
  const numSamples = 5000;
  const dataX = []; // coordinates
  const dataY = []; // label

  const inX = (x, y, xShapeWidth) => {
    const negSlantLower = (x) => -x + 1 - xShapeWidth;
    const negSlantUpper = (x) => -x + 1 + xShapeWidth;

    const posSlantLower = (x) => x - xShapeWidth;
    const posSlantUpper = (x) => x + xShapeWidth;

    const inNegSlant = y > negSlantLower(x) && y < negSlantUpper(x);
    const inPosSlant = y > posSlantLower(x) && y < posSlantUpper(x);

    return inPosSlant || inNegSlant;
  };

  for (let i = 0; i < numSamples; i++) {
    const x = Math.random();
    const y = Math.random();
    let label;

    if (inX(x, y, 0.1)) {
      label = 0;
    } else {
      label = 1;
    }
    dataX.push([x, y]);
    dataY.push(label);
  }

  return [dataX, dataY];
}

export function generateParabolaData() {
  const numSamples = 5000;
  const dataX = []; // coordinates
  const dataY = []; // label

  const porabolaUp = (x) => {
    return (x - 0.5) ** 2 + 0.25;
  };
  const porabolaDown = (x) => {
    return -1 * (x - 0.5) ** 2 + 0.75;
  };

  for (let i = 0; i < numSamples; i++) {
    const x = Math.random();
    const y = Math.random();
    let label;

    if (y < porabolaDown(x) && y > porabolaUp(x)) {
      label = 0;
    } else {
      label = 1;
    }
    dataX.push([x, y]);
    dataY.push(label);
  }

  return [dataX, dataY];
}
