import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, firstName, lastName, products } = req.body;

    try {
      // Debugging: verificăm structura fiecărui produs
      console.log("Products:", products);

      const productsList = products.map((product: any) => {
        // Verificăm structura fiecărui produs
        console.log("Product structure:", product);

        return `
          <div style="display: flex; align-items: center; background-color: #f9f9f9; border-radius: 8px; padding: 10px; margin-bottom: 15px; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);">
            <img src="${product.image}" alt="${product.title}" style="width: 60px; height: 60px; margin-right: 15px; border-radius: 5px; object-fit: cover;" />
            <div>
              <p style="margin: 0; font-weight: bold; font-size: 16px;">${product.title}</p>
              <p style="margin: 0; color: #555;">Quantity: ${product.quantity}</p>
              <p style="margin: 0; color: #555;">Price: $${product.price.toFixed(2)}</p>
            </div>
          </div>
        `;
      }).join('');

      const { data, error } = await resend.emails.send({
        from: 'Your Store <onboarding@resend.dev>',
        to: [email],
        subject: 'Thank you for your order!',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; max-width: 600px; margin: auto; border-radius: 10px; background-color: #ffffff; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #000000; font-size: 26px; text-align: center; margin-bottom: 20px;">Thank you, ${firstName} ${lastName}!</h1>
            <p style="font-size: 16px; text-align: center; margin-bottom: 30px;">We appreciate your purchase. Here are the details of your order:</p>
            <h2 style="font-size: 20px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">Products:</h2>
            <div style="margin-bottom: 30px;">
              ${productsList}
            </div>
            <h3 style="font-size: 18px; color: #333; margin-bottom: 15px;">Message from our team:</h3>
            <p style="margin-top: 0; font-size: 14px; line-height: 1.5; color: #555;">Thank you for choosing us! We are excited to serve you and ensure you receive the best experience. If you have any questions, feel free to reach out to us.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://vellov.com" style="display: inline-block; padding: 10px 20px; font-size: 14px; font-weight: bold; color: #ffffff; background-color: #4a90e2; text-decoration: none; border-radius: 5px;">Visit Our Store</a>
            </div>
          </div>
        `,
      });
      
      if (error) {
        return res.status(400).json({ error });
      }

      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
