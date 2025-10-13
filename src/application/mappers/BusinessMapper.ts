


import { BusinessAsRaw, BusinessForListing } from "@application/dtos/business/BusinessDTO";
import { GetBusinessDataOutputDTO } from "@application/dtos/business/GetBusinessData";
import { UserForSignin } from "@application/dtos/shared/Signin";

interface BusinessForGetBusinesses {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    planName?: string;
    employeeCount: number;
    profilePic: string|null;
    verification: {
        status: string,
        remarks: string | null
    }
}

export class BusinessDTOMapper{
    static toSigninDTO(entity:BusinessAsRaw):UserForSignin{
        return {
            id:entity.id,
            name:entity.name,
            profilePic:entity.profilePic,
        }
    }
    static toGetBusinessesDTO(entity:BusinessForGetBusinesses):BusinessForListing{
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

    static toGetBusinessProfileDTO(entity:BusinessAsRaw):GetBusinessDataOutputDTO{
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