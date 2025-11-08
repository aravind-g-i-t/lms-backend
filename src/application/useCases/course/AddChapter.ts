import { AddChapterOutput } from "@application/dtos/course/AddChapter";
import { IAddChapterUseCase } from "@application/IUseCases/course/IAddChapter";
import { ICourseRepository } from "@domain/interfaces/ICourseRepository";
import { IS3Service } from "@domain/interfaces/IS3Service";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";
import { IdGenerator } from "shared/utils/IdGenerator";

export class AddChapterUseCase implements IAddChapterUseCase{
    constructor(
        private _courseRepository:ICourseRepository,
        private _fileStorageService:IS3Service,
    ){}

    async execute(courseId: string, moduleId: string, chapter: { title: string; description: string; video: string; duration: number; }): Promise<AddChapterOutput> {
        console.log(chapter);
        
        const newChapter={
                id:IdGenerator.generate(),
                title:chapter.title,
                description:chapter.description,
                duration:chapter.duration,
                video:chapter.video,
                resources:[]
            }
        const updated=await this._courseRepository.addChapter({
            courseId,
            moduleId,
            chapter:newChapter
        });
        
        if(!updated){
            throw new AppError("Failed to add module.",STATUS_CODES.BAD_REQUEST)
        }
        const videoUrl= await this._fileStorageService.getDownloadUrl(chapter.video);
        return {...newChapter,video:videoUrl};
        
    }
    
};



