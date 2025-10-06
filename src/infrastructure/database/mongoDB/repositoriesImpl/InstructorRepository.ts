import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { InstructorModel } from "../models/InstructorModel";
import { Instructor } from "@domain/entities/Instructor";
import { InstructorMapper } from "../mappers/InstructorMapper";


type InstructorQuery = {
  isActive?: boolean;
  name?: { $regex: string; $options: string };
  "verification.status"?: string;
};

export class InstructorRepositoryImpl implements IInstructorRepository {
    async findByEmail(email: string, allowPassword: false): Promise<Instructor | null> {
        const doc = await InstructorModel.findOne({ email }).lean();
        if (!doc) {
            return null
        }
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }

    async create(instructorInput: Partial<Instructor>, allowPassword: false): Promise<Instructor> {
        const doc = new InstructorModel(instructorInput);
        await doc.save();

        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }


    async findById(id: string, allowPassword: false): Promise<Instructor | null> {
        const doc = await InstructorModel.findById(id);
        if (!doc) {
            return null
        }
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }


    async findAll(
        query: InstructorQuery,
        options: { page: number; limit: number }
    ) {
        console.log("Entered findAll in instructorRepository");
        console.log(query,options);
        
        const { page, limit } = options;
        const skip = (page - 1) * limit;

        const [docs, totalCount] = await Promise.all([
            InstructorModel.find(query)
                .select("-password -__v -updatedAt")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            InstructorModel.countDocuments(query)
        ]);
        
        console.log(docs);
        const instructors = docs.map(doc => InstructorMapper.toDomain(doc));
        
        return {
            instructors,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        };
    }


    async updateStatus(id: string): Promise<Instructor|null> {
        console.log("entered repo");
        
        const instructor = await InstructorModel.findById(id);

        console.log(instructor);
        
        if (!instructor){
            return null
        }
        instructor.isActive = !instructor.isActive;
        await instructor.save();
        if(!instructor){
            return null
        }
        console.log(instructor);
        
        return InstructorMapper.toDomain(instructor);
    }

    async findByIdAndUpdate(id: string, learner: Partial<Instructor>, allowPassword: false): Promise<Instructor | null> {
        const doc = await InstructorModel.findByIdAndUpdate(id, { $set: learner }, { new: true }).lean();

        if (!doc) {
            return null
        }
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }

    async findOne(params: Partial<Instructor>, allowPassword: false): Promise<Instructor | null> {
        const doc = await InstructorModel.findOne(params).lean();
        if (!doc) {
            return null
        }
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }

    async updateOne(filter: Partial<Instructor>, update: Partial<Instructor>, allowPassword: false): Promise<Instructor | null> {
        const doc = await InstructorModel.findOneAndUpdate(filter, { $set: update }, { new: true });
        if (!doc) {
            return null
        }
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }
}


