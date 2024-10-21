import emailjs from 'emailjs-com';

interface EmailData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  products: string;
  terms: string;
  status: string;
}

interface EmailSenderProps {
  emailData: EmailData;
  onSuccess: () => void;
  onError: (error: any) => void;
}

export const EmailSender: React.FC<EmailSenderProps> = ({ emailData, onSuccess, onError }) => {
  const sendEmail = async () => {
    try {
      await emailjs.send(
        '8WNh8q5fJwjrpO4hD', // ID-ul serviciului creat pe EmailJS
        'JZUFiHA7X8XJpEdxJxfVV', // ID-ul template-ului creat pe EmailJS
        {
          ...emailData,
          message: `Order Details: Shipping address - ${emailData.address}, ${emailData.city}, ${emailData.zip}, ${emailData.country}`,
        },
        'YOUR_USER_ID' // User ID-ul tău de pe EmailJS
      );
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  // Poți apela `sendEmail` din `Checkout` atunci când formularul este trimis.
  return null;
};
