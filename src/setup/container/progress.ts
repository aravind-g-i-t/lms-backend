import { ProgressController } from "@presentation/http/controllers/ProgressController";
import { learnerProgressRepository } from "./shared/dependencies";
import { MarkChapterAsCompletedUseCase } from "@application/useCases/learnerProgress/MarkChapterAsCompleted";
import { UpdateCurrentChapterUseCase } from "@application/useCases/course/UpdateCurrentChapter";

const markChapterAsCompletedUseCase= new MarkChapterAsCompletedUseCase(learnerProgressRepository);

const updateCurrentChapterUseCase= new UpdateCurrentChapterUseCase(learnerProgressRepository)

export const progressController= new ProgressController(
    markChapterAsCompletedUseCase,
    updateCurrentChapterUseCase
);