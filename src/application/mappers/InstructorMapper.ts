import { GetInstructorsDTO } from "@application/dtos/instructor/GetInstructors";
import { InstructorSigninDTO } from "@application/dtos/shared/Signin";
import { Instructor } from "@domain/entities/Instructor";
export class InstructorDTOMapper{
    static toSigninDTO(entity:Instructor):InstructorSigninDTO{
        return {
            id:entity.id,
            name:entity.name,
            email:entity.email,
            walletBalance:entity.walletBalance,
            profilePic:entity.profilePic,
            isVerified:entity.isVerified,
            resume:entity.resume,
            bio:entity.bio,
            website:entity.website
        }
    }
    static toGetInstructorsDTO(entity:any):GetInstructorsDTO{
            return{
                id:entity.id,
                name:entity.name,
                email:entity.email,
                isActive:entity.isActive,
                isVerified:entity.isVerified,
                joiningDate:entity.joiningDate,
                profilePic:entity.profilePic,

                
            }
        }
}