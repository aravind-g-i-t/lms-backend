import { GetBusinessesUseCase } from "@application/useCases/business/GetBusinesses";
import { businessRepository } from "./businessRepository";
import { BusinessController } from "@presentation/controllers/BusinessController";
import { UpdateBusinessStatusUseCase } from "@application/useCases/business/UpdateBusinessStatus";

const getBusinessesUseCase=new GetBusinessesUseCase(businessRepository)
const updateBusinessStatusUseCase=new UpdateBusinessStatusUseCase(businessRepository)

export const businessController=new BusinessController(getBusinessesUseCase,updateBusinessStatusUseCase);