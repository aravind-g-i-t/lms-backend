import { ICertificateRepository } from "@domain/interfaces/ICertificateRepository";
import { Certificate } from "@domain/entities/Certificate";
import { CertificateMapper } from "../mappers/CertificateMapper";
import { CertificateModel } from "../models/CertificateModel";
import { logger } from "@infrastructure/logging/Logger";
import { BaseRepository } from "./BaseRepository";

export class CertificateRepository extends BaseRepository<Certificate> implements ICertificateRepository {

    constructor (){
        super(CertificateModel,CertificateMapper)
    }

    async findByCertificateNumber(certNumber: string): Promise<Certificate | null> {
        const doc= await CertificateModel.findOne({ certificateNumber: certNumber }).lean();
        return doc?CertificateMapper.toDomain(doc):null
    }

    async findByLearnerAndCourse(learnerId: string, courseId: string): Promise<Certificate | null> {
        const doc=await CertificateModel.findOne({ learnerId, courseId }).lean();
        return doc?CertificateMapper.toDomain(doc):null
    }



    async findAllByLearner(input: { page: number; limit: number; learnerId:string}): Promise<{
            certificates: Certificate[],
            totalPages: number,
            totalCount: number
        }> {
            const { page, limit, learnerId } = input;
            
    
            const skip = (page - 1) * limit;
            const [docs, totalCount] = await Promise.all([
                CertificateModel.find({learnerId})
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                CertificateModel.countDocuments({learnerId})
            ]);
            if (docs) {
                logger.info("Certificates fetched successfully.");
            }
            const certificates = docs.map(doc => CertificateMapper.toDomain(doc));
            
            return {
                certificates,
                totalPages: totalCount?Math.ceil(totalCount / limit):0,
                totalCount
            };
        }
}
