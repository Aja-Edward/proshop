import { useStripe, } from '@stripe/react-stripe-js'
import dotenv from "dotenv";
dotenv.config();



const makeStripePayment = async (req, res) => {
    const stripe = useStripe(process.env.STRIPE_SECRET_KEY)
    const total = req.query.total

    try {
        const intent = await stripe.paymentIntents.create({
            amount: total,
            currency: 'USD'
        })
        res.status(200).send({ client_secret: intent.client_secret })
    } catch (error) {
        res.status(402)
        throw new Error(error)
    }

}


export default makeStripePayment