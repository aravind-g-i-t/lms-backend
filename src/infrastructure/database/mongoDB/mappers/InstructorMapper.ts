import { Instructor } from "@domain/entities/Instructor";
import { InstructorDoc } from "../models/InstructorModel";

export class InstructorMapper {
    static toDomain(doc: InstructorDoc ): Instructor  {

        return {
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            isActive: doc.isActive,
            isVerified: doc.isVerified,
            walletBalance: doc.walletBalance,
            password: doc.password,
            profilePic: doc.profilePic,
            resume: doc.resume,
            googleId:doc.googleId,
            joiningDate:doc.createdAt,
            website:doc.website,
            bio:doc.bio
        };
    }
}
