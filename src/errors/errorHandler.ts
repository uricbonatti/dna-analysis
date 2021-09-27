/* eslint-disable @typescript-eslint/no-explicit-any */
import { isCelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';

function errorHandler(
  err: any,
  request: Request,
  response: Response,
  _: NextFunction
) {
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body');
    const {
      details: [errorDetails]
    } = errorBody as any;
    return response.status(400).json({
      status: 'error',
      message: errorDetails.message.replace(/["]/g, "'")
    });
  }
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

export default errorHandler;
