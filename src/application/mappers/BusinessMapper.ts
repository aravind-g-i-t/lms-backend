
import { GetBusinessesDTO } from "@application/dtos/business/GetBusinesses";
import { BusinessSigninDTO } from "@application/dtos/shared/Signin";
import { Business } from "@domain/entities/Business";

export class BusinessDTOMapper{
    static toSigninDTO(entity:Business):BusinessSigninDTO{
        return {
            id:entity.id,
            name:entity.name,
            email:entity.email,
            profilePic:entity.profilePic,
            planId:entity.planId,
            planStartDate:entity.planStartDate,
            planEndDate:entity.planEndDate,
            maxEmployees:entity.maxEmployees,
        }
    }
    static toGetBusinessesDTO(entity:any):GetBusinessesDTO{
            return{
                id:entity.id,
                name:entity.name,
                email:entity.email,
                isActive:entity.isActive,
                profilePic:entity.profilePic,
                employeeCount:entity.employeeCount,
                planName:entity.planName?? 'No Active Plan',
            }
        }
}