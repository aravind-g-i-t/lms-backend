import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { InstructorModel } from "../models/InstructorModel";
import { Instructor } from "@domain/entities/Instructor";
import { InstructorMapper } from "../mappers/InstructorMapper";
import { escapeRegExp } from "shared/utils/escapeRegExp";
import { AppError } from "shared/errors/AppError";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";

export class InstructorRepositoryImpl implements IInstructorRepository {
    async findByEmail(email: string, allowPassword: false): Promise<Instructor | null> {
        const doc = await InstructorModel.findOne({ email }).lean();
        if (!doc) {
            return null
        }
        return allowPassword ? InstructorMapper.toDomain(doc) : InstructorMapper.toSecureDomain(doc);
    }

    async create(instructorInput: Instructor, allowPassword: false): Promise<Instructor> {
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


    async findAll(params: { page: number; search?: string; status?: string; limit: number; }, allowPassword: false) {
        let { page, search, status, limit } = params;
        const query: any = {};
        if (status) {
            query.isActive = (status === 'Active') ? true : false;
        }
        if (search && search.trim().length) {
            const safe = escapeRegExp(search.trim()).slice(0, 100);
            query.name = { $regex: safe, $options: "i" }
        }
        const skip = (page - 1) * limit;
        const [docs, totalCount] = await Promise.all([
            InstructorModel.find(query)
                .select("-password -__v -updatedAt")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            InstructorModel.countDocuments(query)
        ])
        console.log(docs);
        const instructors = docs.map(doc => InstructorMapper.toDomain(doc));


        return {
            instructors,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        }
    }

    async updateStatus(id: string): Promise<void> {
        const instructor = await InstructorModel.findById(id).select("isActive");
        if (!instructor) throw new AppError(MESSAGES.INSTRUCTOR_NOT_CREATED, STATUS_CODES.NOT_FOUND, false)
        instructor.isActive = !instructor.isActive;
        await instructor.save()
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


