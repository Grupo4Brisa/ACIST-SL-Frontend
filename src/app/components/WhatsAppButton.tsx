import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: 'fixed' | 'static';
}

export default function WhatsAppButton({
  phoneNumber = '5551999999999',
  message = 'Olá! Gostaria de me associar à ACIST São Leopoldo',
  position = 'fixed'
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const positionClasses = position === 'fixed'
    ? 'fixed bottom-8 right-8 z-50'
    : '';

  return (
    <button
      onClick={handleClick}
      className={`${positionClasses} w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110`}
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}
