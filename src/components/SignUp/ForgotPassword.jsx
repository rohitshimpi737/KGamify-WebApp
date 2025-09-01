import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Validate email
      if (!email.trim()) {
        throw new Error("Email is required");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Call forgot password API
      const result = await API.auth.forgotPassword(email);
      
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(result.error || "Failed to send reset email");
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to process request");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleSignIn = () => {
    navigate("/");
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Check if label should be floating (focused or has value)
  const isLabelFloating = isFocused || email.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Back Button - Top Left */}
      <div className="absolute top-3 left-3">
        <button
          onClick={handleBack}
          className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Go back"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Logo - Top Center */}
      <div className="flex justify-center pt-6 mb-8">
        <img
          src="/src/assets/KLOGO.png"
          alt="kGamify Logo"
          className="h-10 w-auto"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-black mb-2">Forgot Password?</h1>
          <p className="text-black text-sm">
            Enter your registered email address.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            {/* Floating Label */}
            <label 
              className={`absolute left-3 transition-all duration-200 ease-in-out pointer-events-none ${
                isLabelFloating 
                  ? 'top-0 -translate-y-1/2 text-xs font-bold bg-gray-50 px-1' 
                  : 'top-1/2 -translate-y-1/2 text-base'
              }`}
              style={{ 
                color: isLabelFloating ? '#FFAB40' : '#000000' 
              }}
            >
              Email
            </label>
            
            {/* Input Field */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={isFocused ? "example@gmail.com" : ""}
              required
              className="w-full px-3 py-2.5 text-black border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
              style={{ 
                '--tw-ring-color': '#FFAB40' 
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-black py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            style={{ 
              backgroundColor: '#FFAB40'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#FF9800'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#FFAB40'}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-b-2 border-black rounded-full mr-2"></div>
                Processing...
              </div>
            ) : (
              "Proceed"
            )}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-xl font-semibold text-black mb-6">
              Email sent successfully.
            </h2>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="w-full text-black py-3 px-6 rounded-xl font-medium text-lg transition-colors"
              style={{ 
                backgroundColor: '#FFAB40'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#FF9800'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FFAB40'}
            >
              Sign in
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            {/* Red Triangle Warning Icon */}
            <div className="mb-6">
              <svg 
                className="w-16 h-16 mx-auto text-red-500" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
              </svg>
            </div>

            {/* Error Message */}
            <h2 className="text-lg font-semibold text-black mb-6 leading-relaxed">
              {errorMessage === "Failed to send reset email" || errorMessage.includes("not found") 
                ? "User with this email doesn't exist. Check your mail and try again."
                : errorMessage
              }
            </h2>

            {/* Sign In Button */}
            <button
              onClick={handleCloseErrorModal}
              className="w-full text-black py-3 px-6 rounded-xl font-medium text-lg transition-colors"
              style={{ 
                backgroundColor: '#FFAB40'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#FF9800'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FFAB40'}
            >
              Sign in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}