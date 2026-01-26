import mongoose, { Schema, Document, Types } from "mongoose";
import { CategoryDoc } from "./CategoryModel";
import { InstructorDoc } from "./InstructorModel";

export enum CourseLevel {
    Beginner = "beginner",
    Intermediate = "intermediate",
    Advanced = "advanced",
}

export enum CourseStatus {
    Draft = "draft",
    Published = "published",
    Archived = "archived",
}

export enum VerificationStatus {
    NotVerified = "not_verified",
    UnderReview = "under_review",
    Verified = "verified",
    Rejected = "rejected",
    Blocked = "blocked"

}



export interface IResource {
    id: string
    name: string;
    file: string;
    size: number;
}

export interface IChapter {
    id: string
    title: string;
    description: string;
    video: string;
    duration: number;
    resources: IResource[];
}

export interface IModule {
    id: string
    title: string;
    description: string;
    duration: number;
    chapters: IChapter[];
}

export interface CourseDoc extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    thumbnail: string | null;
    previewVideo: string | null;
    prerequisites: string[];
    categoryId: Types.ObjectId;
    enrollmentCount: number;
    instructorId: Types.ObjectId;
    modules: IModule[];
    price: number;
    level: CourseLevel;
    duration: number;
    totalChapters: number;
    totalModules: number;
    tags: string[];
    whatYouWillLearn: string[];
    rating: number | null;
    totalRatings: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    quizId:Types.ObjectId|null;
    status: CourseStatus;
    verification: {
        status: VerificationStatus;
        reviewedAt: Date | null;
        submittedAt: Date | null;
        remarks: string | null;
    };
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface HydratedCourseDoc extends Omit<CourseDoc, "categoryId" | "instructorId"> {
    categoryId: CategoryDoc;
    instructorId: InstructorDoc;
}

const ResourceSchema = new Schema<IResource>(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        file: { type: String, required: true },
        size: { type: Number, required: true },
    },
    { _id: false }
);

const ChapterSchema = new Schema<IChapter>(
    {
        id: { type: String, required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        video: { type: String, required: true },
        duration: { type: Number, required: true },
        resources: { type: [ResourceSchema], default: [] },
    },
    { _id: false }
);

const ModuleSchema = new Schema<IModule>(
    {
        id: { type: String, required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        duration: { type: Number, required: true },
        chapters: { type: [ChapterSchema], default: [] },
    },
    { _id: false }
);

const CourseSchema = new Schema<CourseDoc>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        thumbnail: { type: String, default: null },
        previewVideo: { type: String, default: null },
        prerequisites: { type: [String], default: [] },
        categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        enrollmentCount: { type: Number, default: 0 },
        instructorId: { type: Schema.Types.ObjectId, ref: "Instructor", required: true },
        modules: { type: [ModuleSchema], default: [] },
        price: { type: Number, required: true },
        level: { type: String, enum: Object.values(CourseLevel), required: true },
        duration: { type: Number, required: true },
        totalChapters: { type: Number, required: true },
        totalModules: { type: Number, required: true },
        tags: { type: [String], default: [] },
        whatYouWillLearn: { type: [String], default: [] },
        rating: { type: Number, default: null },
        totalRatings: { type: Number, default: 0 },
        ratingDistribution: {
            5: { type: Number, default: 0 },
            4: { type: Number, default: 0 },
            3: { type: Number, default: 0 },
            2: { type: Number, default: 0 },
            1: { type: Number, default: 0 },
        },
        quizId:{type: Schema.Types.ObjectId, default: null},
        status: {
            type: String,
            enum: Object.values(CourseStatus),
            default: CourseStatus.Draft,
        },
        verification: {
            status: {
                type: String,
                enum: Object.values(VerificationStatus),
                default: VerificationStatus.NotVerified,
            },
            reviewedAt: { type: Date, default: null },
            submittedAt: { type: Date, default: null },
            remarks: { type: String, default: null },
        },
        publishedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

export const CourseModel = mongoose.model<CourseDoc>("Course", CourseSchema);
