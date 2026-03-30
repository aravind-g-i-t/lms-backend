import { IEnrollmentRepository } from "@domain/interfaces/IEnrollmentRepository";
import { ILiveSessionRepository } from "@domain/interfaces/ILiveSessionRepository";

interface SessionDetails {
    sessionId: string;
    courseId: string;
    courseTitle: string;
    instructorName: string;
    scheduledAt: Date;
    startedAt: Date | null;
    endedAt: Date | null;
    cancelledAt: Date | null;
}


export class GetSessionDetailsUseCase {
    constructor(
        private _liveSessionRepository: ILiveSessionRepository,
        private _enrollmentRepository: IEnrollmentRepository,

    ) { }

    async execute(sessionId: string): Promise<{sessionDetails: SessionDetails, learnerIds: string[]}> {
        const session = await this._liveSessionRepository.findById(sessionId);
        if (!session) {
            throw new Error("Live session not found");
        }
        const sessionDetails: SessionDetails = {
            sessionId: session.id,
            courseId: session.courseId,
            courseTitle: session.courseTitle,
            instructorName: session.instructorName,
            scheduledAt: session.scheduledAt,
            startedAt: session.startedAt,
            endedAt: session.endedAt,
            cancelledAt: session.cancelledAt
        };
        const learnerIds = await this._enrollmentRepository.getEnrolledLearners(session.courseId);

        return { sessionDetails, learnerIds };
    }
}