import { GetInstructorsUseCase } from "@application/useCases/instructor/GetInstructors";
import { instructorRepository } from "./instructorRepository";
import { InstructorController } from "@presentation/controllers/InstructorController";
import { UpdateInstructorStatusUseCase } from "@application/useCases/instructor/UpdateInstructorStatus";
import { GetInstructorDataUseCase } from "@application/useCases/instructor/GetInstructorData";
import { UpdateInstructorPasswordUseCase } from "@application/useCases/instructor/UpdatePassword";
import { UpdateInstructorDataUseCase } from "@application/useCases/instructor/UpdateInstructorData";
import { InstructorApplyForVeficationUseCase } from "@application/useCases/instructor/ApplyForVerification";
import { UpdateInstructorVerificationStatusUseCase } from "@application/useCases/instructor/UpdateVerificationStatus";
import { s3Service } from "../shared/s3Controller";

const getInstructorsUseCase = new GetInstructorsUseCase(instructorRepository,s3Service);

const updateInstructorStatusUseCase=new UpdateInstructorStatusUseCase(instructorRepository);

const getInstructorDataUseCase=new GetInstructorDataUseCase(instructorRepository,s3Service)

const updateInstructorPasswordUseCase=new UpdateInstructorPasswordUseCase(instructorRepository);

const updateInstructorDataUseCase=new UpdateInstructorDataUseCase(instructorRepository)

const applyForVerificationUseCase=new InstructorApplyForVeficationUseCase(instructorRepository);

const updateVerificationStatusUseCase=new UpdateInstructorVerificationStatusUseCase(instructorRepository)



export const instructorController=new InstructorController(getInstructorsUseCase,updateInstructorStatusUseCase,getInstructorDataUseCase,updateInstructorDataUseCase,updateInstructorPasswordUseCase,applyForVerificationUseCase,updateVerificationStatusUseCase);