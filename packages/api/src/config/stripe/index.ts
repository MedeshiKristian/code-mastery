import Stripe from 'stripe';

const stripe = new Stripe((process.env.STRIPE_SECRET).replace(/ /g, '_'));

export default stripe;