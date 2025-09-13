import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import { useLocation } from "../../hooks/useLocation";
import ProfileImage from '../layout/ProfileImage';


const Profile = () => {
  const { darkMode } = useTheme();
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const DefaultImage = "/images/image.png";


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
    <div className="max-w-5xl mx-auto p-2 space-y-8">
      {/* Header with Back and Edit Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBackClick}
          className={`p-2 hover:bg-zinc-300 rounded-full ${darkMode ? " text-white" : "bg-zinc-500"
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
            className={`p-2 rounded-full ${darkMode ? "bg-zinc-800 text-white" : "bg-zinc-500"
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
      <div className="flex items-center gap-4">
        <ProfileImage
          size="md"
          editable={isEditing}
          darkMode={darkMode}
          imageSrc={selectedImage}
          onImageChange={setSelectedImage}
        />
        <div className="flex flex-col">
          <h2 className={`text-2xl font-bold text-black ${darkMode ? 'text-white' : ''}`}>
            {profileData.name || "User"}
          </h2>
          <p className="text-gray-500 dark:text-gray-300">
            {user?.user_key ? `ID: ${user.user_key}` : `Email: ${user?.email || "Unknown"}`}
          </p>
          {user?.first_login && (
            <p className="text-gray-400 dark:text-gray-400 text-sm">
              Member since: {new Date(user.first_login).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Details Section */}
      {/* <div className="space-y-6">

        <div
          className={`p-5 grid grid-cols-1 md:grid-cols-2 gap-6 rounded-3xl ${darkMode ? "bg-zinc-900" : "bg-zinc-100"
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
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${darkMode ? "bg-zinc-800 text-white border-zinc-600" : "text-black"
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
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${darkMode ? "bg-zinc-800 text-white border-zinc-600" : "text-black"
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
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${darkMode ? "bg-zinc-800 text-white border-zinc-600" : "text-black"
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
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${darkMode ? "bg-zinc-800 text-white border-zinc-600" : "text-black"
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
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${darkMode ? "bg-zinc-800 text-white border-zinc-600" : "text-black"
                  }`}
              />
            ) : (
              <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                {profileData.qualification || "Not specified"}
              </div>
            )}
          </div>
        </div>

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
                  className={`px-4 py-2 cursor-pointer rounded-full text-sm border-orange-500 ${profileData.interests.includes(interest)
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
        
        {isEditing && (
          <div className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                className={`px-6 py-2 rounded-md transition ${isSaving
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
      </div> */}

      <div className={`p-4 rounded-3xl ${darkMode ? "bg-zinc-900" : "bg-gray-100"}`}>
        <h2 className={`text-xl mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Details</h2>
        <div className="space-y-4">
          {/* Name */}
          <div className="relative">
            <label className={`absolute -top-2 left-4 px-2 text-sm ${darkMode ? "bg-zinc-900 text-zinc-400" : "bg-gray-100 text-gray-500"
              }`}>
              Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => updateField('name', e.target.value)}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-xl outline-none ${darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-gray-100 border-gray-200 text-gray-800"
                } ${!isEditing ? 'cursor-default' : ''}`}
            />
          </div>

          {/* Age */}
          <div className="relative">
            <label className={`absolute -top-2 left-4 px-2 text-sm ${darkMode ? "bg-zinc-900 text-zinc-400" : "bg-gray-100 text-gray-500"
              }`}>
              Age
            </label>
            <input
              type="number"
              value={profileData.age}
              onChange={(e) => updateField('age', e.target.value)}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-xl outline-none ${darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-gray-100 border-gray-200 text-gray-800"
                } ${!isEditing ? 'cursor-default' : ''}`}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <label className={`absolute -top-2 left-4 px-2 text-sm ${darkMode ? "bg-zinc-900 text-zinc-400" : "bg-gray-100 text-gray-500"
              }`}>
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              disabled
              className={`w-full p-3 border rounded-xl outline-none cursor-not-allowed ${darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-gray-100 border-gray-200 text-gray-800"
                }`}
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <label className={`absolute -top-2 left-4 px-2 text-sm ${darkMode ? "bg-zinc-900 text-zinc-400" : "bg-gray-100 text-gray-500"
              }`}>
              Phone number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              disabled
              className={`w-full p-3 border rounded-xl outline-none cursor-not-allowed ${darkMode
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-gray-100 border-gray-200 text-gray-800"
                }`}
            />
          </div>

          {/* Address */}
          <div className="relative">
            <label className={`absolute -top-2 left-4 px-2 text-sm ${darkMode ? "bg-zinc-900 text-zinc-400" : "bg-gray-100 text-gray-500"
              }`}>
              Address
            </label>
            {isEditing ? (
              <div className="flex gap-2">
                <select
                  value={profileData.country}
                  onChange={(e) => updateLocation('country', e.target.value)}
                  className={`w-1/3 p-3 border rounded-xl ${darkMode ? "bg-zinc-900 border-zinc-700 text-white" : "bg-gray-100 border-gray-200"
                    }`}
                >
                  <option value="">Country</option>
                  {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                </select>
                <select
                  value={profileData.state}
                  onChange={(e) => updateLocation('state', e.target.value)}
                  className={`w-1/3 p-3 border rounded-xl ${darkMode ? "bg-zinc-900 border-zinc-700 text-white" : "bg-gray-100 border-gray-200"
                    }`}
                  disabled={!profileData.country}
                >
                  <option value="">State</option>
                  {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                </select>
                <select
                  value={profileData.city}
                  onChange={(e) => updateLocation('city', e.target.value)}
                  className={`w-1/3 p-3 border rounded-xl ${darkMode ? "bg-zinc-900 border-zinc-700 text-white" : "bg-gray-100 border-gray-200"
                    }`}
                  disabled={!profileData.state}
                >
                  <option value="">City</option>
                  {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            ) : (
              <input
                type="text"
                value={[profileData.city, stateName, countryName].filter(Boolean).join(", ")}
                disabled
                className={`w-full p-3 border rounded-xl outline-none ${darkMode
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-gray-100 border-gray-200 text-gray-800"
                  } cursor-default`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Interests Section */}
      <div className={`p-6 rounded-3xl ${darkMode ? "bg-zinc-900" : "bg-gray-50"}`}>
        <h2 className={`text-xl mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Interests</h2>
        <div className="flex flex-wrap gap-3">
          {interestsList.map((interest) => (
            <button
              key={interest}
              onClick={() => isEditing && toggleInterest(interest)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${profileData.interests.includes(interest)
                ? "bg-[#f58220] border-[#f58220] text-white"
                : darkMode
                  ? "bg-zinc-800 border-zinc-700 text-zinc-400"
                  : "bg-white border-gray-200 text-gray-500"
                } ${isEditing ? 'cursor-pointer hover:bg-orange-50' : 'cursor-default'}`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              resetProfile();
              setIsEditing(false);
            }}
            className="px-6 py-2 rounded-full border border-zinc-300 hover:bg-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-6 py-2 rounded-full bg-[#f58220] text-white hover:bg-[#e67300] transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

    </div>
  );
};

export default Profile;