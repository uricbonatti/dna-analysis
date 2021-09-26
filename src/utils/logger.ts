import { createLogger, transports, format } from 'winston';
import DaylyFiles from 'winston-daily-rotate-file';
import path from 'path';

import env from '../config/env';

const setTransports =
  env.NODE_ENV === 'test'
    ? []
    : [
        new DaylyFiles({
          filename: path.resolve(__dirname, '..', '..', 'logs', '%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize: '5m',
          maxFiles: '7d',
          zippedArchive: true
        })
      ];

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.simple(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      ({ timestamp, level, message }) =>
        `[${timestamp}] ${level.toUpperCase()} ${message}`
    )
  ),
  transports: setTransports
});

if (env.NODE_ENV !== 'production' && env.NODE_ENV !== 'test') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.simple(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(
          ({ timestamp, level, message }) =>
            `[${timestamp}] ${level.toUpperCase()} ${message}`
        )
      )
    })
  );
}

export default logger;
