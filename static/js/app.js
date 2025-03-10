// Main application logic for NodeTrix-Multiplex
class App {
  constructor() {
    this.predictor = new Predictor();
    this.matrixOps = new MatrixOperations();
    this.clustering = new Clustering();
    this.data = {};
    this.visualization = new MatrixVisualization();
  }

  // Initialize the application
  async init() {
    try {
      // Load data
      await this.loadData();

      // Initialize visualization
      this.initVisualization();

      // Set up event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error("Error initializing application:", error);
      document.getElementById("visualization").innerHTML =
        '<div class="alert alert-danger">Error loading data. Please check the console for details.</div>';
    }
  }

  // Load all required data
  async loadData() {
    try {
      // Initialize predictor with loaded data
      await this.predictor.loadData();

      // Perform initial predictions
      this.data.predicted = this.predictor.predict();

      // Extract nodes from the predicted data
      this.data.nodes = this.extractNodes();

      // Create edges from predicted data
      this.data.edges = this.createEdgesFromPredicted();
    } catch (error) {
      console.error("Error loading data:", error);
      throw error;
    }
  }

  // Create edges array from predicted matrix
  createEdgesFromPredicted() {
    const edges = [];
    if (this.data.predicted) {
      Object.entries(this.data.predicted).forEach(([source, targets]) => {
        Object.entries(targets).forEach(([target, weight]) => {
          if (weight > 0) {
            edges.push({
              source: source,
              target: target,
              weight: weight,
            });
          }
        });
      });
    }
    return edges;
  }

  // Extract unique nodes from the data
  extractNodes() {
    const nodeSet = new Set();

    // Add nodes from predicted data
    if (this.data.predicted) {
      Object.keys(this.data.predicted).forEach((node) => {
        nodeSet.add(node);
        Object.keys(this.data.predicted[node]).forEach((target) => {
          nodeSet.add(target);
        });
      });
    }

    return Array.from(nodeSet);
  }

  // Initialize the visualization
  initVisualization() {
    try {
      // Convert adjacency list to matrix format
      const nodes = this.data.nodes;
      const nodeToIndex = new Map(nodes.map((node, index) => [node, index]));

      // Create matrix representation
      const matrixSize = nodes.length;
      const matrix = Array(matrixSize)
        .fill()
        .map(() => Array(matrixSize).fill(0));
      const dissMatrix = Array(matrixSize)
        .fill()
        .map(() => Array(matrixSize).fill(0));

      // Fill matrices
      Object.entries(this.data.predicted).forEach(([source, targets]) => {
        const i = nodeToIndex.get(source);
        Object.entries(targets).forEach(([target, weight]) => {
          const j = nodeToIndex.get(target);
          if (i !== undefined && j !== undefined) {
            matrix[i][j] = weight;
            matrix[j][i] = weight; // Symmetric matrix

            // Calculate dissimilarity
            const maxWeight = Math.max(...Object.values(targets));
            const dissimilarity = maxWeight > 0 ? 1 - weight / maxWeight : 1;
            dissMatrix[i][j] = dissimilarity;
            dissMatrix[j][i] = dissimilarity;
          }
        });
      });

      // Create label data
      const labels = nodes.map((node, index) => ({
        id: index,
        name: node,
      }));

      // Format data for visualization
      const visData = [
        {
          matrixData: [matrix],
          dissimilarityMatrix: [dissMatrix],
          eigenMatrix: [matrix.map((row) => [...row])], // Copy matrix for now
          rowLabels: labels,
          columnLabels: labels,
          nodes: nodes.map((node) => ({ id: node, name: node })),
          links: this.data.edges,
        },
      ];

      // Debug output
      console.log("Visualization data:", {
        matrixSize,
        nodes: nodes.length,
        edges: this.data.edges.length,
        matrix: matrix.length,
        dissMatrix: dissMatrix.length,
        labels: labels.length,
        sampleMatrix: matrix[0] ? matrix[0].slice(0, 5) : null,
        sampleDissMatrix: dissMatrix[0] ? dissMatrix[0].slice(0, 5) : null,
      });

      // Initialize the visualization
      this.visualization(visData, "visualization");
    } catch (error) {
      console.error("Error initializing visualization:", error);
      console.error("Data state:", {
        nodes: this.data.nodes,
        edges: this.data.edges,
        predicted: this.data.predicted,
      });
      document.getElementById("visualization").innerHTML =
        '<div class="alert alert-warning">Error initializing visualization. Please check the console for details.</div>';
    }
  }

  // Set up event listeners for user interactions
  setupEventListeners() {
    // Clustering method selection
    document.querySelectorAll("[data-clustering-method]").forEach((button) => {
      button.addEventListener("click", (e) => {
        const method = e.target.dataset.clusteringMethod;
        this.handleClusteringMethod(method);
      });
    });

    // Visualization options
    const updateOption = (option, value) => {
      if (typeof updateVisualizationOption === "function") {
        updateVisualizationOption(option, value);
      }
    };

    // Node size slider
    const nodeSizeSlider = document.getElementById("nodeSize");
    if (nodeSizeSlider) {
      nodeSizeSlider.addEventListener("input", (e) => {
        updateOption("nodeSize", parseFloat(e.target.value));
      });
    }

    // Link strength slider
    const linkStrengthSlider = document.getElementById("linkStrength");
    if (linkStrengthSlider) {
      linkStrengthSlider.addEventListener("input", (e) => {
        updateOption("linkStrength", parseFloat(e.target.value));
      });
    }
  }

  // Handle clustering method selection
  async handleClusteringMethod(method) {
    try {
      let clusters;
      const data = this.prepareDataForClustering();

      switch (method) {
        case "kmeans":
          clusters = this.clustering.kmeans(
            data,
            Config.clustering.defaultK,
            Config.clustering.maxIterations
          );
          break;
        case "cmeans":
          clusters = this.clustering.cmeans(
            data,
            Config.clustering.defaultK,
            Config.clustering.fuzziness,
            Config.clustering.epsilon,
            Config.clustering.maxIterations
          );
          break;
        case "louvain":
          const network = this.prepareNetworkForLouvain();
          clusters = this.clustering.louvain(network);
          break;
        default:
          console.error("Unknown clustering method:", method);
          return;
      }

      // Update visualization with new clustering
      this.updateVisualizationClusters(clusters);
    } catch (error) {
      console.error("Error in clustering:", error);
    }
  }

  // Prepare data for clustering algorithms
  prepareDataForClustering() {
    const { matrix, nodes } = this.matrixOps.adjacencyListToMatrix(
      this.data.predicted
    );
    return matrix;
  }

  // Prepare network data for Louvain community detection
  prepareNetworkForLouvain() {
    return {
      nodes: this.data.nodes.map((id) => ({ id })),
      edges: this.data.edges,
    };
  }

  // Update visualization with new clustering results
  updateVisualizationClusters(clusters) {
    if (typeof updateVisualizationWithClusters === "function") {
      updateVisualizationWithClusters(clusters);
    } else {
      console.error("Visualization update function not found");
    }
  }
}

// Initialize application when document is ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
  app.init().catch((error) => {
    console.error("Error starting application:", error);
  });
});
