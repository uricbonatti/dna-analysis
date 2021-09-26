import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';

import corsConfig from '../config/corsConfig';
import analysisRouter from '../routes/analysisRouter';
import AppError from '../errors/AppError';

function app() {
  const expressApp = express();

  expressApp.use(cors(corsConfig));
  expressApp.use(express.json());
  expressApp.use(analysisRouter);

  expressApp.use(errors());

  expressApp.use(
    (err: Error, request: Request, response: Response, _: NextFunction) => {
      if (err instanceof AppError) {
        return response
          .status(err.statusCode)
          .json({ status: 'error', message: err.message });
      }
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error.'
      });
    }
  );
  return expressApp;
}

export default app();
