import { AdminRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/AdminRepository";
import { CategoryRepositoryImpl } from "@infrastructure/database/mongoDB/repositoriesImpl/CategoryRepository";
import { CertificateRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/CertificateRepository";
import { CouponRepository } from "@infrastructure/database/mongoDB/repositoriesImpl/CouponRepository";

export const adminRepository=new AdminRepository();
export const couponRepository=new CouponRepository();
export const categoryRepository=new CategoryRepositoryImpl()
export const certificateRepository= new CertificateRepository()
