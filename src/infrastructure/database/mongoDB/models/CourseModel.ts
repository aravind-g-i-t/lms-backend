import mongoose, { Schema, Document, Types } from "mongoose";


export interface SectionDoc{
    title: string;
    description: string;
    duration:number;
    lectures: LectureDoc[]; 
}

export interface LectureDoc{
    title: string;
    description: string;
    thumbnail:string;
    videoUrl: string;
    duration: number;
    resources: string[];
}

const LectureSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  resources: { type: [String], default: [] },
});

const SectionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  lectures: { type: [LectureSchema], default: [] },
});




export interface CourseDoc extends Document {
  _id:Types.ObjectId;
  title: string;
  description: string;
  thumbnail: string | null;
  previewVideo: string | null;
  preRequisites: string[];
  categoryId: string;
  subCategoryId: string;
  enrollmentCount: number;
  instructorId: string;
  sections: SectionDoc[];
  price: number | null;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  tags: string[];
  rating: number | null;
  totalRatings: number;
  isActive: boolean;
  status: "draft" | "under_review" | "published" | "archived";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<CourseDoc>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: null },
  previewVideo: { type: String, default: null },
  preRequisites: { type: [String], default: [] },
  categoryId: { type: String, required: true },
  subCategoryId: { type: String, required: true },
  enrollmentCount: { type: Number, default: 0 },
  instructorId: { type: String, required: true },
  sections: { type: [SectionSchema], default: [] },
  price: { type: Number, default: null },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  duration: { type: Number, required: true },
  tags: { type: [String], default: [] },
  rating: { type: Number, default: null },
  totalRatings: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ["draft", "under_review", "published", "archived"], default: "draft" },
  publishedAt: { type: Date, default: null },

},{ timestamps: true });

export const CourseModel = mongoose.model<CourseDoc>("Course", CourseSchema);
