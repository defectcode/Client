import React from 'react';
import countryList, { Country } from 'country-list'; // Asigură-te că `country-list` este instalat corect

interface CountrySelectProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export function CountrySelect({ selectedCountry, onCountryChange }: CountrySelectProps) {
  // Tipul `Country` este importat din `country-list`, acesta reprezintă fiecare țară
  const countries: Country[] = countryList.getData();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCountryChange(e.target.value); // Apelăm funcția pentru a actualiza țara selectată
  };

  return (
    <div>
      <select
        id="country"
        name="country"
        value={selectedCountry}
        onChange={handleChange}
        className="mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo border-gray-300"
        required
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
      {/* <label htmlFor="country" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
        Country/Region
      </label> */}
    </div>
  );
}
