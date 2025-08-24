import React from 'react';

export default function PhoneConfirmation({ phoneNumber, onContinue, onEdit }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-[350px] rounded-xl p-5 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#FFAB40] bg-opacity-10 flex items-center justify-center">
            <svg 
              className="w-7 h-7 text-[#FFAB40]" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M12 18H12.01" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-3 text-center text-black">
          Confirm Phone Number
        </h2>
        
        <p className="text-gray-600 mb-5 text-center text-sm">
          We'll send an OTP to this number:
          <br />
          <span className="font-medium text-base text-black">+91 {phoneNumber}</span>
        </p>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2.5 border border-[#FFAB40] text-[#FFAB40] rounded-lg font-medium text-sm hover:bg-[#FFAB40] hover:bg-opacity-5 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-4 py-2.5 bg-[#FFAB40] text-black rounded-lg font-medium text-sm hover:bg-[#FF9D2F] transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}