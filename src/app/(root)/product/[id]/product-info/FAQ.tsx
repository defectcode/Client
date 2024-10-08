import { FC, useState } from 'react';

interface SectionItem {
  name: string;
  href: string;
  content: string; // Informațiile adiționale care vor fi afișate
}

const sections: SectionItem[] = [
  { name: 'Product Details', href: '/product-details', content: 'Here are the details of the product.' },
  { name: 'Shipping and Returns', href: '/shipping-returns', content: 'Information about shipping and returns.' },
  { name: 'Reviews Section', href: '/reviews', content: 'Read customer reviews here.' },
];

export const SectionList: FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null); // Stocăm secțiunea deschisă

  const toggleSection = (index: number) => {
    if (openSection === index) {
      setOpenSection(null); // Închide secțiunea dacă este deja deschisă
    } else {
      setOpenSection(index); // Deschide secțiunea
    }
  };

  return (
    <div className="max-w-[800px] w-full mx-auto bg-white border-t border-b border-gray-200 mt-10">
      {sections.map((section, index) => (
        <div key={section.name} className={`${index !== sections.length - 1 ? 'border-b border-gray-200' : ''}`}>
          {/* Secțiunea principală care declanșează toggle */}
          <div
            className="flex justify-between items-center py-4 px-6 hover:bg-gray-100 cursor-pointer"
            onClick={() => toggleSection(index)} // Apelăm funcția de toggle la click
          >
            <span className="text-gray-800 text-[16px] font-medium">{section.name}</span>
            {/* Puteți adăuga un icon de săgeată aici pentru a indica starea deschis/închis */}
            {/* Ex: <ChevronRightIcon className={`h-5 w-5 text-gray-400 ${openSection === index ? 'rotate-90' : ''}`} /> */}
          </div>

          {/* Conținutul adițional care se afișează când secțiunea este deschisă */}
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
