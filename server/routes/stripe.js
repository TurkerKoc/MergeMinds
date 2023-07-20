import express from "express";
import Stripe from "stripe";
import MergeUser from "../models/MergeUser.js"; // Adjust to the actual path of your User model
import dotenv from 'dotenv';
dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const endpointSecret = "whsec_0c57272d3b7a43cf59b9369c36f2b9f0d4a64ec8ecba4327490a33517bd01f28";


// Webhook route should be placed before body parsing middleware
// Webhook route should be placed before body parsing middleware
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
  
      let event;
  
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log('Webhook verified!')
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
  
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          // console.log(session)
          if(session.customer_details) {
            stripe.customers
              .retrieve(session.customer)
              .then(async (customer) => {
                try {
                  console.log(customer.metadata.totalCoins)
                  updateUserCoinCount(customer.metadata.userId, Number(customer.metadata.totalCoins));
                } catch (err) {
                  console.log(err);
                }
              })
              .catch((err) => console.log(err.message));
          } else {
            console.log('No customer information found in the session data.');
          }
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
  
      res.status(200).end();
    }
  );
  
  // Then, after the webhook route, place body parsing middleware and other routes
  router.use(express.json()); // JSON body parsing middleware
  
  router.post("/create-checkout-session", async (req, res) => {
    const { userId, totalCoins, totalPrice } = req.body;
    let lastVisited = req.body.lastVisited;
    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
        totalCoins: totalCoins,
        totalPrice : totalPrice
      },
    });

    if(lastVisited === "submission") {
      lastVisited = `submission/${userId}`;
    }
    else if(lastVisited === "webinar") {
      lastVisited = `webinar/${userId}`;
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
            price_data: {
                currency: "eur",
                product_data: {
                name: `MergeCoins`,
                description: `Buy ${totalCoins} MergeCoins`,
                },
                unit_amount: totalPrice * 100, // price per coin, adjust as necessary
            },
            quantity: 1,
            },
        ],
        mode: "payment",
        customer: customer.id,
        success_url: `${process.env.CLIENT_URL}/${lastVisited}?payment=success`,
        // success_url: `${process.env.CLIENT_URL}/newsfeed`,
        cancel_url: `${process.env.CLIENT_URL}/token/${userId}`,
        metadata: {
            userId: userId,
            totalCoins: totalCoins,
            totalPrice : totalPrice
        },
    });

    res.send({ url: session.url });
  });
  // Function to update the user's coin count
  const updateUserCoinCount = async (userId, totalCoins) => {
    const user = await MergeUser.findById(userId);
    // console.log('total coins purchased-------->', user.mergeCoins);
    // console.log(totalCoins);
    user.mergeCoins += totalCoins; // assuming User model has a 'mergeCoin' field
  
    await user.save();
  };

export default router;
