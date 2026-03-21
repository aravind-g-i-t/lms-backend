
export interface CheckoutSession {
  payment_status: "paid" | "unpaid" | "no_payment_required";
  status: "open" | "complete" | "expired" | null;
  payment_intent: string | null;
  metadata: {
    paymentId: string;
    referenceId: string;
    paymentReason: string;
    [key: string]: string;
  };
}


export interface IPaymentGatewayService {
  createCheckoutSession(input: {
    amount: number;
    paymentReason: string;
    referenceId: string;
    paymentId: string;
  }): Promise<string>;

  retrieveCheckoutSession(sessionId: string): Promise<CheckoutSession>;
}