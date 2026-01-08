import { Certificate } from "../entities/Certificate";

export interface ICertificateRepository {
    create(data: Partial<Certificate>): Promise<Certificate | null>;
    findById(id: string): Promise<Certificate | null>;
    findByCertificateNumber(certNumber: string): Promise<Certificate | null>;
    findByLearnerAndCourse(learnerId: string, courseId: string): Promise<Certificate | null>;
    updateById(id: string, data: Partial<Certificate>): Promise<Certificate | null>;
    deleteById(id: string): Promise<boolean>;
    findAllByLearner(input: { page: number; limit: number; learnerId: string }): Promise<{
        certificates: Certificate[],
        totalPages: number,
        totalCount: number
    }>
}
