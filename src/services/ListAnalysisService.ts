import { inject, injectable } from 'tsyringe';
import IDnaRepository from './../interfaces/IDnaRepository';
import Dna from '../schemas/Dna';
import logger from '../utils/logger';

@injectable()
class ListAnalysisService {
  constructor(
    @inject('DnaRepository')
    private dnaRepository: IDnaRepository
  ) {}

  public async run(): Promise<Dna[]> {
    logger.info('[ListAnalysisService] - run');
    return this.dnaRepository.list();
  }
}

export default ListAnalysisService;
