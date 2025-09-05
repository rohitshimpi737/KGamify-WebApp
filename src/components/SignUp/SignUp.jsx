import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { validateForm } from "../../utils/formValidation";
import OTPVerification from './OTPVerification';
import { sendOTP } from '../../services/otpService';
import PhoneConfirmation from './PhoneConfirmation';
import SuccessModal from './SuccessModal';


export default function AuthForm() {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login, signUp, loading, error, clearError } = useAuth();
  const [validationErrors, setValidationErrors] = useState({});
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState(false);
  const [formData, setFormData] = useState(null);
  const [showPhoneConfirmation, setShowPhoneConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  // Form validati3on rules
  const signUpRules = {
    firstName: { required: true, label: "First name" },
    lastName: { required: true, label: "Last name" },
    phone: { required: true, type: "phone", label: "Phone number" },
    email: { required: true, type: "email", label: "Email" },
    password: { required: true, type: "password", label: "Password" },
    confirmPassword: {
      required: true,
      type: "confirmPassword",
      matchField: "password",
      label: "Confirm Password"
    }
  };

  const signInRules = {
    email: { required: true, type: "email", label: "Email" },
    password: { required: true, label: "Password" }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    clearError();
    setValidationErrors({});

    const formData = new FormData(e.target);
    const userData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    // Validate form
    const validation = validateForm(userData, signUpRules);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setFormData(userData);
    setShowPhoneConfirmation(true);

    // if (!verifiedPhone) {
    //   try {
    //     await sendOTP(userData.phone);
    //     setShowOTPVerification(true);
    //   } catch (error) {
    //     setValidationErrors({ phone: 'Failed to send OTP. Please try again.' });
    //   }
    //   return;
    // }

    // const result = await signUp(userData);
    // if (result.success) {
    //   navigate("/app");
    // }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    clearError();
    setValidationErrors({});

    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Validate form
    const validation = validateForm(credentials, signInRules);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    const result = await login(credentials);
    if (result.success) {
      navigate("/app");
    }
  };

  const handleSubmit = (e) => {
    if (activeTab === "signup") {
      handleSignUp(e);
    } else {
      handleSignIn(e);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      {/* Logo with increased padding and border radius */}
      <div className="flex justify-center mb-8">
        <div className="rounded-3xl overflow-hidden p-2 bg-gray-50">
          <img
            src="/src/assets/KLOGO.png"
            alt="kGamify Logo"
            className="w-20 h-20 rounded-md"
          />
        </div>
      </div>

      {/* Forms Container with max width */}
      <div className="max-w-sm mx-auto">
        {/* Error Display */}
        {(error || Object.keys(validationErrors).length > 0) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error && <div>{error}</div>}
            {Object.values(validationErrors).map((err, index) => (
              <div key={index}>{err}</div>
            ))}
          </div>
        )}

        {/* Sign In/Up Tabs */}
        <div className="flex mb-5 rounded-lg border border-[#FFAB40] max-w-[250px] mx-auto">
          <button
            className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-all ${activeTab === "signin"
              ? "bg-[#FFAB40] text-black"
              : "text-black"
              }`}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 px-2 rounded-md text-sm font-medium transition-all ${activeTab === "signup"
              ? "bg-[#FFAB40] text-black"
              : "text-black"
              }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}

        {activeTab === "signup" ? (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="flex space-x-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    required
                    className="w-full px-3 py-3.5 h-14 text-black bg-gray-100 rounded-lg outline-none text-sm"
                  />
                  <span className="absolute top-3 right-3 text-red-500">*</span>
                </div>

                <div className="relative flex-1">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    required
                    className="w-full px-3 py-3.5 h-14 text-black bg-gray-100 rounded-lg outline-none text-sm"
                  />
                  <span className="absolute top-3 right-3 text-red-500">*</span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  onKeyPress={(e) => {
                    // Allow only numbers
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-3 py-3.5 h-14 text-black bg-gray-100 rounded-lg outline-none text-sm"
                />
                <span className="absolute top-3 right-3 text-red-500">*</span>
                <div className="text-xs text-gray-500 mt-1">
                  (Enter 10 digit phone number)
                </div>
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full px-3 py-3.5 h-14 text-black bg-gray-100 rounded-lg outline-none text-sm"
                />
                {/* * after placeholder text */}
                <span className="absolute top-3 right-3 text-red-500">*</span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full px-3 py-3.5 h-14 text-black bg-gray-100 rounded-lg outline-none text-sm"
                />
                <span className="absolute top-3 right-3 text-red-500">*</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-8 top-1/2 -translate-y-1/2"
                >
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    ) : (
                      <path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                    )}
                  </svg>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                  className="w-full px-3 py-3.5 h-14 text-black bg-gray-100 rounded-lg outline-none text-sm"
                />
                <span className="absolute top-3 right-3 text-red-500">*</span>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-8 top-1/2 -translate-y-1/2"
                >
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                    {showConfirmPassword ? (
                      <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    ) : (
                      <path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-start mt-6">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 accent-[#FFAB40] rounded"
              />
              <label className="ml-2 text-sm text-gray-600">
                By continuing, you agree to our{" "}
                <a href="https://kgamify.in/championshipmaker/apis/terms_and_conditions_user.php" target="_blank" className="text-[#FFAB40] hover:underline">
                  Terms & Conditions & Privacy Policy
                </a>
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Fields marked with <span className="text-red-500">*</span> are required.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFAB40] text-black font-medium py-2.5 px-4 rounded-lg mt-4 text-sm"
            >
              {loading ? "Creating Account..." : "Create account"}
            </button>
          </form>
        ) : (
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full px-3 py-3.5 h-14 text-black bg-gray-100 rounded-lg outline-none text-sm"
                />
                {/* * after placeholder text */}
                <span className="absolute top-3 right-3 text-red-500">*</span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full px-3 py-3.5 h-14 text-black bg-gray-100 rounded-lg outline-none text-sm"
                />
                <span className="absolute top-3 right-3 text-red-500">*</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-8 top-1/2 -translate-y-1/2"
                >
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    ) : (
                      <path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[#FFAB40] text-sm"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFAB40] text-black font-medium py-2.5 px-4 rounded-lg mt-4 text-sm"
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>

            <div className="text-center text-sm mt-4 text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-[#FFAB40] font-medium"
                onClick={() => setActiveTab("signup")}
              >
                Create an account
              </button>
            </div>
          </form>
        )}
      </div>

      {showPhoneConfirmation && formData && (
        <PhoneConfirmation
          phoneNumber={formData.phone}
          onContinue={async () => {
            try {
              await sendOTP(formData.phone);
              setShowPhoneConfirmation(false);
              setShowOTPVerification(true);
            } catch (error) {
              setValidationErrors({ phone: 'Failed to send OTP. Please try again.' });
            }
          }}
          onEdit={() => setShowPhoneConfirmation(false)}
        />
      )}

      {showOTPVerification && formData && (
        <OTPVerification
          phoneNumber={formData.phone}
          onVerificationComplete={async (success) => {
            if (success) {
              setVerifiedPhone(true);
              setShowOTPVerification(false);
              setShowSuccessModal(true);
            }
          }}
          onEdit={() => {
            setShowOTPVerification(false);
            setShowPhoneConfirmation(true);
          }}
        />
      )}



      {showSuccessModal && (
        <SuccessModal
          onClose={async () => {
            setShowSuccessModal(false);
            try {
              const signUpData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
              };

              const result = await signUp(signUpData);
              console.log("Signup Result:", result);

              if (result && result.success) {
                navigate("/app");
              } else {
                clearError(); // Clear any existing errors
                setValidationErrors({}); // Clear validation errors
                setError(result?.error || 'Failed to create account. Please try again.');
                // Reset states on error
                setVerifiedPhone(false);
                setShowPhoneConfirmation(false);
                setShowOTPVerification(false);
              }
            } catch (error) {
              console.error("Signup error:", error);
              clearError(); 
              setValidationErrors({}); 
              setError('Network error occurred. Please try again.');
              // Reset states on error
              setVerifiedPhone(false);
              setShowPhoneConfirmation(false);
              setShowOTPVerification(false);
            }
          }}
        />
      )}

    </div>
  );
}