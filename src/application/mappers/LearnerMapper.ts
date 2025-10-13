import { GetLearnerDataOutput } from "@application/dtos/learner/GetLearnerData"
import { LearnerAsRaw, LearnerForListing } from "@application/dtos/learner/LearnerDTO"
import { UserForSignin } from "@application/dtos/shared/Signin"


export class LearnerDTOMapper{
    static toSigninDTO(entity:LearnerAsRaw):UserForSignin{
            return {
                id:entity.id,
                name:entity.name,
                profilePic:entity.profilePic,
            }
        }

    static toGetLearnersDTO(entity:LearnerAsRaw):LearnerForListing{
        return{
            id:entity.id,
            name:entity.name,
            email:entity.email,
            isActive:entity.isActive,
            profilePic:entity.profilePic
        }
    }
    
    static toProfileDTO(entity:LearnerAsRaw):GetLearnerDataOutput{
        return{
            name:entity.name,
            email:entity.email,
            profilePic:entity.profilePic,
            joiningDate:entity.joiningDate,
            hasPassword:entity.password?true:false
        }
    }
}