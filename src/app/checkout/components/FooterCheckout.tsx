import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

interface FooterProps {}

const FooterCheckout: React.FC<FooterProps> = () => {
  const [country, setCountry] = useState('United States');

  const footerLinks = [
    { name: 'Faq', href: '/faq' },
    { name: 'Delivery Information', href: '/delivery-information' },
    { name: 'Returns Policy', href: '/returns-policy' },
    { name: 'Make a Return', href: '/make-a-return' },
    { name: 'Orders', href: '/orders' },
    { name: 'Submit a Fake', href: '/submit-a-fake' },
  ];

  return (
    <footer className="md:h-[500px] h-[300px] bg-gray-50 text-gray-500 text-sm py-6 border-t border-gray-200">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-center md:text-left">&copy; 2024 vellov. All Rights Reserved. <Link legacyBehavior href="/privacy-policy"><a className="hover:underline">Privacy Policy</a></Link></p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 md:mt-0">
            {footerLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:underline">
                {link.name}
            </Link>
            ))}

        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-sm">🌐</span>
          <select
            className="bg-transparent border-none outline-none text-gray-500 cursor-pointer"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Moldova">Moldova</option>
            <option value="Romania">Romania</option>
            {/* Adaugă alte opțiuni după preferințe */}
          </select>
        </div>
      </div>
    </footer>
  );
};

export default FooterCheckout;
