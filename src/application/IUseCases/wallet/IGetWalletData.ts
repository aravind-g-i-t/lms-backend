export interface WalletData {
  balance: number;
  transactions: Transaction[];
  totalPages:number;
  totalCount:number;
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  reason: 'course_purchase' | 'refund' | 'redeem';
  amount: number;
  courseTitle: string | null;
  createdAt: Date;
}

export interface IGetWalletDataUseCase{
    execute(input:{learnerId:string,page:number; limit:number}):Promise<WalletData>
}