export interface Review {
    id: string,

    courseId: string,
    learnerId: string,

    rating: number,
    reviewText: string | null,

    isVisible: boolean,
    isEdited: boolean,

    createdAt: Date,
    updatedAt: Date
}
