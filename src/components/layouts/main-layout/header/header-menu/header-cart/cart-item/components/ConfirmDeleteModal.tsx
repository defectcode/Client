import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { useState } from 'react';

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ onConfirm, onCancel }: ConfirmDeleteModalProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg p-6 max-w-[430px] w-full flex flex-col items-center justify-center transition-transform duration-300 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        } md:h-[650px] h-[667px] md:justify-center mobile:justify-end mobile:rounded-t-lg`}
        style={{
          bottom: window.innerWidth < 768 ? '0' : 'auto', // Pe telefon, se asigură că modalul rămâne jos.
          maxHeight: window.innerWidth < 768 ? '667px' : '100%', // Limitează înălțimea pe telefon
        }}
      >
        <p className="text-sm text-[#1E1E1E] font-heebo mb-4 text-center">Are you sure you want to remove this item?</p>
        <div className="flex flex-col items-center justify-center space-y-5">
          <button
            onClick={onCancel}
            className="border w-[300px] h-[48px] rounded-[10px] text-white bg-black font-heebo"
          >
            No, keep it
          </button>
          <button
            onClick={onConfirm}
            className="border w-[300px] h-[48px] rounded-[10px] font-heebo"
          >
            Yes, remove it
          </button>
        </div>
      </div>
    </div>
  );
}
