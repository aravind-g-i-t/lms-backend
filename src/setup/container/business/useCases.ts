import { GetBusinessesUseCase } from "@application/useCases/business/GetBusinesses";
import { businessRepository } from "./repositories";
import { s3Service } from "../shared/services";
import { UpdateBusinessStatusUseCase } from "@application/useCases/business/UpdateBusinessStatus";
import { GetBusinessDataUseCase } from "@application/useCases/business/GetBusinessData";
import { UpdateBusinessDataUseCase } from "@application/useCases/business/UpdateBusinessData";
import { UpdateBusinessPasswordUseCase } from "@application/useCases/business/UpdatePassword";
import { ApplyForBusinessVerificationUseCase } from "@application/useCases/business/ApplyForVerification";
import { UpdateBusinessVerificationStatusUseCase } from "@application/useCases/business/UpdateVerificationStatus";

export const getBusinessesUseCase=new GetBusinessesUseCase(businessRepository,s3Service)


export const updateBusinessStatusUseCase=new UpdateBusinessStatusUseCase(businessRepository);

export const getBusinessesDataUseCase=new GetBusinessDataUseCase(businessRepository,s3Service);

export const updateBususinessDataUseCase=new UpdateBusinessDataUseCase(businessRepository);

export const updateBusinessPasswordUseCase=new UpdateBusinessPasswordUseCase(businessRepository);

export const applyForBusinessVerificaton=new ApplyForBusinessVerificationUseCase(businessRepository);

export const updateVerificationStatusUseCase=new UpdateBusinessVerificationStatusUseCase(businessRepository);

