import { useState, useRef, useEffect } from 'react';
import { NeuralNetwork } from '../utils/neural-network';
import Neuron from './neuron';
import Weight from './weight';
import Grid from './predict-grid';
import './model.css';

// assumes only 2 inputs (because of prediction grid)
// can implement to add more inputs with feature engineering in future

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
const predictGrid = (neuralNet, len, threeInput) => {
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
    predictGrid(nnRef.current, 15)
  );
  const trainingState = useRef('Start');
  const [playButtonState, setPlayButtonState] = useState(trainingState.current);

  const fit = async (X, y, epochs) => {
    if (trainingState.current === 'Running') {
      trainingState.current = 'Paused';
      return;
    } else if (trainingState.current === 'Start') {
      nnRef.current.initializeWeights();
    }
    trainingState.current = 'Running';
    const delay = () => new Promise((resolve) => setTimeout(resolve, 0));
    let count = 0; // later replace with epoch useState
    while (trainingState.current === 'Running') {
      nnRef.current.epoch(X, y, 32, 1);
      count++;
      if (count > 10000) {
        break;
      }
      // canvas state thing and create seperate component
      setModelParams(deepCopyWeights(nnRef.current));
      setModelNeurons(deepCopyActivation(nnRef.current));
      setPredictions(predictGrid(nnRef.current, 15));
      await delay();
    }
  };

  const restart = () => {
    trainingState.current = 'Start';
    nnRef.current.initializeWeights();
    setModelParams(deepCopyWeights(nnRef.current));
    setModelNeurons(deepCopyActivation(nnRef.current));
    setPredictions(predictGrid(nnRef.current, 15));
  };

  return (
    <>
      <div>
        <button
          onClick={() => fit(data[0], data[1], 1000)}
          className="button-margin"
        >
          {trainingState.current === 'Running' ? 'Pause' : 'Train'}
        </button>
        <button onClick={() => restart()} className="button-margin">
          Restart
        </button>
      </div>
      <svg width="800" height="400">
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
