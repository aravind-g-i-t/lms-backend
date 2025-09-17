import { GetInstructorsUseCase } from "@application/useCases/instructor/GetInstructors";
import { instructorRepository } from "./instructorRepository";
import { InstructorController } from "@presentation/controllers/InstructorController";
import { UpdateInstructorStatusUseCase } from "@application/useCases/instructor/UpdateInstructorStatus";

const getInstructorsUseCase = new GetInstructorsUseCase(instructorRepository);
const updateInstructorStatusUseCase=new UpdateInstructorStatusUseCase(instructorRepository)


export const instructorController=new InstructorController(getInstructorsUseCase,updateInstructorStatusUseCase)