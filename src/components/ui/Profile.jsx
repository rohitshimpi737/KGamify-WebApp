import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Country, State, City } from "country-state-city";
import DefaultImage from "../../assets/image.png";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { darkMode } = useTheme();
  const [selectedImage, setSelectedImage] = useState(DefaultImage);
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    age: "30",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    country: "US",
    state: "CA",
    city: "Los Angeles",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState(["Video Games", "Music", "Programming"]);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  
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

  useEffect(() => {
    const loadedCountries = Country.getAllCountries();
    setCountries(loadedCountries);
  }, []);

  useEffect(() => {
    if (userDetails.country) {
      const loadedStates = State.getStatesOfCountry(userDetails.country);
      setStates(loadedStates);
    }
  }, [userDetails.country]);

  useEffect(() => {
    if (userDetails.state) {
      const loadedCities = City.getCitiesOfState(
        userDetails.country,
        userDetails.state
      );
      setCities(loadedCities);
    }
  }, [userDetails.country, userDetails.state]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  // Get display names for location
  const countryName = countries.find(c => c.isoCode === userDetails.country)?.name || '';
  const stateName = states.find(s => s.isoCode === userDetails.state)?.name || '';

  const handleBackClick = () => {
    if (isEditing) {
      setIsEditing(false); // Exit edit mode if currently editing
    } else {
      navigate(-1); // Go back in history if not editing
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-8">
      {/* Header with Back and Edit Buttons */}
      <div className="flex justify-between items-center">
        <button 
          onClick={handleBackClick}
          className={`p-2 hover:bg-zinc-300 rounded-full ${
            darkMode ? " text-white" : ""
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
              darkMode ? "bg-zinc-800 text-white" : "bg-zinc-200"
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
            {userDetails.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-300">ID: #USR_2023_001</p>
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
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${
                  darkMode ? "bg-zinc-800 text-white border-zinc-600" : ""
                }`}
              />
            ) : (
              <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                {userDetails.name}
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
                value={userDetails.age}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, age: e.target.value })
                }
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${
                  darkMode ? "bg-zinc-800 text-white border-zinc-600" : ""
                }`}
              />
            ) : (
              <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                {userDetails.age}
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
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${
                  darkMode ? "bg-zinc-800 text-white border-zinc-600" : ""
                }`}
              />
            ) : (
              <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                {userDetails.email}
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
                value={userDetails.phone}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, phone: e.target.value })
                }
                className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${
                  darkMode ? "bg-zinc-800 text-white border-zinc-600" : ""
                }`}
              />
            ) : (
              <div className={`p-2 ${darkMode ? "text-white" : "text-black"}`}>
                {userDetails.phone}
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
                  value={userDetails.country}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, country: e.target.value })
                  }
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
                  {countryName}
                </div>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-zinc-700"}`}>
                State
              </label>
              {isEditing ? (
                <select
                  value={userDetails.state}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, state: e.target.value })
                  }
                  className="w-full p-2 text-zinc-600 border border-zinc-500 rounded-md outline-none cursor-pointer"
                  disabled={!userDetails.country}
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
                  {stateName}
                </div>
              )}
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-400" : "text-zinc-700"}`}>
                City
              </label>
              {isEditing ? (
                <select
                  value={userDetails.city}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, city: e.target.value })
                  }
                  className="w-full p-2 border text-zinc-600 border-zinc-500 rounded-md outline-none cursor-pointer"
                  disabled={!userDetails.state}
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
                  {userDetails.city}
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
                    selectedInterests.includes(interest)
                      ? "bg-[#f58220] text-white"
                      : `bg-[#fcf8ff] border ${darkMode ? 'bg-zinc-800 text-white border-orange-200' : 'text-black'}`
                  }`}
                >
                  {interest}
                </button>
              ) : selectedInterests.includes(interest) ? (
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
            <Link to="/logout" className="text-red-500 dark:text-red-400">
              Logout
            </Link>
            <Link to="/logout" className="text-red-500 dark:text-red-400">
              Delete Account
            </Link>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="pt-6">
            <button 
              className="px-6 py-2 cursor-pointer bg-[#f58220] text-white rounded-md hover:bg-[#e67300] transition"
              onClick={() => setIsEditing(false)}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;