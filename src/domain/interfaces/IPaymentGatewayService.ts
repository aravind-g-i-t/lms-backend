export interface IPaymentGatewayService {
  createCheckoutSession(input: {
    amount: number;
    paymentReason: string;
    referenceId:string;
    paymentId: string;
  }): Promise<string>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructWebhookEvent(rawBody: Buffer, signature: string): Promise<any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retrieveCheckoutSession(sessionId: string): Promise<any>;

}
