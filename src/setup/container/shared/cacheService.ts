import { ICacheService } from "@domain/interfaces/ICacheService";
import { connectRedis } from "@infrastructure/database/redis/redisConnection";
import { CacheService } from "@infrastructure/services/CacheService";


const redisClient=await connectRedis();

export const cacheService:ICacheService=new CacheService(redisClient)