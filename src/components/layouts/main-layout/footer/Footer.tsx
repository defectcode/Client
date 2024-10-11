import Link from 'next/link';
import Image from 'next/image';
import './Footer.css'

export interface FooterInfo {
  title: string;
  links: { name: string; href: string }[];
}

const footerData: FooterInfo[] = [
  {
    title: 'Help',
    links: [
      { name: 'Faq', href: '/faq' },
      { name: 'Delivery Information', href: '/delivery' },
      { name: 'Returns Policy', href: '/returns' },
      { name: 'Make a Return', href: '/return' },
      { name: 'Orders', href: '/orders' },
      { name: 'Submit a Fake', href: '/submit-fake' },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'Login', href: '/login' },
      { name: 'Register', href: '/register' },
      { name: 'My Progress', href: '/progress' },
    ],
  },
  {
    title: 'Pages',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Wishlist', href: '/wishlist' },
      { name: 'Product Page', href: '/products' },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="bg-white pb-10 md:py-10">
      <div className="max-w-[1400px] mx-auto w-full px-4 lg:px-0">
        {/* Container principal pentru secțiuni și logo */}
        <div className="flex md:flex-nowrap flex-wrap md:justify-between justify-center items-start w-full ">
          {/* Secțiuni Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-20 footer-sections">
          {footerData.map((section) => (
            <div key={section.title}>
              <h3 className="text-[16px] font-heebo mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link legacyBehavior href={link.href}>
                      <a className="text-sm font-heebo text-[#BDBDBD] hover:text-gray-900">
                        {link.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>


          {/* Logo și Newsletter */}
          <div className="flex flex-col items-start max-w-[350px] lg:max-w-[400px]">
            <h2 className="text-lg font-bold">LOGO</h2>
            <p className="mt-4 font-heebo text-[16px]">Subscribe to our Newsletter</p>
            <div className="mt-2 flex w-full">
              <div className="relative w-full max-w-md">
                <input
                  type="email"
                  placeholder="Email address"
                  className="border-transparent rounded-lg px-4 py-2 text-sm font-heebo w-full bg-[#F9F9F9] pr-28"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black font-heebo text-[13px] px-4 py-2 rounded-lg h-[30px] flex items-center">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metode de plată și alte secțiuni */}
        <div className='flex flex-wrap md:flex-nowrap items-center md:justify-between justify-center mt-12 gap-5 md:gap-0 mb-5 md:mb-0'>
          {/* Metode de plată */}
          <div className="flex justify-center space-x-4">
            <Image src="/images/footer/applepay-card.svg" alt="Apple Pay" width={50} height={28} />
            <Image src="/images/footer/mastercard-card.svg" alt="Mastercard" width={50} height={28} />
            <Image src="/images/footer/paypal-card.svg" alt="Paypal" width={50} height={28} />
            <Image src="/images/footer/visa-card.svg" alt="Visa" width={50} height={28} />
          </div>

          {/* Copyright */}
          <div className='text-[#BDBDBD] text-[14px] font-heebo'>
            <p>&copy; 2024 Fynely. All Rights Reserved. Privacy Policy</p>
          </div>

          {/* Rețele sociale */}
          <div className="flex space-x-6">
            <Link legacyBehavior href="#"><a><Image src='/images/footer/tiktok.svg' alt='tiktok' width={19} height={22} /></a></Link>
            <Link legacyBehavior href="#"><a><Image src='/images/footer/instagram.svg' alt='instagram' width={20} height={20} /></a></Link>
            <Link legacyBehavior href="#"><a><Image src='/images/footer/youtube.svg' alt='youtube' width={23} height={17} /></a></Link>
            <Link legacyBehavior href="#"><a><Image src='/images/footer/x.svg' alt='x' width={18} height={18} /></a></Link>
            <Link legacyBehavior href="#"><a><Image src='/images/footer/facebook.svg' alt='facebook' width={12} height={22} /></a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
