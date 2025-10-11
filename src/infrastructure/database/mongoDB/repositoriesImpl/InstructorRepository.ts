import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { InstructorModel } from "../models/InstructorModel";
import { Instructor } from "@domain/entities/Instructor";
import { InstructorMapper } from "../mappers/InstructorMapper";
import { logger } from "@infrastructure/logging/Logger";


type InstructorQuery = {
  isActive?: boolean;
  name?: { $regex: string; $options: string };
  "verification.status"?: string;
};

export class InstructorRepositoryImpl implements IInstructorRepository {
    async findByEmail(email: string, allowPassword: false): Promise<Instructor | null> {
        const doc = await InstructorModel.findOne({ email }).lean();
        if (!doc) {
            logger.warn("Failed to fetch Instructor")
            return null
        }
        logger.info("Failed to fetch Instructor." )
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }

    async create(instructorInput: Partial<Instructor>, allowPassword: false): Promise<Instructor|null> {
        const doc = new InstructorModel(instructorInput);
        await doc.save();
        if(!doc){

            logger.warn("Instructor creation failed.")
            return null;
        }
        logger.info("Instructor created successfully")
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }


    async findById(id: string, allowPassword: false): Promise<Instructor | null> {
        const doc = await InstructorModel.findById(id);
        if (!doc) {
            logger.warn("Failed to fetch Instructor")
            return null
        }
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }


    async findAll(
        query: InstructorQuery,
        options: { page: number; limit: number }
    ) {
        
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
        
        const instructors = docs.map(doc => InstructorMapper.toDomain(doc));
        logger.info("Instructors fetched successfully")
        return {
            instructors,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        };
    }


    async updateStatus(id: string): Promise<Instructor|null> {
        
        const instructor = await InstructorModel.findById(id);

        
        if (!instructor){
            logger.warn("Failed to fetch Instructor for status update")
            return null
        }
        instructor.isActive = !instructor.isActive;
        await instructor.save();
        if(!instructor){
            logger.info('Instructor status updated successfully')
            return null
        }
        
        return InstructorMapper.toDomain(instructor);
    }

    async findByIdAndUpdate(id: string, learner: Partial<Instructor>, allowPassword: false): Promise<Instructor | null> {
        const doc = await InstructorModel.findByIdAndUpdate(id, { $set: learner }, { new: true }).lean();

        if (!doc) {
            logger.warn("Failed to update instructor")
            return null
        }
        logger.info("Updated instructor successfully")
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }

    async findOne(params: Partial<Instructor>, allowPassword: false): Promise<Instructor | null> {
        const doc = await InstructorModel.findOne(params).lean();
        if (!doc) {
            logger.warn("Failed to fetch insturctor.")
            return null;
        }
        logger.info("Instructor fetched successfully")
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }

    async updateOne(filter: Partial<Instructor>, update: Partial<Instructor>, allowPassword: false): Promise<Instructor | null> {
        const doc = await InstructorModel.findOneAndUpdate(filter, { $set: update }, { new: true });
        if (!doc) {
            logger.warn('Failed to update Instructor')
            return null;
        }
        logger.info("Updated instructor successfully")
        return allowPassword
         ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }
}


