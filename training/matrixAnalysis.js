const matrix = require("matrix-js");

const sequences = ["AAAA", "TTTT", "CCCC", "GGGG"];

const test1 = ["AAAAC", "TGAGC", "CTGAC", "CGTGC", "GACTG"];

function horizontalAnalysis(data) {
  return data.filter((seg) => {
    return sequences.filter((match) => seg.includes(match)).length;
  });
}
function verticalAnalysis(data) {
  const splitedData = data.map((seg) => seg.split(""));
  const dataSplitedTransposed = matrix(splitedData).trans();
  const dataTrasposed = dataSplitedTransposed.map((line) => line.join(""));
  return horizontalAnalysis(dataTrasposed);
}

function superiorDiagonalAnalysis(data) {
  const fragmentChainLength = data[0].length;
  const filledData = data.map((fragment) =>
    fragment.padEnd(fragmentChainLength + (fragmentChainLength - 1), "*")
  );
  const splitedData = filledData.map((seg) => seg.split(""));
  const diags = [];
  for (let i = 0; i < fragmentChainLength; i++) {
    diags.push([]);
  }
  for (let i = 0; i < fragmentChainLength; i++) {
    for (let j = 0; j < fragmentChainLength; j++) {
      diags[j].push(splitedData[i][i + j]);
    }
  }
  const diagsJoined = diags.map((line) => line.join("").replace(/[*]/g, ""));

  return horizontalAnalysis(diagsJoined);
}

function inferiorDiagonalAnalysis(data) {
  const splitedData = data.map((seg) => seg.split(""));
  const dataSplitedTransposed = matrix(splitedData).trans();
  for (let i = 0; i < splitedData.length; i++) {
    dataSplitedTransposed[i][i] = "*";
  }
  const dataTrasposed = dataSplitedTransposed.map((line) => line.join(""));
  return superiorDiagonalAnalysis(dataTrasposed);
}

function mirror(data) {
  const splitedData = data.map((seg) => seg.split(""));
  return splitedData.map((line) => line.reverse().join(""));
}

function analysis() {
  let chainMatched = 0;
  //Analise Horizontal
  const matchH = horizontalAnalysis(test1);
  chainMatched += matchH.length;
  //Analise Vertical
  const matchV = verticalAnalysis(test1);
  chainMatched += matchV.length;

  //Analise Diagonal Superior
  const matchDS = superiorDiagonalAnalysis(test1);
  chainMatched += matchDS.length;

  //Analise Diagonal Inferior
  const matchDI = inferiorDiagonalAnalysis(test1);
  chainMatched += matchDI.length;
  // Espelhamento da Cadeia
  const inverseDiagonalData = mirror(test1);
  //Analise Diagonal Superior Inversa
  const matchIDS = superiorDiagonalAnalysis(inverseDiagonalData);
  chainMatched += matchIDS.length;
  //Analise Diagonal Inferior Inversa
  const matchIDI = inferiorDiagonalAnalysis(inverseDiagonalData);
  chainMatched += matchIDI.length;
  console.log(chainMatched);
}
analysis();
