import { Resource } from "./GetCourseDetails";

export interface AddChapterOutput {
    id: string;
    title: string;
    description: string;
    duration: number;
    video: string;
    resources: Resource[]
}