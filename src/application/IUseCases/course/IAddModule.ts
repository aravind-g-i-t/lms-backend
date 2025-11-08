import { AddModuleOutput } from "@application/dtos/course/AddModule";

export interface IAddModuleUseCase{
    execute(id:string,module:{title:string;description:string}):Promise<AddModuleOutput>
}