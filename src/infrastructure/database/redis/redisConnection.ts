import { createClient, RedisClientType } from "redis";
let redisClient: RedisClientType;

export async function connectRedis(): Promise<RedisClientType> {
    try{
        redisClient = createClient({
            url: process.env.REDIS_URL,
        });
        redisClient.on("connect", () => {
            console.log("Connected to Redis");
        });

        redisClient.on("error", (err) => {
            console.error("Redis error:", err);
        });

        await redisClient.connect();
        return redisClient;
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        process.exit(1)
    }
}


