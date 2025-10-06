import { GetBusinessesUseCase } from "@application/useCases/business/GetBusinesses";
import { businessRepository } from "./businessRepository";
import { BusinessController } from "@presentation/controllers/BusinessController";
import { UpdateBusinessStatusUseCase } from "@application/useCases/business/UpdateBusinessStatus";
import { GetBusinessDataUseCase } from "@application/useCases/business/GetBusinessData";
import { UpdateBusinessDataUseCase } from "@application/useCases/business/UpdateBusinessData";
import { UpdateBusinessPasswordUseCase } from "@application/useCases/business/UpdatePassword";
import { ApplyForBusinessVerificationUseCase } from "@application/useCases/business/ApplyForVerification";
import { UpdateBusinessVerificationStatusUseCase } from "@application/useCases/business/UpdateVerificationStatus";

const getBusinessesUseCase=new GetBusinessesUseCase(businessRepository)

const updateBusinessStatusUseCase=new UpdateBusinessStatusUseCase(businessRepository);

const getBusinessesDataUseCase=new GetBusinessDataUseCase(businessRepository);

const updateBususinessDataUseCase=new UpdateBusinessDataUseCase(businessRepository);

const updateBusinessPasswordUseCase=new UpdateBusinessPasswordUseCase(businessRepository);

const applyForBusinessVerificaton=new ApplyForBusinessVerificationUseCase(businessRepository);

const updateVerificationStatusUseCase=new UpdateBusinessVerificationStatusUseCase(businessRepository)

export const businessController=new BusinessController(getBusinessesUseCase,updateBusinessStatusUseCase,getBusinessesDataUseCase,updateBususinessDataUseCase,updateBusinessPasswordUseCase,applyForBusinessVerificaton,updateVerificationStatusUseCase);