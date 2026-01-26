import { EnrollmentRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/EnrollmentRepository"
import { FavouriteRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/FavouriteRepository"
import { LearnerProgressRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/LearnerProgressRepo"
import { LearnerRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/LearnerRepository"
import { QuizAttemptRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/QuizAttemptRepository"
import { ReviewRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/ReviewRepository"
import { WalletRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/WalletRepository"

export const learnerRepository=new LearnerRepositoryImpl()

export const walletRepository = new WalletRepositoryImpl()

export const favouriteRepository = new FavouriteRepositoryImpl();

export const quizAttemptRepository= new QuizAttemptRepository()

export const learnerProgressRepository= new LearnerProgressRepository();

export const enrollmentRepository = new EnrollmentRepositoryImpl();

export const reviewRepository= new ReviewRepository()
