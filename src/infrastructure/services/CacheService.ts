import { ICacheService } from "@domain/interfaces/ICacheService";

import { RedisClientType } from "redis";

export class CacheService implements ICacheService{
    constructor(
        private redisClient:RedisClientType
    ){}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async set(key: string, value: any, ttlSeconds: number): Promise<void> {
        await this.redisClient.set(key,JSON.stringify(value),{
            EX:ttlSeconds
        })
    }

    async get<T>(key: string): Promise<T | null> {
        const data=await this.redisClient.get(key);
        return data?JSON.parse(data) as T:null
    }

    async delete(key: string): Promise<void> {
        await this.redisClient.del(key)
    }
};