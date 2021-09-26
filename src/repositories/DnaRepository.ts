import { MongoRepository } from 'typeorm';

import IDnaRepository from '../interfaces/IDnaRepository';

import Dna from '../schemas/Dna';
import NewDna from '../interfaces/INewDna';
import logger from './../utils/logger';
import getMongoRepository from './getMongoRepository';

class DnaRepository implements IDnaRepository {
  private odmRepository: MongoRepository<Dna>;
  constructor() {
    this.odmRepository = getMongoRepository(Dna);
  }

  public async count(isSimian: boolean): Promise<number> {
    logger.info(`[DnaRepository] - count - isSimian: ${isSimian}`);
    try {
      return await this.odmRepository.count({ is_simian: isSimian });
    } catch (err) {
      logger.error('[DnaRepository] - count - Error:', err);
      throw err;
    }
  }

  public async findByChain(chain: string): Promise<Dna | undefined> {
    logger.info(`[DnaRepository] - findByChain - DNA: ${chain}`);
    try {
      return await this.odmRepository.findOne({ dna_chain: chain });
    } catch (err) {
      logger.error('[DnaRepository] - create - Error:', err);
      throw err;
    }
  }

  public async create({ dna_chain, is_simian }: NewDna): Promise<Dna> {
    logger.info(`[DnaRepository] - create - DNA: ${dna_chain}`);
    try {
      const analysis = this.odmRepository.create({ dna_chain, is_simian });
      return await this.odmRepository.save(analysis);
    } catch (err) {
      logger.error('[DnaRepository] - create - Error:', err);
      throw err;
    }
  }

  public async list(): Promise<Dna[]> {
    logger.info('[DnaRepository] - list');
    try {
      return await this.odmRepository.find();
    } catch (err) {
      logger.error('[DnaRepository] - list - Error:', err);
      throw err;
    }
  }
}

export default DnaRepository;
