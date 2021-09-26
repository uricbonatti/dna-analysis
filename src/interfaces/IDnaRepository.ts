import Dna from '../schemas/Dna';
import NewDna from './INewDna';

export default interface IDnaRepository {
  findByChain(chain: string): Promise<Dna | undefined>;
  create(data: NewDna): Promise<Dna>;
  list(): Promise<Dna[]>;
  count(isSimian: boolean): Promise<number>;
}
