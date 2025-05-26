import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const message =
      activeTab === "signup"
        ? "Account created successfully!"
        : "Signed in successfully!";
    alert(message);
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 ">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="p-2 m-2 flex justify-center">
          <img
            src="src/assets/KGamify.svg"
            alt="KGamify Logo"
            className="h-16 w-auto"
          />
        </div>

        {/* Tabs */}
        <div className="flex mb-2 rounded-lg border  border-orange-400">
          <button
            className={`flex-1 py-2 cursor-pointer  text-sm font-medium ${
              activeTab === "signin"
                ? "text-white border-1 rounded-lg border-orange-500 bg-orange-400"
                : "text-orange-400  hover:text-orange-700"
            }`}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 cursor-pointer  py-2 text-sm font-medium ${
              activeTab === "signup"
                ? "text-white border-1 rounded-lg border-orange-500 bg-orange-400"
                : "text-orange-400  hover:text-orange-700"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {activeTab === "signup" ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium  text-black mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2  outline-none rounded-lg border  border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium  text-black mb-1">
                Phone number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2  outline-none rounded-lg border  border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium  text-black mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2  outline-none rounded-lg border  border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium  text-black mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2  outline-none rounded-lg border  border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium  text-black mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                className="w-full px-3 py-2  outline-none rounded-lg border  border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                required
                className="h-4 w-4 text-orange-400 accent-orange-400 focus:ring-orange-400 border-gray-300 rounded cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-500">
                By continuing, you agree to our Terms & Conditions & Privacy
                Policy
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-orange-400/80 transition-colors"
            >
              Create an account
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                className="text-orange-500 hover:underline"
                onClick={() => setActiveTab("signin")}
              >
                Sign In
              </button>
            </p>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium  text-black mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="Email"
                required
                className="w-full px-3 py-2  outline-none rounded-lg border  border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium  text-black mb-1">
               Password <span className="text-red-500">*</span>
              </label>
              <input
                type="Password"
                required
                className="w-full px-3 py-2  outline-none rounded-lg border  border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-orange-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-orange-500 hover:underline"
                onClick={() => setActiveTab("signup")}
              >
                Create an account
              </button>
            </p>
          </form>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        Fields marked with <span className="text-red-500">*</span> are required.
      </p>
    </div>
  );
}
