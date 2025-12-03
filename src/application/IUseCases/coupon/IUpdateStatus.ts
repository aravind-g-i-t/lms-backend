export interface IUpdateCouponStatusUseCase{
    execute(id: string): Promise<void>
}