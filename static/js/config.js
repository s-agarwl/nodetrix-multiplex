// Configuration for NodeTrix-Multiplex
const Config = {
  // Data paths
  dataPaths: {
    adjacencyMatrix: "static/dataSets/infovis/AdjacencyMatrices.csv",
    dissimilarityMatrix: "static/dataSets/infovis/DissimilarityMatrices.csv",
    edges: "static/dataSets/infovis/Edges.csv",
    layer3: "static/dataSets/infovis/layer3edges.csv",
  },

  // Clustering settings
  clustering: {
    defaultK: 6,
    maxIterations: 100,
    epsilon: 0.01,
    fuzziness: 2,
  },

  // Visualization settings
  visualization: {
    width: 1920,
    height: 1200,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    nodeSize: 10,
    linkStrength: 1,
    charge: -30,
  },
};

// Export for use in other modules
window.Config = Config;
