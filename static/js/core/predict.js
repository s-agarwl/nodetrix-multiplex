// Prediction logic for NodeTrix-Multiplex
class Predictor {
  constructor() {
    this.coauthor = {};
    this.cocitation = {};
    this.authortopic = {};
    this.predicted = {};
  }

  // Load data from files
  async loadData() {
    try {
      // Load the matrix files as text instead of CSV
      const responses = await Promise.all([
        fetch(Config.dataPaths.adjacencyMatrix),
        fetch(Config.dataPaths.dissimilarityMatrix),
        fetch(Config.dataPaths.layer3),
      ]);

      const [coauthorText, cocitationText, authortopicText] = await Promise.all(
        responses.map((response) => response.text())
      );

      // Convert text data to matrices
      if (coauthorText) this.coauthor = this.parseMatrixFile(coauthorText);
      if (cocitationText)
        this.cocitation = this.parseMatrixFile(cocitationText);
      if (authortopicText)
        this.authortopic = this.parseMatrixFile(authortopicText);

      console.log("Loaded matrices:", {
        coauthor: this.coauthor,
        cocitation: this.cocitation,
        authortopic: this.authortopic,
      });
    } catch (error) {
      console.error("Error loading prediction data:", error);
      throw error;
    }
  }

  // Parse the custom matrix file format
  parseMatrixFile(fileContent) {
    if (!fileContent) {
      console.error("Empty file content");
      return {};
    }

    const matrix = {};
    const lines = fileContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 4) {
      console.error("Invalid matrix file format - not enough lines:", lines);
      return matrix;
    }

    try {
      // Parse dimensions - now handling three numbers (rows, cols, threshold)
      const dimensionParts = lines[0]
        .split(",")
        .map((n) => parseFloat(n.trim()));
      if (dimensionParts.length < 2) {
        console.error("Invalid dimensions line:", lines[0]);
        return matrix;
      }
      const rows = Math.floor(dimensionParts[0]);
      const cols = Math.floor(dimensionParts[1]);
      const threshold = dimensionParts[2] || 0; // Optional threshold value

      console.log("Parsing matrix with dimensions:", { rows, cols, threshold });

      // Parse row labels
      const rowLabels = this.parseLabels(lines[1]);
      if (rowLabels.length !== rows) {
        console.warn(
          `Row labels count (${rowLabels.length}) doesn't match dimensions (${rows})`
        );
      }

      // Parse column labels
      const colLabels = this.parseLabels(lines[2]);
      if (colLabels.length !== cols) {
        console.warn(
          `Column labels count (${colLabels.length}) doesn't match dimensions (${cols})`
        );
      }

      // Parse matrix values
      const matrixValues = lines.slice(3).map((line) => {
        const values = line.split(",").map((val) => parseFloat(val.trim()));
        if (values.length !== cols) {
          console.warn(
            `Matrix row length (${values.length}) doesn't match column count (${cols})`
          );
        }
        return values;
      });

      if (matrixValues.length !== rows) {
        console.warn(
          `Matrix rows count (${matrixValues.length}) doesn't match dimensions (${rows})`
        );
      }

      // Convert to adjacency list format
      rowLabels.forEach((rowLabel, i) => {
        if (!rowLabel || !rowLabel.label) {
          console.warn(`Invalid row label at index ${i}`);
          return;
        }

        matrix[rowLabel.label] = {};

        colLabels.forEach((colLabel, j) => {
          if (!colLabel || !colLabel.label) {
            console.warn(`Invalid column label at index ${j}`);
            return;
          }

          if (i < matrixValues.length && j < matrixValues[i].length) {
            const value = matrixValues[i][j];
            // Only include values above threshold
            if (!isNaN(value) && value > threshold) {
              matrix[rowLabel.label][colLabel.label] = value;
            }
          }
        });
      });

      console.log("Parsed matrix:", {
        rowCount: rowLabels.length,
        colCount: colLabels.length,
        nodeCount: Object.keys(matrix).length,
        sampleNode: Object.keys(matrix)[0]
          ? {
              node: Object.keys(matrix)[0],
              connections: Object.keys(matrix[Object.keys(matrix)[0]]).length,
            }
          : null,
      });

      return matrix;
    } catch (error) {
      console.error("Error parsing matrix file:", error);
      console.error("File content:", fileContent);
      return {};
    }
  }

  // Parse labels in format "label, id, label, id, ..."
  parseLabels(line) {
    if (!line) {
      console.error("Empty labels line");
      return [];
    }

    try {
      const parts = line
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
      const labels = [];

      for (let i = 0; i < parts.length; i += 2) {
        if (i + 1 >= parts.length) {
          console.warn(`Incomplete label pair at index ${i}`);
          break;
        }

        const label = parts[i];
        const id = parseInt(parts[i + 1]);

        if (!label || isNaN(id)) {
          console.warn(`Invalid label pair: "${parts[i]}, ${parts[i + 1]}"`);
          continue;
        }

        labels.push({ label, id });
      }

      return labels;
    } catch (error) {
      console.error("Error parsing labels:", error);
      console.error("Line content:", line);
      return [];
    }
  }

  // Predict relationships based on maximum value across matrices
  predict() {
    this.predicted = {};

    // Get all unique nodes
    const nodes = new Set([
      ...Object.keys(this.coauthor),
      ...Object.keys(this.cocitation),
      ...Object.keys(this.authortopic),
    ]);

    // For each pair of nodes
    nodes.forEach((key1) => {
      this.predicted[key1] = {};

      nodes.forEach((key2) => {
        if (key1 === key2) return;

        // Get values from each matrix, defaulting to 0 if not present
        const coauthorValue =
          (this.coauthor[key1] && this.coauthor[key1][key2]) || 0;
        const cocitationValue =
          (this.cocitation[key1] && this.cocitation[key1][key2]) || 0;
        const authortopicValue =
          (this.authortopic[key1] && this.authortopic[key1][key2]) || 0;

        // Take maximum value
        this.predicted[key1][key2] = Math.max(
          parseInt(coauthorValue) || 0,
          parseInt(cocitationValue) || 0,
          parseInt(authortopicValue) || 0
        );
      });
    });

    return this.predicted;
  }

  // Get predicted values
  getPredictedMatrix() {
    return this.predicted;
  }
}

// Export for use in other modules
window.Predictor = Predictor;
