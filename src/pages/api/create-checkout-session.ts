// import { NextApiRequest, NextApiResponse } from 'next';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: '2022-11-15', // Actualizează după caz
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { amount } = req.body;

//     try {
//       // Creăm un Payment Intent
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount, // Suma în cenți (de exemplu: 5000 = 50 USD)
//         currency: 'usd',
//         automatic_payment_methods: {
//           enabled: true,
//         },
//       });

//       // Returnăm client_secret pentru frontend
//       res.status(200).json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//       res.status(500).json({ error: 'Eroare la crearea PaymentIntent' });
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Metoda nu este permisă');
//   }
// }
