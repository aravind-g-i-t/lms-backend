import { ConversationForListing } from "@application/dtos/message/GetConversations";
import { HydratedConversation } from "@domain/interfaces/IConversationRepository";


export class ConversationDTOMapper {
    static toListing(input: HydratedConversation): ConversationForListing {
        return {
            id: input.id,
            course: {
                name: input.courseId.title,
                id: input.courseId.id,
            },
            instructor: {
                name: input.instructorId.name,
                id: input.instructorId.id,
                profilePic: input.instructorId.profilePic,
            },
            lastMessageContent: input.lastMessageContent,
            lastMessageAt: input.lastMessageAt,
            learnerUnreadCount: input.learnerUnreadCount,
            instructorUnreadCount: input.instructorUnreadCount,
            learner: {
                name: input.learnerId.name,
                id: input.learnerId.id,
                profilePic: input.learnerId.profilePic,
            }
        }
    }
}