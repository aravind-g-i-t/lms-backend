import { ILearnerRepository } from '@domain/interfaces/ILearnerRepository';
import { LearnerModel } from '../models/LearnerModel';
import { Learner } from '@domain/entities/Learner';
import { LearnerMapper } from '../mappers/LearnerMapper';
import { AppError } from 'shared/errors/AppError';
import { MESSAGES } from 'shared/constants/messages';
import { STATUS_CODES } from 'shared/constants/httpStatus';
import { logger } from '@infrastructure/logging/Logger';

type LearnerQuery = {
  isActive?: boolean;
  name?: { $regex: string; $options: string };
};

export class LearnerRepositoryImpl implements ILearnerRepository {


    async findByEmail(email: string, allowPassword: false): Promise<Learner | null> {

        const doc = await LearnerModel.findOne({ email }).lean();
        if (!doc) {
            logger.error("Failed to fetch Learner.")
            return null
        }
        logger.info("Learner fetched successfully")
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);

    }


    async create(signupInput: Partial<Learner>, allowPassword: false): Promise<Learner|null> {

        const doc = new LearnerModel(signupInput);
        await doc.save();
        if(!doc){
            logger.error("Failed to create Learner.");
        }
        logger.info("Learner created successfully")
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);

    }


    async findById(id: string, allowPassword: false): Promise<Learner | null> {

        const doc = await LearnerModel.findById(id).lean();
        if (!doc) {
            logger.error("Failed to fetch Learner.")
            return null
        }
        logger.info("Learner fetched successfully")
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);

    }


    async findAll(query: LearnerQuery,
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
        if(docs){
            logger.info("Learners fetched successfully.");
        }
        const learners = docs.map(doc => LearnerMapper.toDomain(doc));
        return {
            learners,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        };

    }


    async updateStatus(id: string): Promise<void> {

        const learner = await LearnerModel.findById(id).select("isActive");
        if (!learner) {
            logger.error("Failed to fetch Learner for status update.")
            throw new AppError(MESSAGES.LEARNER_NOT_FOUND, STATUS_CODES.NOT_FOUND, false)
        }
        learner.isActive = !learner.isActive;
        await learner.save();
        if(!learner){
            logger.warn("Failed to update Learner status")
            throw new AppError(MESSAGES.LEARNER_NOT_UPDATED,STATUS_CODES.BAD_REQUEST);
        }
        logger.info("Learner status updated successfully")

    }


    async findByIdAndUpdate(id: string, learner: Partial<Learner>, allowPassword: false): Promise<Learner | null> {

        const doc = await LearnerModel.findByIdAndUpdate(id, { $set: learner }, { new: true }).lean();
        if (!doc) {
            logger.error("Failed to update Learner.")
            return null
        }
        logger.info("Learner updated successfully")
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);

    }


    async findOne(params: Partial<Learner>, allowPassword: false): Promise<Learner | null> {

        const doc = await LearnerModel.findOne(params);
        if (!doc) {
            logger.error("Failed to fetch Learner.")
            return null
        }
        logger.info("Learner fetched successfully")
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);

    }


    async updateOne(filter: Partial<Learner>, update: Partial<Learner>, allowPassword: false): Promise<Learner | null> {

        const doc = await LearnerModel.findOneAndUpdate(filter, { $set: update }, { new: true });
        if (!doc) {
            logger.error("Failed to update Learner.")
            return null
        }
        logger.info("Learner updated successfully")
        return allowPassword ? LearnerMapper.toDomain(doc) : LearnerMapper.toSecureDomain(doc);

    }


}

