export enum LiveSessionStatus {
  Scheduled = "scheduled",
  Live = "live",
  Ended = "ended",
  Cancelled = "cancelled",
}


export interface LiveSession{
    id:string;
    courseId:string;
    courseTitle:string;
    instructorId:string;
    instructorName:string;
    description:string|null;
    status:LiveSessionStatus;
    scheduledAt:Date;
    startedAt:Date|null;
    endedAt:Date|null;
    durationInMinutes:number;
    meetingRoomId:string;
    createdAt:Date;
    updatedAt:Date;
    cancelledAt:Date|null
    recordingURI:string|null;
    isPublished:boolean;
}