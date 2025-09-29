import { GetInstructorsUseCase } from "@application/useCases/instructor/GetInstructors";
import { instructorRepository } from "./instructorRepository";
import { InstructorController } from "@presentation/controllers/InstructorController";
import { UpdateInstructorStatusUseCase } from "@application/useCases/instructor/UpdateInstructorStatus";
import { GetInstructorDataUseCase } from "@application/useCases/instructor/GetInstructorData";
import { UpdateInstructorPasswordUseCase } from "@application/useCases/instructor/UpdatePassword";
import { UpdateInstructorDataUseCase } from "@application/useCases/instructor/UpdateInstructorData";
import { InstructorApplyForVeficationUseCase } from "@application/useCases/instructor/ApplyForVerification";

const getInstructorsUseCase = new GetInstructorsUseCase(instructorRepository);

const updateInstructorStatusUseCase=new UpdateInstructorStatusUseCase(instructorRepository);

const getInstructorDataUseCase=new GetInstructorDataUseCase(instructorRepository)

const updateInstructorPasswordUseCase=new UpdateInstructorPasswordUseCase(instructorRepository);

const updateInstructorDataUseCase=new UpdateInstructorDataUseCase(instructorRepository)

const applyForVerificationUseCase=new InstructorApplyForVeficationUseCase(instructorRepository);





export const instructorController=new InstructorController(getInstructorsUseCase,updateInstructorStatusUseCase,getInstructorDataUseCase,updateInstructorDataUseCase,updateInstructorPasswordUseCase,applyForVerificationUseCase)