import { NeuralNetwork } from '../utils/neural-network';

function generateSampleData() {
  const numSamples = 10000;
  const dataX = []; // coordinates
  const dataY = []; // label

  for (let i = 0; i < numSamples; i++) {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    let label;

    if (x <= 0 && y >= 0) {
      label = 0;
    } else if (x >= 0 && y <= 0) {
      label = 0;
    } else if (x > 0 && y > 0) {
      label = 1;
    } else {
      label = 1;
    }

    dataX.push([x, y]);
    dataY.push(label);
  }

  return [dataX, dataY];
}

function result(real, pred) {
  let matches = 0;
  for (let i = 0; i < real.length; i++) {
    if (real[i] === pred[i]) {
      matches += 1;
    }
  }
  return (matches / real.length) * 100;
}

export const Model = () => {
  let nn = new NeuralNetwork();

  return <div>model</div>;
};
