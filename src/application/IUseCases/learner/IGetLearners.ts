import { GetLearnersInput, GetLearnersOutput } from "@application/dtos/learner/GetLearners";




export interface IGetLearnersUseCase{
    execute(input:GetLearnersInput):Promise<GetLearnersOutput>
}
