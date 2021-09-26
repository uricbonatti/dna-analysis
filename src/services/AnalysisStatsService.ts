import { inject, injectable } from 'tsyringe';
import logger from '../utils/logger';
import IDnaRepository from './../interfaces/IDnaRepository';

interface Stats {
  count_simian_dna: number;
  count_human_dna: number;
  ratio: number | undefined;
}

@injectable()
class AnalysisStatsService {
  constructor(
    @inject('DnaRepository')
    private dnaRepository: IDnaRepository
  ) {}

  public async run(): Promise<Stats> {
    logger.info('[AnalysisStatsService] - run');
    try {
      const simians = await this.dnaRepository.count(true);
      const humans = await this.dnaRepository.count(false);
      let ratio: number | undefined = 0;
      if (humans === 0) {
        ratio = undefined;
      } else {
        ratio = simians / humans;
      }
      return {
        count_human_dna: humans,
        count_simian_dna: simians,
        ratio: ratio
      };
    } catch (err) {
      logger.error('[AnalysisStatsService] - run - Error:', err);
      throw err;
    }
  }
}

export default AnalysisStatsService;
