import Link from 'next/link';

const CheckoutButton = () => {
  return (
    <Link href="/checkout">
      <button className="font-bold border border-black/50 rounded-[10px] m-0 h-[48px] flex items-center justify-center w-full bg-white text-[#424242]">
        Checkout
      </button>
    </Link>
  );
};

export default CheckoutButton;
