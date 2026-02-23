import { Certificate } from "../entities/Certificate";
import { IBaseRepository } from "./IBaseRepository";

export interface ICertificateRepository extends IBaseRepository<Certificate> {
    findByCertificateNumber(certNumber: string): Promise<Certificate | null>;
    findByLearnerAndCourse(learnerId: string, courseId: string): Promise<Certificate | null>;
    findAllByLearner(input: { page: number; limit: number; learnerId: string }): Promise<{
        certificates: Certificate[],
        totalPages: number,
        totalCount: number
    }>
}
