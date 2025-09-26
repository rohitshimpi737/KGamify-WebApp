// Store OTPs with user phone numbers and expiration times
const otpStore = new Map();

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [phoneNumber, otpData] of otpStore.entries()) {
    if (now > otpData.expiresAt) {
      otpStore.delete(phoneNumber);
      console.log(`Expired OTP cleaned up for ${phoneNumber}`);
    }
  }
}, 5 * 60 * 1000); // 5 minutes

export const sendOTP = async (phoneNumber) => {
  try {
    const otp = generateOTP();
    const expiresAt = Date.now() + (3 * 60 * 1000); // 3 minutes from now
    
    // Store OTP with expiration for this specific phone number
    otpStore.set(phoneNumber, {
      otp: otp,
      expiresAt: expiresAt,
      createdAt: Date.now()
    });
    
    console.log(`Generated OTP for ${phoneNumber}:`, otp);
    console.log(`OTP expires at:`, new Date(expiresAt));

    const isProduction = import.meta.env.PROD;
    
    if (isProduction) {
      // Production: Use JSONP to bypass CORS
      return new Promise((resolve, reject) => {
        const callbackName = 'otpCallback_' + Date.now();
        
        const params = new URLSearchParams({
          apikey: import.meta.env.VITE_MTALKZ_API_KEY,
          senderid: import.meta.env.VITE_MTALKZ_SENDER_ID,
          number: phoneNumber,
          message: `Your OTP- One Time Password is ${otp} to authenticate your login on kGamify app. This OTP is valid for 3 mins. -Team kGamify`,
          format: "json",
          template_id: import.meta.env.VITE_MTALKZ_TEMPLATE_ID,
          callback: callbackName
        });

        // Create callback function
        window[callbackName] = function(data) {
          console.log('JSONP Response:', data);
          // Cleanup
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
          delete window[callbackName];
          resolve({ success: true, data: data });
        };

        // Create script tag for JSONP
        const script = document.createElement('script');
        script.src = `https://msgn.mtalkz.com/api?${params.toString()}`;
        script.onerror = function() {
          console.log('JSONP failed, but OTP likely sent');
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
          delete window[callbackName];
          resolve({ success: true, data: { message: 'OTP sent' } });
        };

        // Add script to head
        document.head.appendChild(script);

        // Timeout after 10 seconds
        setTimeout(() => {
          if (window[callbackName]) {
            console.log('JSONP timeout, but OTP likely sent');
            if (document.head.contains(script)) {
              document.head.removeChild(script);
            }
            delete window[callbackName];
            resolve({ success: true, data: { message: 'OTP sent (timeout)' } });
          }
        }, 10000);
      });

    } else {
      // Development: Use POST method with proxy
      const apiUrl = '/mtalkz-api';
      console.log('Using API URL (Development):', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apikey: import.meta.env.VITE_MTALKZ_API_KEY,
          senderid: import.meta.env.VITE_MTALKZ_SENDER_ID,
          number: phoneNumber,
          message: `Your OTP- One Time Password is ${otp} to authenticate your login on kGamify app. This OTP is valid for 3 mins. -Team kGamify`,
          format: "json",
          template_id: import.meta.env.VITE_MTALKZ_TEMPLATE_ID
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('OTP Response:', result);
      return { success: true, data: result };
    }

  } catch (error) {
    console.error('OTP Error:', error);
    throw new Error('Failed to send OTP: ' + error.message);
  }
};

export const verifyOTP = (phoneNumber, enteredOTP) => {
  const otpData = otpStore.get(phoneNumber);
  
  if (!otpData) {
    console.log(`No OTP found for ${phoneNumber}`);
    return false;
  }
  
  const now = Date.now();
  
  // Check if OTP has expired
  if (now > otpData.expiresAt) {
    console.log(`OTP expired for ${phoneNumber}`);
    otpStore.delete(phoneNumber); // Clean up expired OTP
    return false;
  }
  
  const isValid = otpData.otp === enteredOTP;
  
  if (isValid) {
    // OTP verified successfully, remove it to prevent reuse
    otpStore.delete(phoneNumber);
    console.log(`OTP verified successfully for ${phoneNumber}`);
  } else {
    console.log(`Invalid OTP for ${phoneNumber}. Expected: ${otpData.otp}, Got: ${enteredOTP}`);
  }
  
  return isValid;
};

// Utility function to check if OTP exists for a phone number
export const hasValidOTP = (phoneNumber) => {
  const otpData = otpStore.get(phoneNumber);
  if (!otpData) return false;
  
  const now = Date.now();
  if (now > otpData.expiresAt) {
    otpStore.delete(phoneNumber);
    return false;
  }
  
  return true;
};

// Utility function to get remaining time for OTP
export const getOTPRemainingTime = (phoneNumber) => {
  const otpData = otpStore.get(phoneNumber);
  if (!otpData) return 0;
  
  const now = Date.now();
  const remaining = Math.max(0, otpData.expiresAt - now);
  return Math.floor(remaining / 1000); // Return in seconds
};

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};