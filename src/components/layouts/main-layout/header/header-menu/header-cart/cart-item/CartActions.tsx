import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useActions } from '@/hooks/useActions';
import { useCart } from '@/hooks/useCart';
import { ICartItem } from '@/shared/types/cart.interface';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';

interface CartActionsProps {
  item: ICartItem;
}

export function CartActions({ item }: CartActionsProps) {
  const { changeQuantity, removeFromCart } = useActions();
  const { items } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);
  const quantity = items.find(cartItem => cartItem.id === item.id)?.quantity;

  const handleMinusClick = () => {
    if (quantity === 1) {
      setShowConfirm(true); // Afișăm modalul de confirmare
    } else {
      changeQuantity({ id: item.id, type: 'minus' });
    }
  };

  const handleConfirmDelete = () => {
    removeFromCart({ id: item.id });
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="flex items-center mt-1">
      <Button
        onClick={handleMinusClick}
        variant="ghost"
        size="icon"
        disabled={quantity === 0}
      >
        <Minus />
      </Button>

      <input
        disabled
        readOnly
        value={quantity}
        className="w-10 text-center text-sm"
      />

      <Button
        onClick={() => changeQuantity({ id: item.id, type: 'plus' })}
        variant="ghost"
        size="icon"
      >
        <Plus />
      </Button>

      {/* Afișăm modalul de confirmare */}
      {showConfirm && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
