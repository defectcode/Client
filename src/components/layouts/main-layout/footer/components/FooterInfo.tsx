
import Link from 'next/link';

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
    <footer className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {footerData.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link legacyBehavior href={link.href}>
                      <a className="text-sm text-gray-500 hover:text-gray-900">
                        {link.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
