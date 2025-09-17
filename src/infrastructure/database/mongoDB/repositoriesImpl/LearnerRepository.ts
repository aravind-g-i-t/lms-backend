import { ILearnerRepository } from '@domain/interfaces/ILearnerRepository';
import { LearnerModel } from '../models/LearnerModel';
import { Learner } from '@domain/entities/Learner';
import { LearnerMapper } from '../mappers/LearnerMapper';
import { escapeRegExp } from 'shared/utils/escapeRegExp';
import { AppError } from 'shared/errors/AppError';
import { MESSAGES } from 'shared/constants/messages';
import { STATUS_CODES } from 'shared/constants/httpStatus';


export class LearnerRepositoryImpl implements ILearnerRepository {
    async findByEmail(email: string): Promise<Learner | null> {
        console.log('entered findbyEmail');

        const doc = await LearnerModel.findOne({ email }).lean();
        console.log(doc);
        if(doc){
            return LearnerMapper.toDomain(doc)
        }
        return null;
        
    }

    async create(signupInput: Learner): Promise<Learner> {
        const doc = new LearnerModel(signupInput);
        await doc.save();

        return LearnerMapper.toDomain(doc);

    }

    
    async findById(id: string): Promise<Learner | null> {
        const doc= await LearnerModel.findById(id).lean();
        if(doc){
            return LearnerMapper.toDomain(doc)
        }
        return null;
    }
    
    async findAll(params: { page: number; search?: string; status?: string; limit: number; }) {
        let {page,search,status,limit}=params;
        const query:any={};
        if(status){
            query.isActive=(status==='Active')?true:false;
        }
        if(search && search.trim().length ){
            const safe = escapeRegExp(search.trim()).slice(0, 100);
            query.name={$regex:safe,$options:"i"}
        }
        const skip=(page-1)*limit;
        const[docs,totalCount]=await Promise.all([
            LearnerModel.find(query)
            .select("-password -__v -updatedAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
            LearnerModel.countDocuments(query)
        ])
        console.log(docs);
        const learners=docs.map(doc=>LearnerMapper.toDomain(doc));
        

        return {
            learners,
            totalPages:Math.ceil(totalCount/limit),
            totalCount
        }
    }

    async updateStatus(id: string): Promise<void> {
        const learner=await LearnerModel.findById(id).select("isActive");
        if(!learner) throw new AppError(MESSAGES.LEARNER_NOT_FOUND,STATUS_CODES.NOT_FOUND,false)
        learner.isActive=!learner.isActive;
        await learner.save()
    }

    async update(id:string,learner: Partial<Learner>): Promise<Learner|null> {
        const doc=await LearnerModel.findByIdAndUpdate(id,{$set:learner},{new:true}).lean();
        
        if(doc){
            return LearnerMapper.toDomain(doc)
        }
        return null;
    }

    async findOne(params: Partial<Learner>): Promise<Learner|null> {
        const doc=await LearnerModel.findOne(params);
        if(doc){
            return LearnerMapper.toDomain(doc)
        }
        return null;
    }

    
}

