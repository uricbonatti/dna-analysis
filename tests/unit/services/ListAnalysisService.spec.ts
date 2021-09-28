import 'reflect-metadata';
import ListAnalysisService from '../../../src/services/ListAnalysisService';
import FakeDnaRepository from '../../mocks/FakeDnaRepository';
import { ObjectId } from 'mongodb';

let service: ListAnalysisService;
let fakeDnaRepository: FakeDnaRepository;

describe('List Analysis Service', () => {
  beforeEach(() => {
    fakeDnaRepository = new FakeDnaRepository();
    service = new ListAnalysisService(fakeDnaRepository);
  });

  it('should be able to list the analysed dna chains', async () => {
    const dnas = [
      {
        dna_chain: 'AAAAA',
        is_simian: false,
        id: new ObjectId('61507e3259550a3bd459f864')
      },
      {
        dna_chain: 'GGGGG',
        is_simian: true,
        id: new ObjectId('61507e5259550a3bd459f866')
      }
    ];
    fakeDnaRepository.dnaAnalysis = dnas;
    const listedDnas = await service.run();
    expect(listedDnas).toEqual(dnas);
  });
});
