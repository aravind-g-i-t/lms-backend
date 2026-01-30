// import { EarningStatus } from "@domain/entities/InstructorEarning";
import { GetInstructorEarningsInputDTO, GetInstructorEarningsOutputDTO } from "@application/IUseCases/instructor/IGetInstructorEarnings";
import { EarningStatus } from "@domain/entities/InstructorEarning";
import { IInstructorEarningsRepository } from "@domain/interfaces/IInstructorEarningsRepo";
import { IInstructorWalletRepository } from "@domain/interfaces/IInstructorWalletRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { AppError } from "shared/errors/AppError";



export class GetInstructorWalletAndEarningsUseCase {
  constructor(
    private walletRepo: IInstructorWalletRepository,
    private earningsRepo: IInstructorEarningsRepository
  ) {}

  async execute(input: GetInstructorEarningsInputDTO):Promise<GetInstructorEarningsOutputDTO> {
    
    const wallet = await this.walletRepo.findByInstructorId(input.instructorId);
    
    if (!wallet) {
      throw new AppError("Instructor wallet not found",STATUS_CODES.NOT_FOUND);
    }

    const earningsResult = await this.earningsRepo.getEarnings({
      instructorId: input.instructorId,
      page: input.page,
      limit: input.limit,
      search: input.search,
      status: input.status as EarningStatus|undefined,
    });

    const earnings=earningsResult.earnings.map(earning=>{
      return {
        id:earning.id,
        instructorId:earning.instructorId,
        courseId:earning.courseId.id,
        courseTitle:earning.courseId.title,
        enrollmentId:earning.enrollmentId,
        learnerName:earning.learnerId.name,
        createdAt:earning.createdAt,
        releasedAt:earning.releaseAt,
        cancelledAt:earning.cancelledAt,
        status:earning.status,
        amount:earning.amount
      }
    })

    console.log(earningsResult.total);
    

    
    

    return {
      wallet,
      earnings,
      pagination: {
        totalItems: earningsResult.total,
        totalPages: Math.ceil(earningsResult.total / input.limit),
        currentPage: input.page,
        limit: input.limit,
      },
    //   summary: {
    //     pendingCount: earningsResult.earnings.filter(
    //       e => e.status === EarningStatus.Pending
    //     ).length,
    //     releasedCount: earningsResult.earnings.filter(
    //       e => e.status === EarningStatus.Released
    //     ).length,
    //     cancelledCount: earningsResult.earnings.filter(
    //       e => e.status === EarningStatus.Cancelled
    //     ).length,
    //   },
    };
  }
}
