require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const config = require('./config');
const MultiChainQRService = require('./service');

const app = express();
const service = new MultiChainQRService();

const jobs = new Map();

app.use(cors());
app.use(express.json());
app.use(express.static('src'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view.html'));
});

app.get('/config', (req, res) => {
    res.json({
        port: config.port,
        host: config.host
    });
});

app.get('/input_schema', (req, res) => {
    res.json({
        type: 'object',
        properties: {
            input: {
                type: 'string',
                description: 'Natural language input describing the Ethereum payment (e.g., "Generate a QR code for 0.05 ETH payment to 0x123... with label \'Consulting\'")',
                required: true
            }
        }
    });
});

app.get('/availability', (req, res) => {
    const maxJobs = process.env.MAX_CONCURRENT_JOBS || 10;
    res.json({
        available: jobs.size < maxJobs,
        current_jobs: jobs.size,
        max_jobs: maxJobs
    });
});

app.post('/start_job', async (req, res) => {
    const jobId = crypto.randomUUID();
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({ error: 'Input is required' });
    }

    jobs.set(jobId, {
        status: 'processing',
        startTime: Date.now(),
        input
    });

    processJob(jobId, input);

    res.json({
        job_id: jobId,
        status: 'processing'
    });
});

app.get('/status/:jobId', (req, res) => {
    const job = jobs.get(req.params.jobId);
    
    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
        status: job.status,
        error: job.error
    });
});

app.get('/result/:jobId', (req, res) => {
    const job = jobs.get(req.params.jobId);
    
    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status === 'processing') {
        return res.status(202).json({ status: 'processing' });
    }

    if (job.status === 'failed') {
        return res.status(500).json({ error: job.error });
    }

    res.json(job.result);
});

async function processJob(jobId, input) {
    try {
        const result = await service.processJob(input);
        jobs.set(jobId, {
            status: 'completed',
            result,
            completionTime: Date.now()
        });

        setTimeout(() => {
            jobs.delete(jobId);
        }, process.env.JOB_TIMEOUT_MS || 30000);
    } catch (error) {
        jobs.set(jobId, {
            status: 'failed',
            error: error.message,
            completionTime: Date.now()
        });
    }
}

function startServer(port) {
    try {
        const server = app.listen(port, config.host, () => {
            console.log(`Crypto Payments QR Code Generator Service running on http://${config.host}:${port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is in use, trying ${port + 1}`);
                startServer(port + 1);
            } else {
                console.error('Server error:', err);
                process.exit(1);
            }
        });

        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Closing server...');
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer(config.port); 