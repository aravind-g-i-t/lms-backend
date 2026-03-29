import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { Model, FilterQuery, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T, D> implements IBaseRepository<T> {
  constructor(
    protected model: Model<D>,
    protected mapper: {
      toDomain(doc: D): T;
      toPersistence(entity: Partial<T>): Partial<D>;
    }
  ) { }

  async findById(id: string): Promise<T | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? this.mapper.toDomain(doc as D) : null;
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const filterQuery: FilterQuery<T> = filter as FilterQuery<T>;
    
    const doc = await this.model.findOne(filterQuery).lean();
    return doc ? this.mapper.toDomain(doc as D) : null;
  }

  async create(data: Partial<T>): Promise<T | null> {
    const doc = await this.model.create(data);
    const leanDoc = await this.model.findById(doc._id).lean();
    return leanDoc ? this.mapper.toDomain(leanDoc as D) : null;
  }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    const update: UpdateQuery<D> = { 
      $set: this.mapper.toPersistence(data) as UpdateQuery<D>
    };
    const doc = await this.model
      .findByIdAndUpdate(id, update, { new: true })
      .lean();

    return doc ? this.mapper.toDomain(doc as D) : null;
  }

  async findOneAndUpdate(
    filter: Partial<T>,
    data: Partial<T>
  ): Promise<T | null> {
    const update: UpdateQuery<D> = { 
      $set: this.mapper.toPersistence(data) as UpdateQuery<D>
    };
    const filterQuery: FilterQuery<T> = filter as FilterQuery<T>;

    const doc = await this.model
      .findOneAndUpdate(filterQuery, update, { new: true })
      .lean();

    return doc ? this.mapper.toDomain(doc as D) : null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async findByIds(ids: string[]): Promise<T[]> {
    const docs = await this.model
      .find({ _id: { $in: ids } })
      .lean();

    return docs.map(doc => this.mapper.toDomain(doc as D));
  }

  async findMany(filter: FilterQuery<T>): Promise<T[]> {
    const docs = await this.model.find(filter).lean();
    return docs.map(doc => this.mapper.toDomain(doc as D));
  }

  async getCount(filter: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
