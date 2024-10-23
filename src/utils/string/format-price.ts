export function formatPrice(price: number) {
	return price.toLocaleString('en-EN', {
	  style: 'currency',
	  currency: 'USD',
	  minimumFractionDigits: 2, // Asigură afișarea a cel puțin două zecimale
	  maximumFractionDigits: 2  // Limitează la cel mult două zecimale
	});
  }
  