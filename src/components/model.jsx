import { useState, useRef, useEffect } from 'react';
import { NeuralNetwork } from '../utils/neural-network';
import Neuron from './neuron';
import Weight from './weight';
import Grid from './predict-grid';

const deepCopyWeights = (neuralNet) => {
  const copyArr = [
    neuralNet.input.weights.map((arr) => Array.from(arr)),
    ...neuralNet.hidden.map((layer) =>
      layer.weights.map((arr) => Array.from(arr))
    ),
  ];
  return copyArr;
};

const deepCopyActivation = (neuralNet) => {
  const copyArr = [
    [...neuralNet.input.neurons],
    ...neuralNet.hidden.map((layer) => [...layer.neurons]),
    [...neuralNet.output.neurons],
  ];
  return copyArr;
};

// note: len is grid length in terms of number of predictions (x or y, should be square)
const predictGrid = (neuralNet, len) => {
  const step = 1 / len;
  const X = Array.from({ length: len }, (_, i) => {
    return Array.from({ length: len }, (_, j) => [i * step, j * step]);
  });

  const predictions = Array.from({ length: len }, (_, i) => {
    return Array.from({ length: len }, (_, j) => {
      neuralNet.input.neurons = [...X[i][j]];
      neuralNet.forwardPass();
      return [...neuralNet.output.neurons];
    });
  });

  return predictions;
};

export const Model = ({ nodeCoords, layers, data }) => {
  const nnRef = useRef(
    new NeuralNetwork(
      layers[0],
      layers.slice(1, layers.length - 1),
      layers[layers.length - 1]
    )
  );

  // need to be reinstantiated everytime layers change
  useEffect(() => {
    nnRef.current = new NeuralNetwork(
      layers[0],
      layers.slice(1, layers.length - 1),
      layers[layers.length - 1]
    );
    setModelParams(deepCopyWeights(nnRef.current));
    setModelNeurons(deepCopyActivation(nnRef.current));
  }, [layers]);

  const [modelParams, setModelParams] = useState(
    deepCopyWeights(nnRef.current)
  );
  const [modelNeurons, setModelNeurons] = useState(
    deepCopyActivation(nnRef.current)
  );
  const [predictions, setPredictions] = useState(
    predictGrid(nnRef.current, 20)
  );

  const fit = async (X, y, epochs) => {
    const delay = () => new Promise((resolve) => setTimeout(resolve, 0));
    nnRef.current.initializeWeights();
    for (let i = 0; i < epochs; i++) {
      nnRef.current.epoch(X, y, 32, 0.1);
      // canvas state thing and create seperate component
      setModelParams(deepCopyWeights(nnRef.current));
      setModelNeurons(deepCopyActivation(nnRef.current));
      setPredictions(predictGrid(nnRef.current, 20));
      await delay();
    }
  };

  return (
    <>
      <div>
        <button onClick={() => fit(data[0], data[1], 300)}>Train</button>
      </div>
      <svg width="1000" height="500">
        {nodeCoords.slice(0, nodeCoords.length - 1).map((layer, i) => {
          return layer.map((coord, j) => {
            return nodeCoords[i + 1].map((nextCoord, k) => {
              return (
                <Weight
                  key={`${coord.key}${nextCoord.key}`}
                  start={coord.position}
                  end={nextCoord.position}
                  value={modelParams[i][j][k]}
                ></Weight>
              );
            });
          });
        })}
        {nodeCoords.map((layer, i) => {
          return layer.map((coord, j) => {
            return (
              <Neuron
                key={coord.key}
                cx={coord.position[0]}
                cy={coord.position[1]}
                activation={modelNeurons[i][j]}
              ></Neuron>
            );
          });
        })}
      </svg>
      <Grid predictions={predictions} />
    </>
  );
};
