import React, { useState } from 'react';
import Link from 'next/link';

const FooterCheckout = () => {
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
    <footer className="bg-[#F9F9F9] text-gray-500 text-sm py-6 w-full">
      <div className="container max-w-[1060px] mx-auto px-4 md:border-t border-[#7C788A]/20">
        {/* Desktop layout */}
        <div className='space-y-10 w-full mt-5 md:block hidden'>
            <div className="flex items-center justify-center md:justify-start text-center md:text-left">
              <p className='font-Heebo-r-14 text-[#BDBDBD]'>
                &copy; 2024 vellov. All Rights Reserved.{' '}
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          
            <div className='flex justify-between items-center w-full font-Heebo-r-14'>
              {/* Footer Links */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-center text-[#BDBDBD]">
                {footerLinks.map((link) => (
                  <Link key={link.name} href={link.href} className="hover:underline">
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-center md:justify-end gap-2">
                <span className="text-sm">🌐</span>
                <select
                  className="bg-transparent border-none outline-none text-[#BDBDBD] cursor-pointer"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Romania">Romania</option>
                </select>
              </div>
            </div>
          </div>

        {/* Mobile layout */}
        <div className="flex flex-col items-start space-y-4 md:hidden">
          {/* Footer Top Section */}
          <div className="border-y border-[#7C788A]/20 py-5 w-full">
            <p className="font-Heebo-r-14 text-[#BDBDBD]">
              &copy; 2024 vellov. All Rights Reserved.{' '}
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col items-start justify-start gap-4 font-Heebo-r-14 text-[#BDBDBD] border-b border-[#7C788A]/20 pb-5 w-full">
            {footerLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:underline">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Country Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm">🌐</span>
            <select
              className="bg-transparent border-none outline-none text-[#BDBDBD] cursor-pointer"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Moldova">Moldova</option>
              <option value="Romania">Romania</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCheckout;
