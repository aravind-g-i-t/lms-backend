import { GetInstructorsDTO } from "@application/dtos/instructor/GetInstructors";
import { GetInstructorProfileDTO } from "@application/dtos/instructor/GetProfile";
import { UserSigninDTO } from "@application/dtos/shared/Signin";
import { Instructor } from "@domain/entities/Instructor";
export class InstructorDTOMapper {
    static toSigninDTO(entity: Instructor): UserSigninDTO {
        return {
            id: entity.id,
            name: entity.name,
            profilePic: entity.profilePic,
        }
    }
    static toGetInstructorsDTO(entity: any): GetInstructorsDTO {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            isActive: entity.isActive,
            joiningDate: entity.joiningDate,
            profilePic: entity.profilePic,


        }
    }

    static toGetInstructorProfile(entity: Instructor): GetInstructorProfileDTO {
        return {
            name: entity.name,
            email: entity.email,
            joiningDate: entity.joiningDate,
            profilePic: entity.profilePic,
            website:entity.website,
            verification:entity.verification,
            hasPassword:entity.password?true:false,
            bio:entity.bio,
            designation:entity.designation,
            expertise:entity.expertise,
            resume:entity.resume,
            rating:entity.rating
        }
    }
}