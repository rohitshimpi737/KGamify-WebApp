let currentOTP = null;

export const sendOTP = async (phoneNumber) => {
  try {
    currentOTP = generateOTP();
    console.log('Generated OTP:', currentOTP); 

    const response = await fetch('/mtalkz-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apikey: "DpVG4QrDYOsA5Otr",
        senderid: "YANTRI",
        number: phoneNumber,
        message: `Your OTP- One Time Password is ${currentOTP} to authenticate your login on kGamify app. This OTP is valid for 3 mins. -Team kGamify`,
        format: "json",
        template_id: "1107174350946322136"
      })
    });

    return { success: true };
  } catch (error) {
    console.error('OTP Error:', error);
    throw new Error('Failed to send OTP');
  }
};

export const verifyOTP = (enteredOTP) => {
  return currentOTP === enteredOTP;
};

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};