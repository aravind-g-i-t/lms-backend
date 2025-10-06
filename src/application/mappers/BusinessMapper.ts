
import { GetBusinessesDTO } from "@application/dtos/business/GetBusinesses";
import { GetBusinessProfileDTO } from "@application/dtos/business/GetProfile";
import {  UserSigninDTO } from "@application/dtos/shared/Signin";
import { BusinessForListing } from "@application/IUseCases/business/IGetBusinesses";
import { Business } from "@domain/entities/Business";

export class BusinessDTOMapper{
    static toSigninDTO(entity:Business):UserSigninDTO{
        return {
            id:entity.id,
            name:entity.name,
            profilePic:entity.profilePic,
        }
    }
    static toGetBusinessesDTO(entity:BusinessForListing):GetBusinessesDTO{
            return{
                id:entity.id,
                name:entity.name,
                email:entity.email,
                isActive:entity.isActive,
                profilePic:entity.profilePic||null,
                employeeCount:entity.employeeCount,
                planName:entity.planName?? 'No Active Plan',
                verification:entity.verification

            }
        }

    static toGetBusinessProfileDTO(entity:Business):GetBusinessProfileDTO{
            return{
                name:entity.name,
                email:entity.email,
                profilePic:entity.profilePic,
                verification:entity.verification,
                hasPassword:entity.password?true:false,
                joiningDate:entity.joiningDate,
                businessDomain:entity.businessDomain,
                website:entity.website,
                location:entity.location,
                license:entity.license
            }
        }
}