import { Instructor } from "./entities/Instructor";
import { Learner } from "./entities/Learner";


export interface FindAllBusinessesQuery {
    isActive?: boolean;
    name?: { $regex: string; $options: string };
    "verification.status"?: string;
}


export interface FindAllInstructorsQuery {
    isActive?: boolean;
    name?: { $regex: string; $options: string };
    "verification.status"?: string;
}

export interface FindAllLearnersQuery {
    isActive?: boolean;
    name?: { $regex: string; $options: string };
}

export interface FindAllOptions {
    page: number;
    limit: number;
}

interface BusinessForFindAll {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    planName?: string;
    employeeCount: number;
    profilePic: string|null;
    verification: {
        status: string,
        remarks: string | null
    }
}

export interface FindAllInstructorsOutput {
    instructors: Instructor[],
    totalPages: number,
    totalCount: number,
}

export interface FindAllBusinessesOutput {
    businesses: BusinessForFindAll[],
    totalPages: number,
    totalCount: number,
}

export interface FindAllLearnersOutput {
    learners: Learner[],
    totalPages: number,
    totalCount: number,
}


export interface GooogleAuthGetUserInfoOutput {
    sub: string;
    email: string;
    name: string;
    picture?: string;
}

export type VerifiedToken<T> = T & {
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
};