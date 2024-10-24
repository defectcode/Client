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
        className="block w-full h-[56px] px-4 py-2 rounded-md text-[14px] font-heebo bg-transparent "
        required
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
}
