const rateLimitMap = new Map();
const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 1000;
export const rateLimitMiddleware = (socket, next) => {
    const userId = socket.user?.id;
    if (!userId)
        return next();
    const now = Date.now();
    const userLimit = rateLimitMap.get(userId);
    if (!userLimit || now > userLimit.resetTime) {
        rateLimitMap.set(userId, { count: 1, resetTime: now + WINDOW_MS });
        return next();
    }
    if (userLimit.count >= RATE_LIMIT) {
        return next(new Error("Rate limit exceeded"));
    }
    userLimit.count++;
    next();
};
