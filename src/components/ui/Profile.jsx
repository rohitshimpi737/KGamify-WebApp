import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import DefaultImage from "../../assets/image.png";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import { useLocation } from "../../hooks/useLocation";

const Profile = () => {
  const { darkMode } = useTheme();
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  // Custom hooks for profile and location management
  const {
    profileData,
    isSaving,
    error,
    updateField,
    updateLocation,
    toggleInterest,
    saveProfile,
    resetProfile
  } = useProfile();
  
  const { countries, states, cities, getDisplayNames } = useLocation(profileData);
  const { country: countryName, state: stateName } = getDisplayNames();

  // Local UI state
  const [selectedImage, setSelectedImage] = useState(DefaultImage);
  const [isEditing, setIsEditing] = useState(false);

  const interestsList = [
    "Video Games",
    "Travelling", 
    "Music",
    "Puzzles",
    "Movies",
    "Books",
    "Writing",
    "Fitness",
    "Art",
    "Programming",
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    const success = await saveProfile();
    if (success) {
      setIsEditing(false);
      // Show success message (optional)
      // Profile updated successfully!
    }
  };

  const handleBackClick = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-b-2 border-orange-500 rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-8">
      {/* Header with Back and Edit Buttons */}
      <div className="flex justify-between items-center">
        <button 
          onClick={handleBackClick}
          className={`p-2 hover:bg-zinc-300 rounded-full ${
            darkMode ? " text-white" : "bg-zinc-500"
          }`}
        >
          <svg 
            className="w-6 h-6" 
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
        
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className={`p-2 rounded-full ${
              darkMode ? "bg-zinc-800 text-white" : "bg-zinc-500"
            }`}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
              />
            </svg>
          </button>
        )}
      </div>
        
      {/* Profile Header - Modified Layout */}
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          {isEditing ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          ) : null}
          <div className="w-full h-full rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden dark:bg-zinc-800">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className={`text-2xl font-bold text-black ${darkMode ? 'text-white': ''}`}>
            {profileData.name || "User"}
          </h2>
          <p className="text-gray-500 dark:text-gray-300">
            {user?.user_id ? `ID: ${user.user_id}` : `Email: ${user?.email || "Unknown"}`}
          </p>
          {user?.recent_login && (
            <p className="text-gray-400 dark:text-gray-400 text-sm">
              Last login: {new Date(user.recent_login).toLocaleDateString()}
            </p>
          )}
          {user?.first_login && (
            <p className="text-gray-400 dark:text-gray-400 text-sm">
              Member since: {new Date(user.first_login).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      {/* Details Section */}
      <div className="space-y-6">
        <div
          className={`p-5 grid grid-cols-1 md:grid-cols-2 gap-6 rounded-3xl ${
            darkMode ? "bg-zinc-900" : "bg-zinc-100"
          }`}
        >
          <h1 className={`text-2xl ${darkMode ? "text-zinc-200" : "text-zinc-700"}`}>
            Details
          </h1>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-zinc-700"}`}>
              Name
            </label>
            {isEditing ? (
              <input
                placeholder="FirstName LastName"
                type="text"
                value={profileData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${
                  darkMode ? "bg-zinc-800 text-white border-zinc-600" : "text-black"
                }`}
              />
            ) : (
              <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                {profileData.name}
              </div>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-zinc-700"}`}>
              Age
            </label>
            {isEditing ? (
              <input
                placeholder="eg.99"
                type="number"
                value={profileData.age}
                onChange={(e) => updateField('age', e.target.value)}
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${
                  darkMode ? "bg-zinc-800 text-white border-zinc-600" : "text-black"
                }`}
              />
            ) : (
              <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                {profileData.age}
              </div>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-zinc-700"}`}>
              Email
            </label>
            {isEditing ? (
              <input
                placeholder="example@gmail.com"
                type="email"
                value={profileData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${
                  darkMode ? "bg-zinc-800 text-white border-zinc-600" : "text-black"
                }`}
              />
            ) : (
              <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                {profileData.email}
              </div>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-zinc-700"}`}>
              Phone
            </label>
            {isEditing ? (
              <input
                placeholder="0123456789"
                type="tel"
                value={profileData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${
                  darkMode ? "bg-zinc-800 text-white border-zinc-600" : "text-black"
                }`}
              />
            ) : (
              <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                {profileData.phone}
              </div>
            )}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-zinc-700"}`}>
              Qualification
            </label>
            {isEditing ? (
              <input
                placeholder="e.g. Bachelor's Degree"
                type="text"
                value={profileData.qualification}
                onChange={(e) => updateField('qualification', e.target.value)}
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${
                  darkMode ? "bg-zinc-800 text-white border-zinc-600" : "text-black"
                }`}
              />
            ) : (
              <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                {profileData.qualification || "Not specified"}
              </div>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className={`rounded-3xl p-5 ${darkMode ? "bg-zinc-900" : "bg-zinc-100"}`}>
          <h1 className={`text-2xl ${darkMode ? "text-zinc-200" : "text-zinc-700"}`}>
            Address
          </h1>
          <br />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-zinc-700"}`}>
                Country
              </label>
              {isEditing ? (
                <select
                  value={profileData.country}
                  onChange={(e) => updateLocation('country', e.target.value)}
                  className="w-full p-2 border text-zinc-600 rounded-md border-zinc-500 outline-none cursor-pointer"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                  {countryName || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-zinc-700"}`}>
                State
              </label>
              {isEditing ? (
                <select
                  value={profileData.state}
                  onChange={(e) => updateLocation('state', e.target.value)}
                  className="w-full p-2 text-zinc-600 border border-zinc-500 rounded-md outline-none cursor-pointer"
                  disabled={!profileData.country}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                  {stateName || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-zinc-700"}`}>
                City
              </label>
              {isEditing ? (
                <select
                  value={profileData.city}
                  onChange={(e) => updateLocation('city', e.target.value)}
                  className="w-full p-2 border text-zinc-600 border-zinc-500 rounded-md outline-none cursor-pointer"
                  disabled={!profileData.state}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                  {profileData.city || "Not specified"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className={`rounded-3xl p-5 ${darkMode ? "bg-zinc-900" : "bg-zinc-100"}`}>
          <label className={`block mb-4 text-2xl ${darkMode ? "text-zinc-200" : "text-zinc-700"}`}>
            Interests
          </label>
          <div className="flex flex-wrap gap-3">
            {interestsList.map((interest) => (
              isEditing ? (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 cursor-pointer rounded-full text-sm border-orange-500 ${
                    profileData.interests.includes(interest)
                      ? "bg-[#f58220] text-white"
                      : `bg-[#fcf8ff] border ${darkMode ? 'bg-zinc-800 text-white border-orange-200' : 'text-black'}`
                  }`}
                >
                  {interest}
                </button>
              ) : profileData.interests.includes(interest) ? (
                <span
                  key={interest}
                  className={`px-4 py-2 rounded-full text-sm bg-[#f58220] text-white`}
                >
                  {interest}
                </span>
              ) : null
            ))}
          </div>
        </div>

        {/* Manage Account */}
        <div className={`rounded-3xl p-5 ${darkMode ? "bg-zinc-900" : "bg-zinc-100"}`}>
          <h1 className={`block mb-3 text-2xl ${darkMode ? "text-zinc-200" : "text-zinc-700"}`}>
            Manage Account
          </h1>
          <div className="flex flex-col gap-1.5">
            <button 
              onClick={handleLogout}
              className="text-red-500 dark:text-red-400 text-left hover:text-red-600 transition-colors"
            >
              Logout
            </button>
            <Link to="/logout" className="text-red-500 dark:text-red-400 hover:text-red-600 transition-colors">
              Delete Account
            </Link>
          </div>
        </div>

        {/* Save Button - Only visible in edit mode */}
        {isEditing && (
          <div className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button 
                className={`px-6 py-2 rounded-md transition ${
                  isSaving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#f58220] hover:bg-[#e67300] cursor-pointer'
                } text-white`}
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition"
                onClick={() => {
                  resetProfile();
                  setIsEditing(false);
                }}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;