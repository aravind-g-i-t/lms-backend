import { logger } from "@infrastructure/logging/Logger";
import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType;

export async function connectRedis(): Promise<void> {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL,
        }) as RedisClientType;

        redisClient.on("connect", () => {
            logger.info("Connected to Redis");
        });

        redisClient.on("error", () => {
            logger.error("Redis error");
        });

        await redisClient.connect();
    } catch {
        logger.error("Failed to connect to Redis.");
        return process.exit(1);
    }
}

export function getRedisClient(): RedisClientType {
    if (!redisClient) throw new Error("Redis not connected");
    return redisClient;
}
