import { IQuizAttemptRepository } from "@domain/interfaces/IQuizAttemptRepository";
import { QuizAttempt } from "@domain/entities/QuizAttempt";
import { QuizAttemptMapper } from "../mappers/QuizAttemptMapper";
import { QuizAttemptModel } from "../models/QuizAttempt";
import { BaseRepository } from "./BaseRepository";

export class QuizAttemptRepository extends BaseRepository<QuizAttempt> implements IQuizAttemptRepository {

    constructor(){
        super(QuizAttemptModel,QuizAttemptMapper)
    }

}
