// import { NextApiRequest, NextApiResponse } from 'next';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: '2022-11-15',
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { amount } = req.body;

//     try {
//       // Creăm un Payment Intent
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount, // Suma în cenți
//         currency: 'usd',
//         automatic_payment_methods: {
//           enabled: true,
//         },
//       });

//       // Asigură-te că primești un client_secret valid
//       console.log(paymentIntent.client_secret);

//       res.status(200).json({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//       console.error('Eroare la crearea PaymentIntent:', error);
//       res.status(500).json({ error: 'Failed to create PaymentIntent' });
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// }
