export interface ICacheService{
    set(key:string,value:any,ttlSeconds:number):Promise<void>;
    get<T=any>(key:string):Promise<T | null>;
    delete(key:string):Promise<void>;
}