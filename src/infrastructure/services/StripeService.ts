import { stripe } from "../config/stripeConfig";
import { IPaymentGatewayService } from "@domain/interfaces/IPaymentGatewayService";

export class StripeService implements IPaymentGatewayService {
    async createCheckoutSession({
        amount,
        paymentReason,
        referenceId,
        paymentId,
    }: {
        amount: number;
        paymentReason: string;
        referenceId: string;
        paymentId: string;
    }): Promise<string> {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Course Enrollment",
                            description: "Access to LMS Course",
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/learner/payment/status?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/learner/checkout/${referenceId}`,
            metadata: { paymentId, paymentReason, referenceId },
        });
        return session.id;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async constructWebhookEvent(rawBody: Buffer, sig: string): Promise<any> {
        const secret = process.env.STRIPE_WEBHOOK_SECRET!;
        return stripe.webhooks.constructEvent(rawBody, sig, secret);
    }

    async retrieveCheckoutSession(sessionId: string) {
        return stripe.checkout.sessions.retrieve(sessionId);
    }

}
