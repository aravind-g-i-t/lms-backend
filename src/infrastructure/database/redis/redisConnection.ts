import { logger } from "@infrastructure/logging/Logger";
import { createClient, RedisClientType } from "redis";
let redisClient: RedisClientType;

export async function connectRedis(): Promise<RedisClientType> {
    try{
        redisClient = createClient({
            url: process.env.REDIS_URL,
        });
        redisClient.on("connect", () => {
            logger.info("Connected to Redis");
        });

        redisClient.on("error", () => {
            logger.error("Redis error");
        });

        await redisClient.connect();
        return redisClient;
    } catch  {
        logger.error("Failed to connect to Redis.");
        process.exit(1)
    }
}








