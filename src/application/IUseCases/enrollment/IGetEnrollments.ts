import { GetEnrollmentsOutput } from "@application/dtos/enrollment/GetEnrollments";

export interface IGetEnrollmentsUseCase {
    execute(input: {
        learnerId: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<GetEnrollmentsOutput>
}