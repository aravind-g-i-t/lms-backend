/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class BaseRepository<T> {

  constructor(
    
    protected model: any,
    protected mapper:any
  ) {}

  async findById(id: string): Promise<T | null> {
    const doc= this.model.findById(id);
    return doc?this.mapper.toDomain(doc):null
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const doc= this.model.findOne(filter);
    return doc?this.mapper.toDomain(doc):null
  }

  async create(data: Partial<T>): Promise<T|null> {
    const doc= this.model.create(data);
    return doc?this.mapper.toDomain(doc):null
  }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    const doc= this.model.findByIdAndUpdate(id, data, { new: true });
    return doc?this.mapper.toDomain(doc):null
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
