require('dotenv').config();

module.exports = {
    port: parseInt(process.env.PORT || '8080', 10),
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1',
    maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '10', 10),
    jobTimeoutMs: parseInt(process.env.JOB_TIMEOUT_MS || '30000', 10)
}; 