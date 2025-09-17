import { GetLearnersDTO } from "@application/dtos/learner/GetLearners";
import { LearnerSigninDTO } from "@application/dtos/shared/Signin";
import { Learner } from "@domain/entities/Learner";

export class LearnerDTOMapper{
    static toSigninDTO(entity:Learner):LearnerSigninDTO{
        return {
            id:entity.id,
            name:entity.name,
            email:entity.email,
            walletBalance:entity.walletBalance,
            profilePic:entity.profilePic
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
}