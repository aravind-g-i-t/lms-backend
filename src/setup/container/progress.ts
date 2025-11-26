import { ProgressController } from "@presentation/controllers/ProgressController";
import { learnerProgressRepository } from "./shared/dependencies";
import { MarkChapterAsCompletedUseCase } from "@application/useCases/learnerProgress/MarkChapterAsCompleted";

const markChapterAsCompletedUseCase= new MarkChapterAsCompletedUseCase(learnerProgressRepository)

export const progressController= new ProgressController(
    markChapterAsCompletedUseCase
);