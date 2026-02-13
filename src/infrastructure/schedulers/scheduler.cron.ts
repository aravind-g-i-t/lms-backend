import { releaseInstructorEarningsUseCase } from "@setup/container/instructor/useCases";
import cron from "node-cron";


export const startCronScheduler= () =>{
    
    cron.schedule("*/5 * * * *", async ()=>{
        await releaseInstructorEarningsUseCase.execute();
    })
};