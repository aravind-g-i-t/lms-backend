import { InstructorEarningsRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/InstructorEarningsRepo";
import { InstructorRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/InstructorRepository";
import { InstructorWalletRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/InstructorWalletRepo";

export const instructorRepository=new InstructorRepositoryImpl();

export const instructorWalletRepository= new InstructorWalletRepositoryImpl();

export const instructorEarningsRepository = new InstructorEarningsRepositoryImpl()