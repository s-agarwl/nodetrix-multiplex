// Clustering algorithms for NodeTrix-Multiplex
class Clustering {
  constructor() {
    this.matrixOps = new MatrixOperations();
  }

  // K-means clustering implementation
  kmeans(data, k, maxIterations = 100) {
    const n = data.length;
    const dimensions = data[0].length;

    // Initialize centroids randomly
    let centroids = Array(k)
      .fill()
      .map(() => {
        return Array(dimensions)
          .fill()
          .map(() => Math.random());
      });

    let clusters = new Array(n);
    let iterations = 0;
    let hasChanged = true;

    while (hasChanged && iterations < maxIterations) {
      hasChanged = false;
      iterations++;

      // Assign points to nearest centroid
      for (let i = 0; i < n; i++) {
        const point = data[i];
        let minDist = Infinity;
        let cluster = 0;

        for (let j = 0; j < k; j++) {
          const dist = this.euclideanDistance(point, centroids[j]);
          if (dist < minDist) {
            minDist = dist;
            cluster = j;
          }
        }

        if (clusters[i] !== cluster) {
          hasChanged = true;
          clusters[i] = cluster;
        }
      }

      // Update centroids
      const newCentroids = Array(k)
        .fill()
        .map(() => Array(dimensions).fill(0));
      const counts = Array(k).fill(0);

      for (let i = 0; i < n; i++) {
        const cluster = clusters[i];
        counts[cluster]++;
        for (let d = 0; d < dimensions; d++) {
          newCentroids[cluster][d] += data[i][d];
        }
      }

      for (let i = 0; i < k; i++) {
        if (counts[i] > 0) {
          for (let d = 0; d < dimensions; d++) {
            newCentroids[i][d] /= counts[i];
          }
        }
      }

      centroids = newCentroids;
    }

    return {
      clusters: clusters,
      centroids: centroids,
      iterations: iterations,
    };
  }

  // Fuzzy C-means clustering implementation
  cmeans(data, c, m = 2, epsilon = 0.01, maxIterations = 100) {
    const n = data.length;
    const dimensions = data[0].length;

    // Initialize membership matrix randomly
    let U = Array(n)
      .fill()
      .map(() => {
        const row = Array(c)
          .fill()
          .map(() => Math.random());
        const sum = row.reduce((a, b) => a + b, 0);
        return row.map((val) => val / sum);
      });

    let iterations = 0;
    let hasConverged = false;

    while (!hasConverged && iterations < maxIterations) {
      iterations++;

      // Calculate centroids
      const centroids = Array(c)
        .fill()
        .map(() => Array(dimensions).fill(0));
      const denominators = Array(c).fill(0);

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < c; j++) {
          const membership = Math.pow(U[i][j], m);
          denominators[j] += membership;
          for (let d = 0; d < dimensions; d++) {
            centroids[j][d] += membership * data[i][d];
          }
        }
      }

      for (let j = 0; j < c; j++) {
        for (let d = 0; d < dimensions; d++) {
          centroids[j][d] /= denominators[j];
        }
      }

      // Update membership matrix
      const newU = Array(n)
        .fill()
        .map(() => Array(c).fill(0));
      let maxChange = 0;

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < c; j++) {
          let sum = 0;
          const dij = this.euclideanDistance(data[i], centroids[j]);

          for (let k = 0; k < c; k++) {
            const dik = this.euclideanDistance(data[i], centroids[k]);
            sum += Math.pow(dij / dik, 2 / (m - 1));
          }

          newU[i][j] = 1 / sum;
          maxChange = Math.max(maxChange, Math.abs(newU[i][j] - U[i][j]));
        }
      }

      U = newU;
      hasConverged = maxChange < epsilon;
    }

    return {
      memberships: U,
      iterations: iterations,
    };
  }

  // Helper function to calculate Euclidean distance
  euclideanDistance(point1, point2) {
    return Math.sqrt(
      point1.reduce((sum, val, i) => sum + Math.pow(val - point2[i], 2), 0)
    );
  }

  // Louvain community detection (using existing jLouvain library)
  louvain(network) {
    const community = jLouvain().nodes(network.nodes).edges(network.edges);

    return community();
  }
}

// Export for use in other modules
window.Clustering = Clustering;
