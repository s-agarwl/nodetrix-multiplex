// Matrix operations for NodeTrix-Multiplex
class MatrixOperations {
  constructor() {
    // Initialize math.js for advanced matrix operations
    this.math = math;
  }

  // Convert adjacency list to matrix format
  adjacencyListToMatrix(adjList) {
    const nodes = new Set();
    Object.keys(adjList).forEach((key) => {
      nodes.add(key);
      Object.keys(adjList[key]).forEach((target) => nodes.add(target));
    });

    const nodeArray = Array.from(nodes);
    const size = nodeArray.length;
    const matrix = Array(size)
      .fill()
      .map(() => Array(size).fill(0));
    const nodeIndex = new Map(nodeArray.map((node, index) => [node, index]));

    Object.entries(adjList).forEach(([source, targets]) => {
      const i = nodeIndex.get(source);
      Object.entries(targets).forEach(([target, weight]) => {
        const j = nodeIndex.get(target);
        matrix[i][j] = weight;
        matrix[j][i] = weight; // Assuming undirected graph
      });
    });

    return {
      matrix: matrix,
      nodes: nodeArray,
    };
  }

  // Calculate Laplacian matrix
  calculateLaplacian(adjMatrix) {
    const n = adjMatrix.length;
    const D = Array(n)
      .fill()
      .map(() => Array(n).fill(0)); // Degree matrix
    const L = Array(n)
      .fill()
      .map(() => Array(n).fill(0)); // Laplacian matrix

    // Calculate degree matrix
    for (let i = 0; i < n; i++) {
      D[i][i] = adjMatrix[i].reduce((sum, val) => sum + val, 0);
    }

    // Calculate Laplacian matrix (L = D - A)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        L[i][j] = D[i][j] - adjMatrix[i][j];
      }
    }

    return L;
  }

  // Calculate normalized Laplacian
  calculateNormalizedLaplacian(adjMatrix) {
    const n = adjMatrix.length;
    const D = Array(n)
      .fill()
      .map(() => Array(n).fill(0)); // Degree matrix
    const L = Array(n)
      .fill()
      .map(() => Array(n).fill(0)); // Normalized Laplacian

    // Calculate degree matrix
    for (let i = 0; i < n; i++) {
      D[i][i] = adjMatrix[i].reduce((sum, val) => sum + val, 0);
    }

    // Calculate normalized Laplacian
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j && D[i][i] !== 0) {
          L[i][j] = 1;
        } else if (adjMatrix[i][j] !== 0) {
          L[i][j] = -adjMatrix[i][j] / Math.sqrt(D[i][i] * D[j][j]);
        }
      }
    }

    return L;
  }

  // Calculate eigenvalues and eigenvectors
  calculateEigenDecomposition(matrix) {
    // Convert to math.js matrix format
    const M = this.math.matrix(matrix);

    try {
      // Use math.js eigs function (if available) or numerical approximation
      const result = this.math.eigs(M);
      return {
        eigenvalues: result.values,
        eigenvectors: result.vectors,
      };
    } catch (error) {
      console.error("Error in eigendecomposition:", error);
      return null;
    }
  }

  // Helper function to normalize a matrix
  normalizeMatrix(matrix) {
    const n = matrix.length;
    const normalized = Array(n)
      .fill()
      .map(() => Array(n).fill(0));

    // Find max value
    let maxVal = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        maxVal = Math.max(maxVal, Math.abs(matrix[i][j]));
      }
    }

    // Normalize
    if (maxVal > 0) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          normalized[i][j] = matrix[i][j] / maxVal;
        }
      }
    }

    return normalized;
  }
}

// Export for use in other modules
window.MatrixOperations = MatrixOperations;
