
export interface IBaseRepository<T> {
    findById(id: string): Promise<T | null>;
    create(data: Partial<T>): Promise<T | null>;
    updateById(id: string, data: Partial<T>): Promise<T | null>;
    deleteById(id: string): Promise<boolean>;
    findOne(filter: Partial<T>): Promise<T | null>;
    findOneAndUpdate(filter: Partial<T>, data: Partial<T>): Promise<T | null>;
    findByIds(ids: string[]): Promise<T[]>;
    findMany(filter: Partial<T>): Promise<T[]>;
    getCount(filter: Partial<T>): Promise<number>;
}