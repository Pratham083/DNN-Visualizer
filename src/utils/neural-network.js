import { Utils } from './utils';

export class NeuralNetwork {
  /*
  inSize is the number of input neurons
  hiddenLayer is a 1D array, each value = number hiddenLayer neurons
  */
  constructor(inSize = 3, hiddenLayers = [4], outSize = 2) {
    this.input = new InputLayer(inSize);
    this.hidden = [];
    this.output = new OutputLayer(outSize);

    hiddenLayers.forEach((num) => this.hidden.push(new HiddenLayer(num)));
    this.initializeWeights();
  }
  fit(X, y, batchSize = 32, epochs = 100, lr = 0.1) {
    this.initializeWeights();
    this.printNN();
    // for each data
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let batch = 0; batch < Math.floor(X.length / batchSize); batch++) {
        let overallGradient;
        let overallBiasGradient;
        for (let i = 0; i < batchSize; i++) {
          this.input.neurons = Array.from(X[i + batch * batchSize]);
          this.forwardPass();
          // multiply the lr and 1/batchSize to get average
          let [updateGradients, biasGradients] = this.backwardsPass(
            y[i + batch * batchSize]
          );
          updateGradients = updateGradients.map((mat) => {
            return mat.map((vec) => {
              return vec.map((val) => (1 / batchSize) * lr * val);
            });
          });
          biasGradients = biasGradients.map((vec) => {
            return vec.map((val) => (1 / batchSize) * lr * val);
          });

          if (i === 0) {
            overallGradient = Array.from(updateGradients);
            overallBiasGradient = Array.from(biasGradients);
          } else {
            overallGradient = overallGradient.map((mat, ind) =>
              Utils.matrixAdd(mat, updateGradients[ind])
            );
            overallBiasGradient = overallBiasGradient.map((vec, ind1) => {
              return vec.map((val, ind2) => val + biasGradients[ind1][ind2]);
            });
          }
        }
        // update weights (matrix sum/subtract)
        this.input.weights = Utils.matrixSubtract(
          this.input.weights,
          overallGradient[0]
        );
        this.input.bias = this.input.bias.map(
          (val, ind) => val - overallBiasGradient[0][ind]
        );
        // subtract for each layer
        for (let layer = 0; layer < this.hidden.length; layer++) {
          this.hidden[layer].weights = Utils.matrixSubtract(
            this.hidden[layer].weights,
            overallGradient[layer + 1]
          );
          this.hidden[layer].bias = this.hidden[layer].bias.map(
            (val, ind) => val - overallBiasGradient[layer + 1][ind]
          );
        }
      }
      Utils.shuffle(X, y);
    }
  }

  epoch(X, y, batchSize = 32, lr = 0.01) {
    // in case batch too big
    if (batchSize > X.length) {
      batchSize = X.length;
    }
    for (let batch = 0; batch < Math.floor(X.length / batchSize); batch++) {
      let overallGradient;
      let overallBiasGradient;
      for (let i = 0; i < batchSize; i++) {
        this.input.neurons = Array.from(X[i + batch * batchSize]);
        this.forwardPass();
        // multiply the lr and 1/batchSize to get average
        let [updateGradients, biasGradients] = this.backwardsPass(
          y[i + batch * batchSize]
        );
        updateGradients = updateGradients.map((mat) => {
          return mat.map((vec) => {
            return vec.map((val) => (1 / batchSize) * lr * val);
          });
        });
        biasGradients = biasGradients.map((vec) => {
          return vec.map((val) => (1 / batchSize) * lr * val);
        });

        if (i === 0) {
          overallGradient = Array.from(updateGradients);
          overallBiasGradient = Array.from(biasGradients);
        } else {
          overallGradient = overallGradient.map((mat, ind) =>
            Utils.matrixAdd(mat, updateGradients[ind])
          );
          overallBiasGradient = overallBiasGradient.map((vec, ind1) => {
            return vec.map((val, ind2) => val + biasGradients[ind1][ind2]);
          });
        }
      }
      // update weights (matrix sum/subtract)
      this.input.weights = Utils.matrixSubtract(
        this.input.weights,
        overallGradient[0]
      );
      this.input.bias = this.input.bias.map(
        (val, ind) => val - overallBiasGradient[0][ind]
      );
      // subtract for each layer
      for (let layer = 0; layer < this.hidden.length; layer++) {
        this.hidden[layer].weights = Utils.matrixSubtract(
          this.hidden[layer].weights,
          overallGradient[layer + 1]
        );
        this.hidden[layer].bias = this.hidden[layer].bias.map(
          (val, ind) => val - overallBiasGradient[layer + 1][ind]
        );
      }
    }
    Utils.shuffle(X, y);
  }

  fitTest(X, y, batchSize = 2, epochs = 1, lr = 0.01) {
    this.initializeWeights();
    this.printNN();
    // for each data
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let batch = 0; batch < Math.floor(X.length / batchSize); batch++) {
        console.log('===========BATCH', batch, ':==============');
        let overallGradient;
        let overallBiasGradient;
        for (let i = 0; i < batchSize; i++) {
          console.log('===========PASS', i, ':==============');
          this.input.neurons = Array.from(X[i + batch * batchSize]);
          this.forwardPass();
          console.log('AFTER FORWARD PASS');
          this.printNN();
          // multiply the lr and 1/batchSize to get average
          let [updateGradients, biasGradients] = this.backwardsPass(
            y[i + batch * batchSize]
          );
          console.log(
            'AFTER BACKWARDS PASS update Gradients:',
            updateGradients
          );
          console.log('AFTER BACKWARDS PASS bias Gradients:', biasGradients);
          updateGradients = updateGradients.map((mat) => {
            return mat.map((vec) => {
              return vec.map((val) => (1 / batchSize) * lr * val);
            });
          });
          biasGradients = biasGradients.map((vec) => {
            return vec.map((val) => (1 / batchSize) * lr * val);
          });
          console.log(
            'AFTER LEARNING RATE update Gradients: ',
            updateGradients
          );
          console.log('AFTER LEARNING RATE bias Gradients: ', biasGradients);
          if (i === 0) {
            overallGradient = Array.from(updateGradients);
            overallBiasGradient = Array.from(biasGradients);
            console.log('overall Gradient: ', overallGradient);
            console.log('overall bias gradient: ', overallBiasGradient);
          } else {
            overallGradient = overallGradient.map((mat, ind) =>
              Utils.matrixAdd(mat, updateGradients[ind])
            );
            overallBiasGradient = overallBiasGradient.map((vec, ind1) => {
              return vec.map((val, ind2) => val + biasGradients[ind1][ind2]);
            });
            console.log('overall Gradient: ', overallGradient);
            console.log('overall bias gradient: ', overallBiasGradient);
          }
        }
        // update weights (matrix sum/subtract)
        this.input.weights = Utils.matrixSubtract(
          this.input.weights,
          overallGradient[0]
        );
        this.input.bias = this.input.bias.map(
          (val, ind) => val - overallBiasGradient[0][ind]
        );
        // subtract for each layer
        for (let layer = 0; layer < this.hidden.length; layer++) {
          this.hidden[layer].weights = Utils.matrixSubtract(
            this.hidden[layer].weights,
            overallGradient[layer + 1]
          );
          this.hidden[layer].bias = this.hidden[layer].bias.map(
            (val, ind) => val - overallBiasGradient[layer + 1][ind]
          );
        }
        this.printNN();
      }
      Utils.shuffle(X, y);
      console.log('data: ', X);
      console.log('labels: ', y);
    }
  }
  // computes the neuron values of neural network
  forwardPass() {
    let neurons = Utils.matrixVectorMul(this.input.weights, this.input.neurons); // calculate next layer's neurons
    neurons = neurons.map((val, ind) => val + this.input.bias[ind]);
    for (let i = 0; i < this.hidden.length; i++) {
      this.hidden[i].neurons = Array.from(neurons.map(Utils.sigmoid)); // apply sigmoid, need shallow copy?
      neurons = Utils.matrixVectorMul(
        this.hidden[i].weights,
        this.hidden[i].neurons
      );
      neurons = neurons.map((val, ind) => val + this.hidden[i].bias[ind]);
    }
    this.output.neurons = Array.from(Utils.softmax(neurons)); // probability of each class
  }

  // assumes one-hot-encoded y if sparse = false
  backwardsPass(y, sparse = true) {
    let weightGradients = [];
    let biasGradients = [];
    // derivative of output neuron before softmax with respect to CE loss (simple equation)
    let outGradient = Array.from(this.output.neurons);
    if (sparse) {
      outGradient[y] -= 1;
    } else {
      for (let i = 0; i < y.length; i++) {
        outGradient[i] = this.output.neurons[i] - y[i];
      }
    }
    weightGradients.unshift(
      Utils.outerProduct(
        outGradient,
        this.hidden[this.hidden.length - 1].neurons
      )
    );
    biasGradients.unshift(outGradient);
    // get the partial derivatives of the inputs of previous hidden layers (before applying activation) starting from the last
    let nextLayerGradient = Array.from(outGradient);
    for (let i = this.hidden.length - 1; i >= 0; i--) {
      let nextPartial = Utils.matrixVectorMulTranspose(
        this.hidden[i].weights,
        nextLayerGradient
      );
      // derivative raw input to sigmoid output
      const sigmoidPartial = this.hidden[i].neurons.map(
        (s_i) => s_i * (1 - s_i)
      );
      // derivative raw input to cost
      const thisLayerGradient = sigmoidPartial.map(
        (val, ind) => val * nextPartial[ind]
      );
      // get weight derivative (just multiply by previous activation)
      if (i != 0) {
        weightGradients.unshift(
          Utils.outerProduct(thisLayerGradient, this.hidden[i - 1].neurons)
        );
      } else {
        weightGradients.unshift(
          Utils.outerProduct(thisLayerGradient, this.input.neurons)
        );
      }
      biasGradients.unshift(thisLayerGradient);
      nextLayerGradient = Array.from(thisLayerGradient);
    }
    return [weightGradients, biasGradients];
  }

  // initializes weights and biases randomly
  initializeWeights() {
    let weights = [];
    // there is at least 1 hidden layer
    if (this.hidden.length > 0) {
      // input layer
      for (let i = 0; i < this.input.neurons.length; i++) {
        weights.push(
          Utils.genRandomNormal(0, 0.5, this.hidden[0].neurons.length)
        );
      }
      this.input.bias = Utils.genRandom(-1, 1, this.hidden[0].neurons.length);
      this.input.weights = Array.from(weights);
      weights = [];

      // hidden layers
      for (let i = 0; i < this.hidden.length; i++) {
        let nextLayerLen = 0;
        if (i < this.hidden.length - 1) {
          nextLayerLen = this.hidden[i + 1].neurons.length;
        } else {
          nextLayerLen = this.output.neurons.length;
        }
        for (let j = 0; j < this.hidden[i].neurons.length; j++) {
          weights.push(Utils.genRandomNormal(0, 0.5, nextLayerLen));
        }
        this.hidden[i].bias = Utils.genRandom(-1, 1, nextLayerLen);
        this.hidden[i].weights = Array.from(weights);
        weights = [];
      }
    }
  }
  predict(X) {
    let predictions = [];
    for (let i = 0; i < X.length; i++) {
      this.input.neurons = Array.from(X[i]);
      this.forwardPass();
      predictions.push(
        this.output.neurons.indexOf(Math.max(...this.output.neurons))
        //this.output.neurons
      );
    }
    return predictions;
  }
  addHidden(numNeurons) {
    this.hidden.push(new HiddenLayer(numNeurons));
    this.initializeWeights();
  }
  printNN() {
    console.log('Input neurons', this.input.neurons);
    console.log('Input bias', this.input.bias);
    console.log('Input weights', this.input.weights);
    console.log('Hidden neurons: ', this.hidden[0].neurons);
    console.log('Hidden bias: ', this.hidden[0].bias);
    console.log('Hidden weights', this.hidden[0].weights);
    console.log('Output Neurons', this.output.neurons);
  }
}

export class InputLayer {
  constructor(size) {
    this.neurons = new Array(size).fill(0);
    this.weights = []; // size = this.neurons.size * next.neurons.size
    this.bias = [];
  }
}

export class HiddenLayer {
  constructor(size, activation = Utils.sigmoid) {
    this.neurons = new Array(size).fill(0); // with some size, the values will be the inputs of data
    this.weights = []; // size = this.neurons.size * next.neurons.size
    this.bias = [];
    this.activation = activation;
  }
}

export class OutputLayer {
  constructor(size) {
    this.neurons = new Array(size).fill(0);
  }
}
