import MatrixSearch from '../../../src/utils/MatrixSearch';

let matrixSearch: MatrixSearch;
const sequences = ['AAAA', 'TTTT', 'CCCC', 'GGGG'];
describe('Matrix Search', () => {
  beforeEach(() => {
    matrixSearch = new MatrixSearch();
  });
  it('should be found 5 sequences on matrix on match', async () => {
    const chain = ['AAAAC', 'TGAGC', 'CTGAC', 'CGTGC', 'GACTG'];
    const matches = matrixSearch.match(chain, sequences);
    expect(matches).toEqual(5);
  });
  it('should be found 1 sequences on matrix on match', async () => {
    const chain = ['AAAA', 'TGGG', 'TTGA', 'TGTG'];
    const matches = matrixSearch.match(chain, sequences);
    expect(matches).toEqual(1);
  });
});
