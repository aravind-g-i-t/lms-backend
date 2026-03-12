export interface IPaymentGatewayService {
  createCheckoutSession(input: {
    amount: number;
    paymentReason: string;
    referenceId:string;
    paymentId: string;
  }): Promise<string>;

 
 
  retrieveCheckoutSession(sessionId: string): Promise<unknown>;

}
