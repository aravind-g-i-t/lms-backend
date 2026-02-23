import { CourseLevel } from "@domain/entities/Course";

interface Instructor {
  id: string;
  name: string;
  email: string;
  joiningDate: Date;
  expertise: string[];
  designation: string | null;
  profilePic: string | null;
  resume: string | null;
  website: string | null;
  bio: string | null;
  totalStudents: number;
  totalCourses: number;
  averageRating: number | null;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  enrollmentCount: number;
  instructorId: string;
  level: CourseLevel;
  duration: number;
  totalChapters: number;
  totalModules: number;
  tags: string[];
  thumbnail: string | null;
  price: number;
  rating: number | null;
  publishedAt: Date | null;
}


export interface GetInstructorDetailsForLearnerOutputDTO {
    instructor: Instructor;
    courses: Course[];
}


export interface IGetInstructorDetailsForLearnerUseCase {
  execute(input: { instructorId: string }): Promise<GetInstructorDetailsForLearnerOutputDTO>;
}