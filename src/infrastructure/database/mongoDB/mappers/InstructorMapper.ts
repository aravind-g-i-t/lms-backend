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
            expertise:doc.expertise,
            rating:doc.rating||null,
            designation:doc.designation||null,
            password: doc.password||null,
            profilePic: doc.profilePic||null,
            resume: doc.resume||null,
            googleId:doc.googleId||null,
            joiningDate:doc.createdAt,
            website:doc.website||null,
            bio:doc.bio||null,
        };
    }

    static toSecureDomain(doc: InstructorDoc ): Instructor  {

        return {
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            isActive: doc.isActive,
            isVerified: doc.isVerified,
            walletBalance: doc.walletBalance,
            expertise:doc.expertise,
            rating:doc.rating||null,
            designation:doc.designation||null,
            password:null,
            profilePic: doc.profilePic||null,
            resume: doc.resume||null,
            googleId:doc.googleId||null,
            joiningDate:doc.createdAt,
            website:doc.website||null,
            bio:doc.bio||null,
        };
    }
}
