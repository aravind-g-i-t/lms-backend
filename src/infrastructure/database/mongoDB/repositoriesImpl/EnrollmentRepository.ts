import {  HydratedEnrollment, IEnrollmentRepository, LearnerEnrollmentsOutput } from "@domain/interfaces/IEnrollmentRepository";
import { EnrollmentModel } from "../models/EnrollmentModel";
import { EnrollmentMapper } from "../mappers/EnrollmentMapper";
import { Enrollment, EnrollmentStatus } from "@domain/entities/Enrollment";
import { BaseRepository } from "./BaseRepository";
import { LearnerDoc } from "../models/LearnerModel";
import { PaymentDoc } from "../models/PaymentModel";
import { FilterQuery, Types } from "mongoose";
import { LearnerProgressDoc } from "../models/LearnerProgressModel";




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

    async findHydratedEnrollments(input: { filter: Partial<Enrollment>, limit: number, page: number }): Promise<{
        enrollments: HydratedEnrollment[],
        total: number
    }> {
        const { filter, limit, page } = input
        const skip = (page - 1) * limit;

        const enrollments = await EnrollmentModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate<{ learnerId: LearnerDoc }>("learnerId")
            .populate<{ paymentId: PaymentDoc }>("paymentId")
            .populate<{ progressId: LearnerProgressDoc }>("progressId")
            .lean()
            .exec()

        const total = await EnrollmentModel.countDocuments(filter)





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

            // ✅ join payment
            {
                $lookup: {
                    from: "payments",          // <-- collection name
                    localField: "paymentId",
                    foreignField: "_id",
                    as: "payment",
                },
            },

            { $unwind: "$payment" },

            // ✅ compute revenue share
            {
                $addFields: {
                    instructorRevenue: {
                        $subtract: [
                            "$payment.paidAmount",
                            { $multiply: ["$payment.grossAmount", 0.7] },
                        ],
                    },
                },
            },

            // ✅ group
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        week: { $isoWeek: "$createdAt" },
                    },
                    enrollments: { $sum: 1 },
                    revenue: { $sum: "$instructorRevenue" },
                    firstDate: { $min: "$createdAt" },
                },
            },

            { $sort: { "_id.year": 1, "_id.week": 1 } },

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
                    revenue: { $round: ["$revenue", 2] },
                },
            },
        ]);

        return trend;
    }

    async findLearnerEnrollmentsForInstructor(input: { instructorId: string; page: number; limit: number; search?: string; }): Promise<{
        data: LearnerEnrollmentsOutput[];
        total: number;
    }> {
        const instructorId = new Types.ObjectId(input.instructorId);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const search: FilterQuery<any> = {}
        if (input.search) {
            search["learner.name"] = { $regex: input.search, $options: "i" }
        }
        const skip = (input.page - 1) * input.limit;
        console.log(skip);


        const result = await EnrollmentModel.aggregate([
            {
                $match: {
                    instructorId,
                    status: EnrollmentStatus.Active,
                },
            },

            {
                $lookup: {
                    from: "learners",
                    localField: "learnerId",
                    foreignField: "_id",
                    as: "learner",
                },
            },

            { $unwind: "$learner" },

            { $match: search },

            {
                $lookup: {
                    from: "payments",
                    localField: "paymentId",
                    foreignField: "_id",
                    as: "payment",
                },
            },

            {
                $lookup: {
                    from: "learnerprogresses",
                    localField: "progressId",
                    foreignField: "_id",
                    as: "progress",
                },
            },

            { $unwind: "$payment" },
            { $unwind: "$progress" },

            {
                $group: {
                    _id: "$learner._id",

                    learner: {
                        $first: {
                            name: "$learner.name",
                            email: "$learner.email",
                            profilePic: "$learner.profilePic",
                        },
                    },

                    enrollments: {
                        $push: {
                            id: "$_id",
                            courseTitle: "$courseTitle",
                            grossAmount: "$payment.grossAmount",
                            duration: "$duration",
                            thumbnail: "$thumbnail",
                            paidAmount: "$payment.paidAmount",
                            progressPercentage: "$progress.progressPercentage",
                            enrolledAt: "$enrolledAt",
                            status: "$status",
                            completedAt: "$completedAt",
                            cancelledAt: "$cancelledAt",
                            courseId:"$courseId"
                        },
                    },
                },
            },

            /* ==============================
               FACET MAGIC (IMPORTANT)
            ============================== */
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: input.limit },
                    ],
                    total: [
                        { $count: "count" },
                    ],
                },
            },
        ]);



        const data = result[0].data;
        const total = result[0].total[0]?.count ?? 0;

        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: data.map((doc:any) => ({
                id: doc._id.toString(),
                learner: doc.learner,
                enrollments: doc.enrollments,
            })),
            total,
        };

    }

}
