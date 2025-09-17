import { IInstructorRepository } from "@domain/interfaces/IInstructorRepository";
import { InstructorModel } from "../models/InstructorModel";
import { Instructor } from "@domain/entities/Instructor";
import { InstructorMapper } from "../mappers/InstructorMapper";
import { escapeRegExp } from "shared/utils/escapeRegExp";
import { AppError } from "shared/errors/AppError";
import { MESSAGES } from "shared/constants/messages";
import { STATUS_CODES } from "shared/constants/httpStatus";

export class InstructorRepositoryImpl implements IInstructorRepository {
    async findByEmail(email: string): Promise<Instructor | null> {
        const doc = await InstructorModel.findOne({ email }).lean();
        return doc ? InstructorMapper.toDomain(doc as any) : null;
    }

    async create(instructorInput: Instructor): Promise<Instructor> {
        const doc = new InstructorModel(instructorInput);
        await doc.save();
        return InstructorMapper.toDomain(doc)!;
    }


    async findById(id: string): Promise<Instructor | null> {
        const doc = await InstructorModel.findById(id);
        if (doc) {
            return InstructorMapper.toDomain(doc);
        }
        return null;
    }


    async findAll(params: { page: number; search?: string; status?: string; limit: number; }) {
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

    async update(id: string, learner: Partial<Instructor>): Promise<Instructor | null> {
        const doc = await InstructorModel.findByIdAndUpdate(id, { $set: learner }, { new: true }).lean();

        if (doc) {
            return InstructorMapper.toDomain(doc)
        }
        return null;
    }

    async findOne(params: Partial<Instructor>): Promise<Instructor | null> {
        const doc = await InstructorModel.findOne(params);
        if (doc) {
            return InstructorMapper.toDomain(doc)
        }
        return null;
    }
}
