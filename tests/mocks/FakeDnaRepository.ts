import INewDna from '../../src/interfaces/INewDna';
import Dna from '../../src/schemas/Dna';
import IDnaRepository from '../../src/interfaces/IDnaRepository';
import { ObjectId } from 'mongodb';

class FakeDnaRepository implements IDnaRepository {
  dnaAnalysis: Dna[] = [];
  public async findByChain(chain: string): Promise<Dna | undefined> {
    return this.dnaAnalysis.find((data) => data.dna_chain === chain);
  }

  public async create(data: INewDna): Promise<Dna> {
    const dna = new Dna();
    dna.id = new ObjectId();
    dna.dna_chain = data.dna_chain;
    dna.is_simian = data.is_simian;

    this.dnaAnalysis.push(dna);
    return dna;
  }

  public async list(): Promise<Dna[]> {
    return this.dnaAnalysis;
  }

  public async count(isSimian: boolean): Promise<number> {
    return this.dnaAnalysis.filter((dna) => dna.is_simian === isSimian).length;
  }
}

export default FakeDnaRepository;
