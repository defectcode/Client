import Image from "next/image";
import './Production.css'


const AllInfoProducts = () => {
  return (
    <div className="space-y-10 py-10">
      {/* First Block */}
      <div className="flex items-center space-x-5 max-w-[393px] w-full">
        <Image src='/images/message.svg' alt="music" width={30} height={25}/>
        <p className="font-Heebo-15-light text-gray-700 max-w-[270px] w-full">
          Have questions about buying AirPods 4? Chat with an AirPods Specialist 7
        </p>
      </div>

      {/* Second Block */}
      <div className="flex items-center space-x-5">
      <Image src='/images/liv.svg' alt="music" width={26} height={29}/>
        <p className="font-Heebo-15-light text-gray-700 max-w-[332px] w-full">
          Get free delivery, or pick up available items at an Apple Store
        </p>
      </div>

      {/* Third Block */}
      <div className="flex items-center space-x-7">
      <Image src='/images/music.svg' alt="music" width={19} height={25}/>
      <p className="font-Heebo-15-light text-gray-700 max-w-[332px] w-full">
          Get 3 months of Apple Music free with your AirPods 4°
        </p>
      </div>
    </div>
  );
};

export default AllInfoProducts;
