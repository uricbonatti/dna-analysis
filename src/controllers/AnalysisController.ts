import { Request, Response } from 'express';
import logger from '../utils/logger';
import { container } from 'tsyringe';
import SimianAnalysisService from '../services/SimianAnalysisService';
import AnalysisStatsService from '../services/AnalysisStatsService';
import ListAnalysisService from './../services/ListAnalysisService';

class AnalysisController {
  public async analysis(req: Request, res: Response): Promise<Response> {
    const dnaChain = req.body.dna;
    logger.info(`[AnalysisController] - analysis - DNA: ${dnaChain.join(' ')}`);
    try {
      const simianAnalysis = container.resolve(SimianAnalysisService);
      const result = await simianAnalysis.run(dnaChain);
      return res.status(201).json(result);
    } catch (err) {
      logger.error('[AnalysisController] - analysis - Error:', err);
      throw err;
    }
  }

  public async stats(_: Request, res: Response): Promise<Response> {
    logger.info('[AnalysisController] - stats}');
    try {
      const analysisStats = container.resolve(AnalysisStatsService);
      const result = await analysisStats.run();
      return res.status(200).json(result);
    } catch (err) {
      logger.error('[AnalysisController] - stats - Error:', err);
      throw err;
    }
  }

  public async list(_: Request, res: Response): Promise<Response> {
    logger.info('[AnalysisController] - stats}');
    try {
      const listAnalysis = container.resolve(ListAnalysisService);
      const result = await listAnalysis.run();
      return res.status(200).json(result);
    } catch (err) {
      logger.error('[AnalysisController] - list - Error:', err);
      throw err;
    }
  }
}

export default AnalysisController;
