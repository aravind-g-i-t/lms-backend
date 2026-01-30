import { HydratedEnrollment, IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { EnrollmentModel } from "../models/EnrollmentModel";
import { EnrollmentMapper } from "../mappers/EnrollmentMapper";
import { Enrollment, EnrollmentStatus } from "@domain/entities/Enrollment";
import { BaseRepository } from "./BaseRepository";
import { LearnerDoc } from "../models/LearnerModel";
import { PaymentDoc } from "../models/PaymentModel";
import { Types } from "mongoose";



export class EnrollmentRepositoryImpl extends BaseRepository<Enrollment> implements IEnrollmentRepository {

    constructor() {
        super(EnrollmentModel, EnrollmentMapper)
    }

    async findMany(filter: Partial<Enrollment>): Promise<Enrollment[]> {
        const results = await EnrollmentModel.find(filter).exec();
        return results.map(r => EnrollmentMapper.toDomain(r));
    }

    async findPaginatedEnrollments(
        { learnerId, search, page, limit, filter }:
            {
                learnerId: string,
                search: string | null,
                page: number,
                limit: number,
                filter?: {
                    instructorIds?: string[];
                    status?: EnrollmentStatus[]
                }
            }
    ): Promise<{ data: Enrollment[]; total: number }> {

        const skip = (page - 1) * limit;

        // Base filter
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = {
            learnerId
        };

        if (search) {
            query.$or = [
                { courseTitle: { $regex: search, $options: "i" } },
                { instructorName: { $regex: search, $options: "i" } }
            ];
        }

        if (filter?.instructorIds?.length) {
            query.instructorId = { $in: filter.instructorIds };
        }

        if (filter?.status?.length) {
            query.status = { $in: filter.status };
        }

        const [rows, total] = await Promise.all([
            EnrollmentModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),

            EnrollmentModel.countDocuments(query)
        ]);

        return {
            data: rows.map(r => EnrollmentMapper.toDomain(r)),
            total
        };
    }



    async updateProgress(
        id: string,
        progress: number,
        completedChapters: string[]
    ): Promise<Enrollment | null> {
        const updated = await EnrollmentModel.findByIdAndUpdate(
            id,
            { $set: { progress, completedChapters, lastAccessedAt: new Date() } },
            { new: true }
        ).exec();
        return updated ? EnrollmentMapper.toDomain(updated) : null;
    }

    async getEnrolledCourseIdsByLearnerId(learnerId: string): Promise<string[]> {
        const enrollments = await EnrollmentModel
            .find(
                {
                    learnerId,
                    status: EnrollmentStatus.Active
                },
                { courseId: 1 }
            )
            .lean()
            .exec();

        return enrollments.map(e => e.courseId.toString());
    }

    async findHydratedEnrollments(input:{filter:Partial<Enrollment>,limit:number}): Promise<{
        enrollments:HydratedEnrollment[],
        total:number
    }> {
        const {filter,limit}=input

        const enrollments=await EnrollmentModel
        .find(filter)
        .sort({createdAt:-1})
        .limit(limit)
        .populate<{ learnerId: LearnerDoc }>("learnerId")
        .populate<{ paymentId: PaymentDoc }>("paymentId")
        .lean()
        .exec()

        const total=await EnrollmentModel.countDocuments(filter)
        

        

      
        return {
            enrollments: enrollments.map(r => EnrollmentMapper.toHydratedDomain(r)),
            total
        };
    }

    async getEnrollmentTrend(
    courseId: string,
    from: Date
  ): Promise<
    {
      date: string;
      enrollments: number;
      revenue: number;
    }[]
  > {
    const courseObjectId = new Types.ObjectId(courseId);

    const trend = await EnrollmentModel.aggregate([
      {
        $match: {
          courseId: courseObjectId,
          createdAt: { $gte: from },
          status: { $in: ["active", "completed"] },
        },
      },

      /* ---- Group by week ---- */
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $isoWeek: "$createdAt" },
          },
          enrollments: { $sum: 1 },
          revenue: { $sum: "$amount" }, // or "$price"
          firstDate: { $min: "$createdAt" },
        },
      },

      /* ---- Sort chronologically ---- */
      {
        $sort: {
          "_id.year": 1,
          "_id.week": 1,
        },
      },

      /* ---- Shape output ---- */
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$firstDate",
            },
          },
          enrollments: 1,
          revenue: 1,
        },
      },
    ]);

    return trend;
  }
}
