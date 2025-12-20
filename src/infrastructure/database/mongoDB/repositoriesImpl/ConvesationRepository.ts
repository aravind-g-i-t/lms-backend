import { IConversationRepository, HydratedConversation } from "@domain/interfaces/IConversationRepository";
import { ConversationModel } from "../models/ConversationModel";
import { Conversation, ConversationStatus } from "@domain/entities/Conversation";
import { UserRole } from "@domain/entities/Message";
import { ConversationMapper, HydratedConversationDoc } from "../mappers/ConversationMapper";
import { CourseDoc } from "../models/CourseModel";
import { InstructorDoc } from "../models/InstructorModel";
import { LearnerDoc } from "../models/LearnerModel";
import {  PipelineStage, Types } from "mongoose";


export class ConversationRepositoryImpl implements IConversationRepository {

    async create(input: Partial<Conversation>): Promise<Conversation> {
        const created = await ConversationModel.create(input);
        return ConversationMapper.toDomain(created);
    }

    async findById(id: string): Promise<Conversation | null> {
        const doc = await ConversationModel.findById(id);
        return doc ? ConversationMapper.toDomain(doc) : null;
    }

    async findHydratedById(id: string): Promise<HydratedConversation | null> {
        const doc = await ConversationModel
            .findById(id)
            .populate<{ courseId: CourseDoc }>("courseId")
            .populate<{ instructorId: InstructorDoc }>("instructorId")
            .populate<{ learnerId: LearnerDoc }>("learnerId");

        return doc ? ConversationMapper.toPopulatedDomain(doc) : null
    }

    async findByCourseAndLearner(
        { courseId, learnerId }:
            {
                courseId: string,
                learnerId: string
            }
    ): Promise<Conversation | null> {
        const doc = await ConversationModel.findOne({
            courseId,
            learnerId,
        });

        return doc ? ConversationMapper.toDomain(doc) : null;
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
            instructorId:new Types.ObjectId(instructorId),
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



    async findByIdAndUpdate(id: string, updates: Partial<Conversation>): Promise<Conversation> {
        const updated = await ConversationModel.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );
        return ConversationMapper.toDomain(updated!);
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
}
