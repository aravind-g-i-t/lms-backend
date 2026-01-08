/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class BaseRepository<T> {

  constructor(

    protected model: any,
    protected mapper: any
  ) { }

  async findById(id: string): Promise<T | null> {
    const doc = await this.model.findById(id).lean();
    console.log(doc);

    return doc ? this.mapper.toDomain(doc) : null
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const doc = await this.model.findOne(filter).lean();
    return doc ? this.mapper.toDomain(doc) : null
  }

  async create(data: Partial<T>): Promise<T | null> {
    const doc = await this.model.create(data);
    const leanDoc = await this.model.findById(doc._id).lean();
  return leanDoc ? this.mapper.toDomain(leanDoc) : null;

  }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
    return doc ? this.mapper.toDomain(doc) : null
  }

  async findOneAndUpdate(fiter: Partial<T>, data: Partial<T>): Promise<T | null> {
    const doc = await this.model.findOneAndUpdate(fiter, data, { new: true }).lean();
    return doc ? this.mapper.toDomain(doc) : null
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async findByIds(ids: string[]): Promise<T[]> {
    const docs= await this.model.
      find({
        _id: { $in: ids }
      })
      .lean()
      .exec();

    return docs.map((doc: any) => this.mapper.toDomain(doc));

  }

}
