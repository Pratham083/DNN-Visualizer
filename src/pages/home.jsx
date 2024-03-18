// svg
import { useState, useRef, useEffect } from 'react';
import { Model } from '../components/model';
import { NeuralNetwork } from '../utils/neural-network';
import './home.css';
import {
  generateCheckerData,
  generateParabolaData,
  generateXShapeData,
} from '../utils/data-functions';

function result(real, pred) {
  let matches = 0;
  for (let i = 0; i < real.length; i++) {
    if (real[i] === pred[i]) {
      matches += 1;
    }
  }
  return (matches / real.length) * 100;
}

export const Home = () => {
  // useState(input length, [hidden length(s)], output length)
  const [modelNodes, setModelNodes] = useState([2, 4, 4, 2]);

  const [trainingData, setTrainingData] = useState(generateCheckerData());

  const [nodeCoords, setNodeCoords] = useState([]);
  useEffect(() => {
    let tempCoords = [];
    // put this stuff in useEffect [modelNodes]
    let numLayers = modelNodes.length;
    let deltaX = 100 / numLayers;
    let xPercent = Math.floor(deltaX - deltaX / 2); // center the layers (ex: 33%, 66%, 99% -> 16%, 49%, 83%)

    // for each layer in model
    for (let layer = 0; layer < numLayers; layer++) {
      if (tempCoords[layer] === undefined) {
        tempCoords[layer] = [];
      }
      for (let i = 0; i < modelNodes[layer]; i++) {
        let yPercent = Math.floor(100 / (modelNodes[layer] + 1)) * (i + 1); // if 2 nodes, then the y percent would be 33%, 66%
        tempCoords[layer].push({
          key: `${layer}${i}`,
          position: [xPercent, yPercent],
        });
      }
      xPercent = Math.floor(xPercent + deltaX);
    }
    setNodeCoords(tempCoords);
  }, [modelNodes]);

  // maybe add img link after of data
  const dataFunctions = [
    { data: generateCheckerData, label: 'Checker (Easy)' },
    { data: generateParabolaData, label: 'Double Parabola (Medium)' },
    { data: generateXShapeData, label: 'X Shape (Hard)' },
  ];

  return (
    <>
      <p className="title">Neural Network Visualizer</p>
      <div>
        <p className="subtitle">Choose Training Data:</p>
        <form>
          {dataFunctions.map((obj, i) => {
            return (
              <div key={`radioDiv${i}`} className="inline-block">
                <input
                  type="radio"
                  key={`radio${i}`}
                  name="dataFunction"
                  id={obj.label}
                  onChange={() => {
                    setTrainingData(obj.data());
                  }}
                />
                <label key={`label${i}`} htmlFor={obj.label}>
                  {obj.label}
                </label>
              </div>
            );
          })}
        </form>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          className="padding-10px"
          onClick={() => {
            setModelNodes(() => {
              let newNodes = [...modelNodes];
              if (newNodes.length > 3) {
                newNodes.pop();
                newNodes[newNodes.length - 1] = 2;
              }
              return newNodes;
            });
          }}
        >
          -
        </button>
        <p className="padding-10px">{`${modelNodes.length} Layers`}</p>
        <button
          className="padding-10px"
          onClick={() => {
            setModelNodes(() => {
              let newNodes = [...modelNodes];
              if (modelNodes.length < 6) {
                newNodes.push(2);
                newNodes[newNodes.length - 2] = 4;
              }
              return newNodes;
            });
          }}
        >
          +
        </button>
      </div>
      <div className="center-header">
        {nodeCoords.map((layer, i) => {
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              key={`container${i}`}
            >
              <button
                className="padding-10px"
                onClick={() => {
                  setModelNodes(() => {
                    const newNodes = [...modelNodes];
                    if (newNodes[i] > 1) newNodes[i] -= 1;
                    return newNodes;
                  });
                }}
              >
                -
              </button>
              <p
                key={`p${i}`}
                className="padding-10px"
              >{`${modelNodes[i]} Neurons`}</p>
              <button
                className="padding-10px"
                onClick={() => {
                  setModelNodes(() => {
                    const newNodes = [...modelNodes];
                    if (newNodes[i] < 8) newNodes[i] += 1;
                    return newNodes;
                  });
                }}
                key={`plus${i}`}
              >
                +
              </button>
            </div>
          );
        })}
      </div>
      <Model
        nodeCoords={nodeCoords}
        layers={modelNodes}
        data={trainingData}
      ></Model>
    </>
  );
};
