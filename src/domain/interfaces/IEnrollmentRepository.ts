import { Enrollment, EnrollmentStatus } from "@domain/entities/Enrollment";

export interface IEnrollmentRepository {
  create(data: Partial<Enrollment>): Promise<Enrollment | null>;
  findOne(filter: Partial<Enrollment>): Promise<Enrollment | null>;
  findMany(filter: Partial<Enrollment>): Promise<Enrollment[]>;
  findPaginatedEnrollments(input:
    {learnerId: string,
    search: string | null,
    page: number,
    limit: number,
    filter?: {
            instructorIds?: string[];
            status?: EnrollmentStatus[]
    }}
  ): Promise<{ data: Enrollment[]; total: number }>
  update(id: string, updates: Partial<Enrollment>): Promise<Enrollment | null>;
  delete(id: string): Promise<void>;
  updateProgress(id: string, progress: number, completedChapters: string[]): Promise<Enrollment | null>;
}

