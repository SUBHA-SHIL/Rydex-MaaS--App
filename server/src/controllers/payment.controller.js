import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

export const createPaymentIntent =
  async (req, res) => {

  try {

    const { amount } = req.body;

    const paymentIntent =
      await stripe.paymentIntents.create({
        amount:
          amount * 100,

        currency: "inr",

        automatic_payment_methods: {
          enabled: true,
        },
      });

    res.json({
      clientSecret:
        paymentIntent.client_secret,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Payment failed",
    });
  }
};