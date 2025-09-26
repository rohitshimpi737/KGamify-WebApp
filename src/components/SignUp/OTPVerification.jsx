import { useState, useEffect, useRef } from 'react';
import { verifyOTP, sendOTP } from '../../services/otpService';

export default function OTPVerification({ phoneNumber, onVerificationComplete, onEdit }) {
  const [otp, setOtp] = useState(['', '', '', '']); // Changed to 4 digits
  const [timeLeft, setTimeLeft] = useState(300);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    // Auto focus first input on mount
    inputRefs.current[0]?.focus();

    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

 const handleChange = (index, value) => {
  if (isNaN(value)) return;
  
  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  // Auto focus next input
  if (value && index < 3) {
    inputRefs.current[index + 1]?.focus();
  }

  // If all digits are entered, verify OTP
  if (index === 3 && value) {
    const enteredOTP = newOtp.join(''); // Changed from slice to join
    handleVerify(enteredOTP);
  }
};

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

const handleVerify = async (enteredOTP) => {
  try {
    const isValid = verifyOTP(phoneNumber, enteredOTP); // Add phoneNumber parameter
    if (isValid) {
      onVerificationComplete(true);
    } else {
      setError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  } catch (error) {
    setError('Verification failed. Please try again.');
  }
};

// Add resend handler
const handleResend = async () => {
  try {
    await sendOTP(phoneNumber);
    setTimeLeft(300);
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
    setError(''); // Clear any existing errors
  } catch (error) {
    setError('Failed to resend OTP. Please try again.');
  }
};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };


//   return (
//     <div className="fixed inset-0 bg-white z-50">
//       <div className="max-w-md mx-auto px-4 pt-4">
//         <div className="flex items-center mb-6">
//           <button onClick={onEdit} className="p-2">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//           </button>
//           <span className="ml-4 text-xl">Phone</span>
//         </div>

//         <div className="mt-12">
//           <h2 className="text-3xl font-medium mb-2">OTP Verification</h2>
//           <p className="text-gray-600 mb-12">
//             We've sent an OTP to +91 {phoneNumber}
//           </p>

//            <div className="flex justify-between gap-4 mb-12">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={el => inputRefs.current[index] = el}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 className="w-16 h-16 text-center text-2xl border-b-2 border-gray-200 focus:border-[#FFAB40] outline-none bg-transparent text-black"
//               />
//             ))}
//           </div>

//           {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//           <div className="flex flex-col items-center gap-4">
//             <button 
//               className="text-[#FFAB40] font-medium text-lg"
//               onClick={() => {
//                 setTimeLeft(300);
//                 setOtp(['', '', '', '']);
//                 inputRefs.current[0]?.focus();
//                 // Add your resend OTP logic here
//               }}
//             >
//               Resend OTP?
//             </button>
//             <p className="text-gray-500">
//               Expires in {formatTime(timeLeft)}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

  return (
     <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-[350px] rounded-xl p-5 shadow-xl">
        <div className="flex items-center mb-6">
          <button 
            onClick={onEdit} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg 
              className="w-6 h-6 text-black" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>
          <h1 className="text-xl font-medium ml-4 text-black">Phone</h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-3 text-black">OTP Verification</h2>
          <p className="text-gray-600 text-sm">
            We've sent an OTP to +91 {phoneNumber}
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <div key={index} className="relative">
              <input
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-xl font-semibold bg-gray-50 rounded-full border-2 border-gray-200 focus:border-[#FFAB40] focus:bg-white outline-none transition-all text-black"
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-center mb-5 bg-red-50 py-2 px-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <button 
            className="text-[#FFAB40] font-medium text-sm hover:text-[#FF9D2F] transition-colors"
            onClick={handleResend}
          >
            Resend OTP?
          </button>
          <p className="text-gray-500 text-sm">
            Expires in {formatTime(timeLeft)}
          </p>
        </div>
      </div>
    </div>
  );
}