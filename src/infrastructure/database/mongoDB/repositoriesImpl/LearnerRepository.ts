import { ILearnerRepository } from '@domain/interfaces/ILearnerRepository';
import { LearnerModel } from '../models/LearnerModel';
import { Learner } from '@domain/entities/Learner';
import { LearnerMapper } from '../mappers/LearnerMapper';
import { escapeRegExp } from 'shared/utils/escapeRegExp';
import { AppError } from 'shared/errors/AppError';
import { MESSAGES } from 'shared/constants/messages';
import { STATUS_CODES } from 'shared/constants/httpStatus';


export class LearnerRepositoryImpl implements ILearnerRepository {
    async findByEmail(email: string, allowPassword: false): Promise<Learner | null> {
        console.log('entered findbyEmail');

        const doc = await LearnerModel.findOne({ email }).lean();
        console.log(doc);
        if (!doc) {
            return null
        }
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);

    }

    async create(signupInput: Partial<Learner>, allowPassword: false): Promise<Learner> {
        const doc = new LearnerModel(signupInput);
        await doc.save();
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);

    }


    async findById(id: string, allowPassword: false): Promise<Learner | null> {
        const doc = await LearnerModel.findById(id).lean();
        if (!doc) {
            return null
        }
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);
    }

    async findAll(query: Record<string, any>,
        options: { page: number; limit: number }) {
        const { page, limit } = options;
        const skip = (page - 1) * limit;

        const [docs, totalCount] = await Promise.all([
            LearnerModel.find(query)
                .select("-password -__v -updatedAt")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            LearnerModel.countDocuments(query)
        ]);

        console.log(docs);
        const learners = docs.map(doc => LearnerMapper.toDomain(doc));

        return {
            learners,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        };
    }

    async updateStatus(id: string): Promise<void> {
        console.log('learner-id', id);

        const learner = await LearnerModel.findById(id).select("isActive");
        if (!learner) {
            throw new AppError(MESSAGES.LEARNER_NOT_FOUND, STATUS_CODES.NOT_FOUND, false)
        }
        learner.isActive = !learner.isActive;
        await learner.save()
    }

    async findByIdAndUpdate(id: string, learner: Partial<Learner>, allowPassword: false): Promise<Learner | null> {
        const doc = await LearnerModel.findByIdAndUpdate(id, { $set: learner }, { new: true }).lean();

        if (!doc) {
            return null
        }
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);
    }

    async findOne(params: Partial<Learner>, allowPassword: false): Promise<Learner | null> {
        const doc = await LearnerModel.findOne(params);
        if (!doc) {
            return null
        }
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);
    }

    async updateOne(filter: Partial<Learner>, update: Partial<Learner>, allowPassword: false): Promise<Learner | null> {
        const doc = await LearnerModel.findOneAndUpdate(filter, { $set: update }, { new: true });
        if (!doc) {
            return null
        }
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);
    }


}

