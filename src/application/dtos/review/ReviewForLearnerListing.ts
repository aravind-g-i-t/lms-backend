export interface ReviewForLearnerListing {
    id: string;
    learner: {
        id: string;
        name: string;
        profilePic: string | null;
    };
    rating: number;
    reviewText: string | null;
    createdAt: Date;
    isEdited: boolean;
}

export interface MyReviewForLIsting{
    id:string;
    rating:number;
    reviewText:string|null;
    createdAt:Date;
    isEdited:boolean
}