import { QuizAttempt } from "@domain/entities/QuizAttempt";
import { QuizAttemptMapper } from "../mappers/QuizAttemptMapper";
import { QuizAttemptDoc, QuizAttemptModel } from "../models/QuizAttempt";
import { BaseRepository } from "./BaseRepository";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export class QuizAttemptRepository extends BaseRepository<QuizAttempt,QuizAttemptDoc> implements IBaseRepository<QuizAttempt> {

    constructor(){
        super(QuizAttemptModel,QuizAttemptMapper)
    }

}
