import Image from 'next/image';
import { FC, useState } from 'react';

interface SectionItem {
  name: string;
  href: string;
  content: string;
}

const sections: SectionItem[] = [
  { name: 'Product Details', href: '/product-details', content: 'Here are the details of the product.' },
  { name: 'Shipping and Returns', href: '/shipping-returns', content: 'Information about shipping and returns.' },
  { name: 'Reviews Section', href: '/reviews', content: 'Read customer reviews here.' },
];

export const SectionList: FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    if (openSection === index) {
      setOpenSection(null);
    } else {
      setOpenSection(index);
    }
  };

  return (
    <div className="max-w-[800px] w-full bg-white border-t border-b border-gray-200 mt-10">
      {sections.map((section, index) => (
        <div key={section.name} className={`${index !== sections.length - 1 ? 'border-b border-gray-200' : ''}`}>
          <div
            className="flex justify-between items-center py-4 px-6 hover:bg-gray-100 cursor-pointer"
            onClick={() => toggleSection(index)}
          >
            <span className="text-gray-800 text-[16px] font-medium">{section.name}</span>
            {/* Add dynamic class to rotate the arrow when the section is open */}
            <Image
              src='/images/arrows.svg'
              alt='arrows'
              width={7}
              height={11}
              className={`transform transition-transform duration-300 ${openSection === index ? 'rotate-90' : ''}`}
            />
          </div>

          {openSection === index && (
            <div className="px-6 py-4 bg-gray-50">
              <p className="text-sm text-gray-600">{section.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
