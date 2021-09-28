export default {
  PORT: process.env.PORT || 8000,
  DB_URL: process.env.DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  MAX_REQUESTS: process.env.MAX_REQUESTS || 60,
  MINUTES_RESEND_REQUEST: process.env.MINUTES_RESEND_REQUEST || 5
};
