import { LiveSessionStatus } from "@domain/entities/LiveSession";

interface LiveSession {
  id: string;
  courseTitle: string;
  instructorName: string;
  description: string|null;
  scheduledAt: Date;
  startedAt: Date|null;
  endedAt: Date|null;
  durationInMinutes: number;
  status: LiveSessionStatus
  isPublished: boolean;
}

export interface GetLiveSessionsForLearnerOutput{
    sessions:LiveSession[],
    totalCount:number;
    totalPages:number;
}