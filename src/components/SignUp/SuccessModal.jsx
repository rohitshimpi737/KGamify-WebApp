import { useEffect } from 'react';

export default function SuccessModal({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-[350px] rounded-xl p-5 shadow-xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#FFAB40] bg-opacity-10 flex items-center justify-center">
            <svg 
              className="w-7 h-7 text-[#FFAB40]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        <div className="text-center mb-5">
          <h2 className="text-xl font-semibold mb-3 text-black">
            OTP Verified Successfully!
          </h2>
          <p className="text-gray-600 text-sm">
            Creating your account...
          </p>
        </div>
      </div>
    </div>
  );
}