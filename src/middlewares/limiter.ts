/* eslint-disable @typescript-eslint/no-explicit-any */
import rateLimiter from 'express-rate-limit';
import env from '../config/env';

const errorMessage = {
  status: 'error',
  message: `Too many requests from this IP, please try again after ${env.MINUTES_RESEND_REQUEST} minutes`
};
const limiter = rateLimiter({
  windowMs: Number(env.MINUTES_RESEND_REQUEST) * 60 * 1000,
  max: Number(env.MAX_REQUESTS),
  statusCode: 429,
  message: errorMessage as any
});

export default limiter;
