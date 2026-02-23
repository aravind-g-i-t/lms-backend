/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IPaymentGatewayService {
  createCheckoutSession(input: {
    amount: number;
    paymentReason: string;
    referenceId:string;
    paymentId: string;
  }): Promise<string>;

 
 
  retrieveCheckoutSession(sessionId: string): Promise<any>;

}
