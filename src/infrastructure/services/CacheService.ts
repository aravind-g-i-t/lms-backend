import { ICacheService } from "@domain/interfaces/ICacheService";
import { logger } from "@infrastructure/logging/Logger";

import { RedisClientType } from "redis";

export class CacheService implements ICacheService{
    constructor(
        private redisClient:RedisClientType
    ){}


    
    async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {

        await this.redisClient.set(key,JSON.stringify(value),{
            EX:ttlSeconds
        })

    }


    async get<T>(key: string): Promise<T | null> {

        const data=await this.redisClient.get(key);
        if(!data){
            logger.warn("Requested cached data doesnot exist");
            return null
        }
        return JSON.parse(data) as T

    }


    async delete(key: string): Promise<void> {

        await this.redisClient.del(key)

    }


};