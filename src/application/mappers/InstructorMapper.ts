import { GetInstructorDataOutputDTO } from "@application/dtos/instructor/GetInstructorData"
import { InstructorAsRaw, InstructorForListing } from "@application/dtos/instructor/InstructorDTO"
import { UserForSignin } from "@application/dtos/shared/Signin"

export class InstructorDTOMapper {
    static toSigninDTO(entity: InstructorAsRaw): UserForSignin {
        return {
            id: entity.id,
            name: entity.name,
            profilePic: entity.profilePic,
        }
    }
    static toGetInstructorsDTO(entity: InstructorAsRaw): InstructorForListing {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            isActive: entity.isActive,
            joiningDate: entity.joiningDate,
            profilePic: entity.profilePic,
            verification: entity.verification
        }
    }

    static toGetInstructorProfile(entity: InstructorAsRaw): GetInstructorDataOutputDTO {
        return {
            name: entity.name,
            email: entity.email,
            joiningDate: entity.joiningDate,
            profilePic: entity.profilePic,
            website: entity.website,
            verification: entity.verification,
            hasPassword: entity.password ? true : false,
            bio: entity.bio,
            designation: entity.designation,
            expertise: entity.expertise,
            resume: entity.resume,
            rating: entity.rating,
            identityProof: entity.identityProof
        }
    }
}