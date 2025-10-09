export interface ICacheService{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(key:string,value:any,ttlSeconds:number):Promise<void>;
    get<T>(key:string):Promise<T | null>;
    delete(key:string):Promise<void>;
}