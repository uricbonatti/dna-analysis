import { inject, injectable } from 'tsyringe';
import IDnaRepository from './../interfaces/IDnaRepository';
import Dna from '../schemas/Dna';
import logger from '../utils/logger';
import MatrixSearch from '../utils/MatrixSearch';
import AppError from './../errors/AppError';

@injectable()
class SimianAnalysisService {
  constructor(
    @inject('DnaRepository')
    private dnaRepository: IDnaRepository
  ) {}

  public async run(dna: string[]): Promise<Partial<Dna>> {
    try {
      dna.forEach((chain) => {
        if (chain.length !== dna.length) {
          throw new AppError('DNA matrix must be NxN', 400);
        }
      });
      const dnaChainString = dna.join('').toUpperCase();
      logger.info(`[SimianAnalysisService] - run - DNA: ${dnaChainString}`);
      const dnaExists = await this.dnaRepository.findByChain(dnaChainString);
      if (dnaExists) {
        return { is_simian: dnaExists.is_simian };
      }
      const sequences = ['AAAA', 'TTTT', 'CCCC', 'GGGG'];
      const sequencesMatched = MatrixSearch.match(dna, sequences);

      const savedAnalysis = await this.dnaRepository.create({
        dna_chain: dnaChainString,
        is_simian: sequencesMatched >= 2
      });
      return { is_simian: savedAnalysis.is_simian };
    } catch (err) {
      logger.error('[SimianAnalysisService] - run - Error:', err);
      throw err;
    }
  }
}

export default SimianAnalysisService;
