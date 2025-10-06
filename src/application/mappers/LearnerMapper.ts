import { GetLearnersDTO } from "@application/dtos/learner/GetLearners";
import { GetLearnerProfileDTO } from "@application/dtos/learner/GetProfile";
import {  UserSigninDTO } from "@application/dtos/shared/Signin";
import { Learner } from "@domain/entities/Learner";

export class LearnerDTOMapper{
    static toSigninDTO(entity:Learner):UserSigninDTO{
            return {
                id:entity.id,
                name:entity.name,
                profilePic:entity.profilePic,
            }
        }

    static toGetLearnersDTO(entity:Learner):GetLearnersDTO{
        return{
            id:entity.id,
            name:entity.name,
            email:entity.email,
            isActive:entity.isActive,
            profilePic:entity.profilePic
        }
    }
    
    static toProfileDTO(entity:Learner):GetLearnerProfileDTO{
        return{
            name:entity.name,
            email:entity.email,
            profilePic:entity.profilePic,
            joiningDate:entity.joiningDate,
            hasPassword:entity.password?true:false
        }
    }
}