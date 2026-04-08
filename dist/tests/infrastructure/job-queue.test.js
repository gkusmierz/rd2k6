"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const job_queue_1 = require("@/infrastructure/job-queue");
(0, vitest_1.describe)("InProcessJobQueue", () => {
    let queue;
    (0, vitest_1.beforeEach)(() => {
        queue = new job_queue_1.InProcessJobQueue({ maxRetries: 3 });
    });
    (0, vitest_1.it)("enqueues and processes a job with registered handler", async () => {
        const handler = vitest_1.vi.fn().mockResolvedValue(undefined);
        queue.registerHandler("thumbnail", handler);
        await queue.enqueue("thumbnail", { photoId: "123" });
        await queue.processAll();
        (0, vitest_1.expect)(handler).toHaveBeenCalledWith({ photoId: "123" }, vitest_1.expect.any(Number));
    });
    (0, vitest_1.it)("processes jobs in FIFO order", async () => {
        const order = [];
        const handler = async (data) => {
            order.push(data.id);
        };
        queue.registerHandler("task", handler);
        await queue.enqueue("task", { id: "first" });
        await queue.enqueue("task", { id: "second" });
        await queue.enqueue("task", { id: "third" });
        await queue.processAll();
        (0, vitest_1.expect)(order).toEqual(["first", "second", "third"]);
    });
    (0, vitest_1.it)("retries failed jobs up to maxRetries", async () => {
        let attempts = 0;
        const handler = async () => {
            attempts++;
            if (attempts < 3)
                throw new Error("fail");
        };
        queue.registerHandler("retry-test", handler);
        await queue.enqueue("retry-test", {});
        await queue.processAll();
        (0, vitest_1.expect)(attempts).toBe(3);
    });
    (0, vitest_1.it)("marks job as failed after exhausting retries", async () => {
        const handler = async () => {
            throw new Error("always fails");
        };
        queue.registerHandler("fail-test", handler);
        await queue.enqueue("fail-test", { id: "bad" });
        const failures = await queue.processAll();
        (0, vitest_1.expect)(failures).toHaveLength(1);
        (0, vitest_1.expect)(failures[0].jobType).toBe("fail-test");
    });
    (0, vitest_1.it)("returns empty failures when all jobs succeed", async () => {
        const handler = vitest_1.vi.fn().mockResolvedValue(undefined);
        queue.registerHandler("ok", handler);
        await queue.enqueue("ok", {});
        const failures = await queue.processAll();
        (0, vitest_1.expect)(failures).toHaveLength(0);
    });
    (0, vitest_1.it)("throws when no handler registered for job type", async () => {
        await queue.enqueue("unknown", {});
        const failures = await queue.processAll();
        (0, vitest_1.expect)(failures).toHaveLength(1);
    });
    (0, vitest_1.it)("pendingCount returns the number of pending jobs", async () => {
        queue.registerHandler("x", vitest_1.vi.fn().mockResolvedValue(undefined));
        (0, vitest_1.expect)(queue.pendingCount()).toBe(0);
        await queue.enqueue("x", {});
        await queue.enqueue("x", {});
        (0, vitest_1.expect)(queue.pendingCount()).toBe(2);
        await queue.processAll();
        (0, vitest_1.expect)(queue.pendingCount()).toBe(0);
    });
});
//# sourceMappingURL=job-queue.test.js.map