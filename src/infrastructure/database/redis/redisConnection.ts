import { logger } from "@infrastructure/logging/Logger";
import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType;

export async function connectRedis(): Promise<void> {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL,
            socket: { tls: true },
        }) as RedisClientType;

        redisClient.on("connect", () => {
            logger.info("Connected to Redis");
        });

        redisClient.on("error", (err) => {
            logger.error(`Redis error: ${err.message}`);
        });

        await redisClient.connect();
    } catch (err: any) {
        logger.error(`Failed to connect to Redis: ${err.message}`);

    }
}

export function getRedisClient(): RedisClientType {
    if (!redisClient) throw new Error("Redis not connected");
    return redisClient;
}
