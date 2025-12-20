import {  Attachment } from "@domain/entities/Message";

export interface ConversationForListing {
  id: string|null;
  course: {
    name: string;
    id: string;
  };
  instructor: {
    name: string;
    id: string;
    profilePic: string|null;
  };
  learner:{
    name:string;
    id:string;
    profilePic:string|null
  }
  lastMessageContent: string | null;
  lastMessageAt: Date | null;
  learnerUnreadCount: number;
  instructorUnreadCount:number;
  isOnline:boolean
}


export interface MessageForListing {
  id: string;
  senderId: string;
  content: string;
  attachments: Attachment[];
  createdAt: Date;
  isRead: boolean;
  readAt: Date|null;
}

export interface GetConversationsOutput{
    conversations:ConversationForListing[],
    messages:MessageForListing[]
}