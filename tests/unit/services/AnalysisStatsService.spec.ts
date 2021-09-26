import 'reflect-metadata';
import AnalysisStatsService from '../../../src/services/AnalysisStatsService';
import FakeDnaRepository from '../../mocks/FakeDnaRepository';
import { ObjectId } from 'mongodb';

let service: AnalysisStatsService;
let fakeDnaRepository: FakeDnaRepository;

describe('Analysis Stats Service', () => {
  beforeEach(() => {
    fakeDnaRepository = new FakeDnaRepository();
    service = new AnalysisStatsService(fakeDnaRepository);
  });

  it('should be able to return the ratio and counts of simian over humans', async () => {
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
    const stats = await service.run();
    expect(stats).toEqual({
      count_human_dna: 1,
      count_simian_dna: 1,
      ratio: 1
    });
  });
  it('should be able to return the ratio and counts of simian over humans', async () => {
    const dnas = [
      {
        dna_chain: 'GGGGG',
        is_simian: true,
        id: new ObjectId('61507e5259550a3bd459f866')
      }
    ];
    fakeDnaRepository.dnaAnalysis = dnas;
    const stats = await service.run();
    expect(stats).toEqual({
      count_human_dna: 0,
      count_simian_dna: 1,
      ratio: undefined
    });
  });

  it('should capture the error and throw when it occurs', async () => {
    FakeDnaRepository.prototype.count = () => {
      throw new Error('Erro Simulado');
    };
    await expect(service.run()).rejects.toThrowError();
  });
});
