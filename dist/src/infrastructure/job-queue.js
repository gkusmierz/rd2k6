"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InProcessJobQueue = void 0;
class InProcessJobQueue {
    handlers = new Map();
    queue = [];
    maxRetries;
    constructor(options) {
        this.maxRetries = options.maxRetries;
    }
    registerHandler(jobType, handler) {
        this.handlers.set(jobType, handler);
    }
    async enqueue(jobType, data) {
        this.queue.push({ type: jobType, data, attempts: 0 });
    }
    async processAll() {
        const failures = [];
        while (this.queue.length > 0) {
            const job = this.queue.shift();
            const handler = this.handlers.get(job.type);
            if (!handler) {
                failures.push({
                    jobType: job.type,
                    data: job.data,
                    error: new Error(`No handler registered for job type: ${job.type}`),
                });
                continue;
            }
            let succeeded = false;
            let lastError = null;
            while (job.attempts < this.maxRetries && !succeeded) {
                job.attempts++;
                try {
                    await handler(job.data, job.attempts);
                    succeeded = true;
                }
                catch (e) {
                    lastError = e;
                }
            }
            if (!succeeded && lastError) {
                failures.push({ jobType: job.type, data: job.data, error: lastError });
            }
        }
        return failures;
    }
    pendingCount() {
        return this.queue.length;
    }
}
exports.InProcessJobQueue = InProcessJobQueue;
//# sourceMappingURL=job-queue.js.map