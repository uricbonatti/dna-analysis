import MatrixSearch from '../../../src/utils/MatrixSearch';

const sequences = ['AAAA', 'TTTT', 'CCCC', 'GGGG'];
describe('Matrix Search', () => {
  it('should be found 5 sequences on matrix on match', async () => {
    const matrix = ['AAAAC', 'TGAGC', 'CTGAC', 'CGTGC', 'GACTG'];
    const matches = MatrixSearch.match(matrix, sequences);
    expect(matches).toEqual(5);
  });
});
