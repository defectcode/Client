import Image from "next/image";

const AllInfoProducts = () => {
  return (
    <div className="space-y-4 py-10">
      {/* First Block */}
      <div className="flex items-center space-x-3">
        <Image src='/images/message.svg' alt="music" width={30} height={25}/>
        <p className="text-[15px] text-gray-700 font-heebo font-light max-w-[340px] w-full">
          Have questions about buying AirPods 4? Chat with an AirPods Specialist 7
        </p>
      </div>

      {/* Second Block */}
      <div className="flex items-center space-x-3">
      <Image src='/images/liv.svg' alt="music" width={26} height={29}/>
        <p className="text-[15px] text-gray-700 font-heebo font-light max-w-[340px] w-full">
          Get free delivery, or pick up available items at an Apple Store
        </p>
      </div>

      {/* Third Block */}
      <div className="flex items-center space-x-3">
      <Image src='/images/music.svg' alt="music" width={19} height={25}/>
      <p className="text-[15px] text-gray-700 font-heebo font-light max-w-[340px] w-full">
          Get 3 months of Apple Music free with your AirPods 4°
        </p>
      </div>
    </div>
  );
};

export default AllInfoProducts;
