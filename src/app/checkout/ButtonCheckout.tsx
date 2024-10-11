import Link from 'next/link';

const CheckoutButton = () => {
  return (
    <Link href="/checkout">
      <button className="mt-5 font-bold py-3 px-8 border border-black/50 rounded-lg h-10 flex items-center justify-center max-w-[393px] w-full mx-auto bg-white text-[#424242]">
        Checkout
      </button>
    </Link>
  );
};

export default CheckoutButton;
