import { ICacheService } from "@domain/interfaces/ICacheService";
import { getRedisClient } from "@infrastructure/database/redis/redisConnection";
import { logger } from "@infrastructure/logging/Logger";


export class CacheService implements ICacheService{
    
    async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {

        await getRedisClient().set(key,JSON.stringify(value),{
            EX:ttlSeconds
        })

    }


    async get<T>(key: string): Promise<T | null> {

        const data=await getRedisClient().get(key);
        if(!data){
            logger.warn("Requested cached data doesnot exist");
            return null
        }
        return JSON.parse(data) as T

    }


    async delete(key: string): Promise<void> {

        await getRedisClient().del(key)

    }


};