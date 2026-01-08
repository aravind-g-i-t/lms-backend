import { IConversationRepository, HydratedConversation } from "@domain/interfaces/IConversationRepository";
import { ConversationModel } from "../models/ConversationModel";
import { Conversation, ConversationStatus } from "@domain/entities/Conversation";
import { UserRole } from "@domain/entities/Message";
import { ConversationMapper, HydratedConversationDoc } from "../mappers/ConversationMapper";
import { CourseDoc } from "../models/CourseModel";
import { InstructorDoc } from "../models/InstructorModel";
import { LearnerDoc } from "../models/LearnerModel";
import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "./BaseRepository";


export class ConversationRepositoryImpl extends BaseRepository<Conversation> implements IConversationRepository {

    constructor() {
        super(ConversationModel, ConversationMapper)
    }



    async findHydratedById(id: string): Promise<HydratedConversation | null> {
        const doc = await ConversationModel
            .findById(id)
            .populate<{ courseId: CourseDoc }>("courseId")
            .populate<{ instructorId: InstructorDoc }>("instructorId")
            .populate<{ learnerId: LearnerDoc }>("learnerId");

        return doc ? ConversationMapper.toPopulatedDomain(doc) : null
    }

    async findAllByLearner(learnerId: string): Promise<HydratedConversation[]> {
        const docs = await ConversationModel
            .find({ learnerId })
            .populate<{ courseId: CourseDoc }>("courseId")
            .populate<{ instructorId: InstructorDoc }>("instructorId")
            .populate<{ learnerId: LearnerDoc }>("learnerId")
            .sort({ updatedAt: -1 })

        return docs.map(doc => ConversationMapper.toPopulatedDomain(doc));
    }

    async findAllByInstructor({
        instructorId,
        page,
        limit,
        search,
        courseId,
    }: {
        instructorId: string;
        page: number;
        limit: number;
        search?: string;
        courseId?: string;
    }): Promise<{
        conversations: HydratedConversation[];
        totalCount: number;
        totalPages: number;
    }> {



        const skip = (page - 1) * limit;

        const matchStage: {
            instructorId: Types.ObjectId;
            courseId?: Types.ObjectId;
        } = {
            instructorId: new Types.ObjectId(instructorId),
        };


        if (courseId) {
            matchStage.courseId = new Types.ObjectId(courseId);
        }

        const pipeline: PipelineStage[] = [];

        pipeline.push({ $match: matchStage });



        // populate learner
        pipeline.push({
            $lookup: {
                from: "learners",
                localField: "learnerId",
                foreignField: "_id",
                as: "learnerId",
            },
        });


        pipeline.push({ $unwind: "$learnerId" });



        // search by learner name
        if (search) {
            pipeline.push({
                $match: {
                    "learnerId.name": { $regex: search, $options: "i" },
                },
            });
        }



        // sort latest conversation first
        pipeline.push({ $sort: { updatedAt: -1 } });


        // pagination + total count
        pipeline.push({
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: limit },

                    {
                        $lookup: {
                            from: "courses",
                            localField: "courseId",
                            foreignField: "_id",
                            as: "courseId",
                        },
                    },
                    { $unwind: "$courseId" },

                    {
                        $lookup: {
                            from: "instructors",
                            localField: "instructorId",
                            foreignField: "_id",
                            as: "instructorId",
                        },
                    },
                    { $unwind: "$instructorId" },
                ],
                totalCount: [{ $count: "count" }],
            },
        });


        const result = await ConversationModel.aggregate(pipeline);

        const conversations = result[0].data.map((doc: HydratedConversationDoc) =>
            ConversationMapper.toPopulatedDomain(doc)
        );
        console.log(conversations);



        const totalCount = result[0].totalCount[0]?.count || 0;

        return {
            conversations,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        };
    }





    async updateLastMessage(conversationId: string, content: string, at: Date): Promise<void> {
        await ConversationModel.updateOne(
            { _id: conversationId },
            { lastMessageContent: content, lastMessageAt: at }
        );
    }

    async incrementUnreadCount(conversationId: string, targetRole: UserRole): Promise<void> {
        const field = targetRole === UserRole.Learner
            ? "learnerUnreadCount"
            : "instructorUnreadCount";

        await ConversationModel.updateOne(
            { _id: conversationId },
            { $inc: { [field]: 1 } }
        );
    }

    async resetUnreadCount(conversationId: string, role: UserRole): Promise<void> {
        const field = role === UserRole.Learner
            ? "learnerUnreadCount"
            : "instructorUnreadCount";

        await ConversationModel.updateOne(
            { _id: conversationId },
            { [field]: 0 }
        );
    }

    async updateStatus(conversationId: string, status: ConversationStatus): Promise<void> {
        await ConversationModel.updateOne({ _id: conversationId }, { status });
    }

    async getInstructorUnreadCount(instructorId: string): Promise<number> {
        const result = await ConversationModel.aggregate([
            {
                $match: {
                    instructorId: new Types.ObjectId(instructorId),
                    status: ConversationStatus.Active,
                },
            },
            {
                $group: {
                    _id: null,
                    totalUnread: { $sum: "$instructorUnreadCount" },
                },
            },
        ]);

        return result[0]?.totalUnread || 0;
    }


    async getLearnerUnreadCount(learnerId: string): Promise<number> {
        const result = await ConversationModel.aggregate([
            {
                $match: {
                    learnerId: new Types.ObjectId(learnerId),
                    status: ConversationStatus.Active,
                },
            },
            {
                $group: {
                    _id: null,
                    totalUnread: { $sum: "$learnerUnreadCount" },
                },
            },
        ]);

        return result[0]?.totalUnread || 0;
    }

}
