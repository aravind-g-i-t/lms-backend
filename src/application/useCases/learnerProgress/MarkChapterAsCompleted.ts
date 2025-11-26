import { ILearnerProgressRepository } from "@domain/interfaces/ILearnerProgressRepo";
import { IMarkChapterAsCompletedUseCase } from "@application/IUseCases/learnerProgress/IMarkChapterAsCompleted";

export interface MarkChapterAsCompletedInput {
    learnerId: string;
    courseId: string;
    chapterId: string;
}

export class MarkChapterAsCompletedUseCase implements IMarkChapterAsCompletedUseCase {
    constructor(
        private readonly progressRepo: ILearnerProgressRepository
    ) { }

    async execute(input: MarkChapterAsCompletedInput): Promise<void> {
        const { learnerId, courseId, chapterId } = input;

        const updated = await this.progressRepo.markChapterCompleted({
            learnerId,
            courseId,
            chapterId
        });

        if (!updated) {
            throw new Error("Failed to update progress.");
        }


        const percentage = Math.round(
            (updated.completedChapters.length / updated.totalChapters) * 100
        );


        const updatedPercentage = await this.progressRepo.findByIdAndUpdate(updated.id, { progressPercentage: percentage });

        if (!updatedPercentage) {
            throw new Error("Failed to update learner progress.");
        }

    }
}
