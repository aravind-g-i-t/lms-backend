import { InstructorEarningsRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/InstructorEarningsRepo";
import { InstructorRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/InstructorRepository";
import { InstructorWalletRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/InstructorWalletRepo";
import { LiveSessionRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/LiveSessionRepository";
import { QuizRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/QuizRepository";

export const instructorRepository=new InstructorRepositoryImpl();

export const instructorWalletRepository= new InstructorWalletRepositoryImpl();

export const instructorEarningsRepository = new InstructorEarningsRepositoryImpl()

export const quizRepository= new QuizRepository();

export const liveSessionRepository= new LiveSessionRepository()


