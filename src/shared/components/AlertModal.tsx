import Button from '@shared/components/Button';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function AlertModal({ isOpen, message, onClose }: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="w-[322px] bg-white rounded-[20px] shadow-lg overflow-hidden flex flex-col items-center pt-8">

        <div className="mb-6">
          <img 
            src="/icons/symbol-logo-O.svg" 
            alt="감귤마켓 로고" 
            className="w-[80px] h-[80px] object-contain" 
          />
        </div>

        <div className="px-6 mb-8">
          <p className="text-[16px] leading-[22px] text-center text-black whitespace-pre-wrap font-medium">
            {message}
          </p>
        </div>

        <div className="w-full px-6 pb-6">
          <Button
            fullWidth
            size="lg"
            onClick={onClose}
            // 시안의 알약 모양과 오렌지색을 위해 클래스 오버라이딩
            className="!bg-[#F26E22] !text-white !font-bold !rounded-full"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}