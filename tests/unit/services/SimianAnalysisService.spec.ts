import 'reflect-metadata';
import FakeDnaRepository from '../../mocks/FakeDnaRepository';
import { ObjectId } from 'mongodb';
import SimianAnalysisService from '../../../src/services/SimianAnalysisService';
import AppError from './../../../src/errors/AppError';

let service: SimianAnalysisService;
let fakeDnaRepository: FakeDnaRepository;

describe('Simian Analysis Service', () => {
  beforeEach(() => {
    fakeDnaRepository = new FakeDnaRepository();
    service = new SimianAnalysisService(fakeDnaRepository);
  });

  it('should throw an AppError when chain dna have an inconsistence sizes', async () => {
    const dnaChain = ['AAAA', 'AAAAA', 'AAAA', 'CCCA'];
    await expect(service.run(dnaChain)).rejects.toBeInstanceOf(AppError);
  });
  it('should if dna chain is registered should return previous analisys result', async () => {
    const dnaChain = ['AAAA', 'AAAA', 'AAAA', 'CCCA'];
    fakeDnaRepository.dnaAnalysis.push({
      dna_chain: dnaChain.join(''),
      is_simian: true,
      id: new ObjectId()
    });
    const analisysResult = await service.run(dnaChain);
    expect(analisysResult).toEqual({ is_simian: true });
  });
  it('should if dna chain is not registered should realize the analisys and if 2 matchs or more be found return it is a simian dna', async () => {
    const dnaChain = ['AAAA', 'AAAA', 'AAAA', 'CCCA'];
    const analisysResult = await service.run(dnaChain);
    expect(analisysResult).toEqual({ is_simian: true });
  });
  it('should if dna chain is not registered should realize the analisys and if dont have 2 matchs found return it isnt a simian dna', async () => {
    const dnaChain = ['AACA', 'ACAA', 'AATA', 'CCCG'];
    const analisysResult = await service.run(dnaChain);
    expect(analisysResult).toEqual({ is_simian: false });
  });
});
