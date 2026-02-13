import { IGetWalletDataUseCase, WalletData } from "@application/IUseCases/wallet/IGetWalletData";
import { IWalletRepository } from "@domain/interfaces/IWalletRepository";
import { IWalletTransactionRepository } from "@domain/interfaces/IWalletTxnRepository";
import { STATUS_CODES } from "shared/constants/httpStatus";
import { MESSAGES } from "shared/constants/messages";
import { AppError } from "shared/errors/AppError";

export class GetWalletDataUseCase implements IGetWalletDataUseCase{
    constructor(
        private _walletRepo:IWalletRepository,
        private _walletTransactionRepo:IWalletTransactionRepository
    ){}

    async execute({learnerId,page,limit}:{learnerId:string; page:number; limit:number}):Promise<WalletData>{
        const wallet= await this._walletRepo.findOne({learnerId})
        if(!wallet){
            throw new AppError(MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
        }
        const transactionData= await this._walletTransactionRepo.findManyByLearnerId({
            learnerId,
            page,
            limit
        });

        const transactions= transactionData.transactions.map(t=>{
            return {
                id:t.id,
                type:t.type,
                reason:t.reason,
                amount:t.amount,
                courseTitle:t.enrollmentId?t.enrollmentId.courseTitle:null,
                createdAt:t.createdAt
            }
        })

        return{
            balance:wallet.balance,
            transactions,
            totalCount:transactionData.totalCount,
            totalPages:transactionData.totalPages
        }

    }
}