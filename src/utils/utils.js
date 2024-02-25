export class Utils {
  static matrixSubtract(m1, m2) {
    let result = m1.map((vector, i) => {
      return vector.map((num, j) => {
        return num - m2[i][j];
      });
    });

    return result;
  }

  // ROUGH VALIDATED
  static matrixAdd(m1, m2) {
    let result = m1.map((vector, i) => {
      return vector.map((num, j) => {
        return num + m2[i][j];
      });
    });

    return result;
  }

  //  WORKS
  // assumes each inner array is a column for convenience
  // also assumes a matrix vector multiplication
  // ROUGH VALIDATED
  static matrixVectorMul(A, x) {
    let b = new Array(A[0].length).fill(0);
    for (let row = 0; row < A[0].length; row++) {
      for (let col = 0; col < A.length; col++) {
        b[row] += A[col][row] * x[col];
      }
    }
    return b;
  }

  // change b[col] to b[row], should work now
  // ROUGH VALIDATED
  static matrixVectorMulTranspose(A, x) {
    let b = new Array(A.length).fill(0);
    for (let row = 0; row < A.length; row++) {
      for (let col = 0; col < A[0].length; col++) {
        b[row] += A[row][col] * x[col];
      }
    }
    return b;
  }

  // each inner array is a column in a matrix
  static outerProduct(v1, v2) {
    let matrix = [];
    for (let i = 0; i < v2.length; i++) {
      matrix.push(new Array());
      for (let j = 0; j < v1.length; j++) {
        matrix[i][j] = v1[j] * v2[i];
      }
    }
    return matrix;
  }

  // activation functions
  static sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  static softmax(arr) {
    // to prevent integer overflow (make all numbers <=0)
    const max = Math.max(...arr);
    const expArr = arr.map((x) => Math.exp(x - max));
    // apply softmax
    const sumExp = expArr.reduce((sum, num) => sum + num, 0);
    return expArr.map((x) => x / sumExp);
  }
  // same as cross entropy loss but yTrue is index of class instead of vector
  static sparseCrossEntropyLoss(yTrue, yPred) {
    // negative summation of yTrue * log (pred), but simplified bc all yTrue are 0 except for 1
    const small = 1e-8; // prevent log (0)
    return -Math.log(Math.max(yPred[yTrue], small));
  }

  static crossEntropyLoss(yTrue, yPred) {
    // negative summation of yTrue * log (pred), but simplified bc all yTrue are 0 except for 1
    const small = 1e-8; // prevent log (0)
    const ind = yTrue.indexOf(1);
    return -Math.log(Math.max(yPred[ind], small));
  }

  // for weights initialization (normal distribution)
  // returns a 1D array
  static genRandomNormal(mean, stddev, howMany) {
    let weights = [];
    for (let i = 0; i < Math.floor(howMany / 2); i++) {
      const u1 = Math.random();
      const u2 = Math.random();

      // uniform to standard normal
      let z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      let z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);

      // standard normal to normal with some standard deviation and mean
      z0 = z0 * stddev + mean;
      z1 = z1 * stddev + mean;

      weights.push(z0);
      weights.push(z1);
    }
    if (howMany % 2 == 1) {
      weights.push(0);
    }
    return weights;
  }

  static genRandom(min, max, len) {
    const range = Math.abs(max - min);
    const values = new Array(len).fill(0);
    for (let i = 0; i < len; i++) {
      values[i] = range * Math.random() + min;
    }
    return values;
  }

  static shuffle(X, y) {
    for (let i = X.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // rand num from (0, 1) * i+1 will give rand index to swap
      const temp = Array.from(X[i]); // pass by value since x[i] is array
      X[i] = Array.from(X[j]);
      X[j] = temp;

      const temp2 = y[i];
      y[i] = y[j];
      y[j] = temp2;
    }
  }
}
