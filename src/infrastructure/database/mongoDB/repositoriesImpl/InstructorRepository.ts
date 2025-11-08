import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { InstructorModel } from "../models/InstructorModel";
import { InstructorMapper } from "../mappers/InstructorMapper";
import { logger } from "@infrastructure/logging/Logger";


type InstructorQuery = {
  isActive?: boolean;
  name?: { $regex: string; $options: string };
  "verification.status"?: string;
};

export interface InstructorEntity{
    id:string;
    name:string;
    email:string;
    isActive:boolean;
    walletBalance:number;
    joiningDate:Date;
    expertise:string[];
    verification:{
        status:"Not Submitted"|"Under Review"|"Verified"|"Rejected",
        remarks:string|null;
    };
    identityProof:string|null;
    rating:number|null;
    designation:string |null;
    password:string|null;
    profilePic:string|null;
    resume:string|null;
    googleId:string|null;
    website:string|null;
    bio:string|null;

}

export class InstructorRepositoryImpl implements IInstructorRepository {
    async findByEmail(email: string, allowPassword: false): Promise<InstructorEntity | null> {
        const doc = await InstructorModel.findOne({ email }).lean();
        if (!doc) {
            logger.warn("Failed to fetch Instructor")
            return null
        }
        logger.info("Failed to fetch Instructor." )
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }

    async create(instructorInput: Partial<InstructorEntity>, allowPassword: false): Promise<InstructorEntity|null> {
        const doc = new InstructorModel(instructorInput);
        await doc.save();
        if(!doc){

            logger.warn("Instructor creation failed.")
            return null;
        }
        logger.info("Instructor created successfully")
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }


    async findById(id: string, allowPassword: false): Promise<InstructorEntity | null> {
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


    async updateStatus(id: string): Promise<InstructorEntity|null> {
        
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

    async findByIdAndUpdate(id: string, learner: Partial<InstructorEntity>, allowPassword: false): Promise<InstructorEntity | null> {
        const doc = await InstructorModel.findByIdAndUpdate(id, { $set: learner }, { new: true }).lean();

        if (!doc) {
            logger.warn("Failed to update instructor")
            return null
        }
        logger.info("Updated instructor successfully")
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }

    async findOne(params: Partial<InstructorEntity>, allowPassword: false): Promise<InstructorEntity | null> {
        const doc = await InstructorModel.findOne(params).lean();
        if (!doc) {
            logger.warn("Failed to fetch insturctor.")
            return null;
        }
        logger.info("Instructor fetched successfully")
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }

    async updateOne(filter: Partial<InstructorEntity>, update: Partial<InstructorEntity>, allowPassword: false): Promise<InstructorEntity | null> {
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


