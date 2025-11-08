import { Chapter } from "@domain/entities/Course";

export interface AddModuleOutput {
    id: string;
    title: string;
    description: string;
    duration: number,
    chapters: Chapter[]
}