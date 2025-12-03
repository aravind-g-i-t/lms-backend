export interface CategoryForListing {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

export interface CategoryAsRaw {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}