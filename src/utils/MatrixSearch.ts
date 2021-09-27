/* eslint-disable @typescript-eslint/no-var-requires */
import logger from './logger';

const matrixJS = require('matrix-js');

class MatrixSearch {
  private sequences: string[];

  public match(matrixData: string[], sequences: string[]) {
    logger.info('[MatrixSearch] - match');
    this.sequences = sequences;
    let chainMatched = 0;
    // Analise Horizontal
    const matchH = this.horizontalAnalysis(matrixData);
    chainMatched += matchH.length;
    // Analise Vertical
    const matchV = this.verticalAnalysis(matrixData);
    chainMatched += matchV.length;

    // Analise Diagonal Superior
    const matchDS = this.superiorDiagonalAnalysis(matrixData);
    chainMatched += matchDS.length;

    // Analise Diagonal Inferior
    const matchDI = this.inferiorDiagonalAnalysis(matrixData);
    chainMatched += matchDI.length;
    // Espelhamento da Cadeia
    const inverseDiagonalData = this.mirror(matrixData);
    // Analise Diagonal Superior Inversa
    const matchIDS = this.superiorDiagonalAnalysis(inverseDiagonalData);
    chainMatched += matchIDS.length;
    // Analise Diagonal Inferior Inversa
    const matchIDI = this.inferiorDiagonalAnalysis(inverseDiagonalData);
    chainMatched += matchIDI.length;
    logger.info(`[MatrixSearch] - match - Result: ${chainMatched}`);

    return chainMatched;
  }

  private horizontalAnalysis(data: string[]) {
    logger.info('[MatrixSearch] - horizontalAnalysis');

    return data.filter((seg) => {
      return this.sequences.filter((match) => seg.includes(match)).length;
    });
  }

  private verticalAnalysis(data: string[]) {
    logger.info('[MatrixSearch] - verticalAnalysis');

    const splitedData = data.map((seg) => seg.split(''));
    const dataSplitedTransposed: string[][] = matrixJS(splitedData).trans();
    const dataTrasposed = dataSplitedTransposed.map((line) => line.join(''));
    return this.horizontalAnalysis(dataTrasposed);
  }

  private superiorDiagonalAnalysis(data: string[]) {
    logger.info('[MatrixSearch] - superiorDiagonalAnalysis');

    const fragmentChainLength = data[0].length;
    const filledData = data.map((fragment) =>
      fragment.padEnd(fragmentChainLength + (fragmentChainLength - 1), '*')
    );
    const splitedData = filledData.map((seg) => seg.split(''));
    const diags = [];
    for (let i = 0; i < fragmentChainLength; i++) {
      diags.push([] as string[]);
    }
    for (let i = 0; i < fragmentChainLength; i++) {
      for (let j = 0; j < fragmentChainLength; j++) {
        diags[j].push(splitedData[i][i + j]);
      }
    }
    const diagsJoined = diags.map((line) => line.join('').replace(/[*]/g, ''));

    return this.horizontalAnalysis(diagsJoined);
  }

  private inferiorDiagonalAnalysis(data: string[]) {
    logger.info('[MatrixSearch] - inferiorDiagonalAnalysis');

    const splitedData = data.map((seg) => seg.split(''));
    const dataSplitedTransposed: string[][] = matrixJS(splitedData).trans();
    for (let i = 0; i < splitedData.length; i++) {
      dataSplitedTransposed[i][i] = '*';
    }
    const dataTrasposed = dataSplitedTransposed.map((line) => line.join(''));
    return this.superiorDiagonalAnalysis(dataTrasposed);
  }

  private mirror(data: string[]) {
    logger.info('[MatrixSearch] - mirror');

    const splitedData = data.map((seg) => seg.split(''));
    return splitedData.map((line) => [...line].reverse().join(''));
  }
}

export default MatrixSearch;
