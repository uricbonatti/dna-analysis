import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import AnalysisController from '../controllers/AnalysisController';

const analysisController = new AnalysisController();

const analysisRouter = Router();

analysisRouter.post(
  '/simian',
  celebrate({
    [Segments.BODY]: {
      dna: Joi.array()
        .items(
          Joi.string()
            .regex(/^[acgtACGT]*$/)
            .min(4)
            .required()
        )
        .min(4)
        .required()
    }
  }),
  analysisController.analysis
);
analysisRouter.get('/stats/list', analysisController.list);
analysisRouter.get('/stats', analysisController.stats);

export default analysisRouter;
