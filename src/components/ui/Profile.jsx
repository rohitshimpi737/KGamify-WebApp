import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Country, State, City } from "country-state-city"; // Install with: npm install country-state-city
import DefaultImage from "../../assets/image.png";

const Profile = () => {
  const { darkMode } = useTheme();
  const [selectedImage, setSelectedImage] = useState(DefaultImage);
  const [userDetails, setUserDetails] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

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

  // Load countries on component mount
  useEffect(() => {
    const loadedCountries = Country.getAllCountries();
    setCountries(loadedCountries);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (userDetails.country) {
      const loadedStates = State.getStatesOfCountry(userDetails.country);
      setStates(loadedStates);
      setUserDetails((prev) => ({ ...prev, state: "", city: "" }));
    }
  }, [userDetails.country]);

  // Load cities when state changes
  useEffect(() => {
    if (userDetails.state) {
      const loadedCities = City.getCitiesOfState(
        userDetails.country,
        userDetails.state
      );
      setCities(loadedCities);
      setUserDetails((prev) => ({ ...prev, city: "" }));
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <div className="text-center space-y-4">
        <div className="relative w-32 h-32 mx-auto">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer "
          />
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
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {userDetails.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-300">ID: #USR_2023_001</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6 ">
        <div
          className={`p-5 grid grid-cols-1 md:grid-cols-2 gap-6  rounded-3xl ${
            darkMode ? "bg-zinc-900 " : "bg-zinc-100"
          }`}
        >
          <h1
            className={`text-2xl  ${
              darkMode ? "text-zinc-200" : "text-zinc-700"
            }`}
          >
            Details
          </h1>{" "}
          <br />
          <div>
            <label
              className={`block text-sm font-medium mb-2  ${
                darkMode ? "text-zinc-400" : "text-zinc-700"
              } `}
            >
              Name
            </label>
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
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2  ${
                darkMode ? "text-zinc-400" : "text-zinc-700"
              } `}
            >
              Age
            </label>
            <input
              placeholder="eg.99"
              type="number"
              value={
                userDetails.age > 0 && userDetails.age < 100
                  ? userDetails.age
                  : ""
              }
              onChange={(e) =>
                setUserDetails({ ...userDetails, age: e.target.value })
              }
              className={`w-full p-2 border border-zinc-500 rounded-md outline-none ${
                darkMode ? "bg-zinc-800 text-white border-zinc-600" : ""
              }`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2  ${
                darkMode ? "text-zinc-400" : "text-zinc-700"
              } `}
            >
              Email
            </label>
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
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2  ${
                darkMode ? "text-zinc-400" : "text-zinc-700"
              } `}
            >
              Phone
            </label>
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
          </div>
        </div>

        {/* Address Section */}
        <div className={`bg-zinc-100 rounded-3xl p-5  ${
            darkMode ? "bg-zinc-900 " : "bg-zinc-100"
          }`} >
          <h1 className={`text-black text-2xl ${
              darkMode ? "text-zinc-200" : "text-zinc-700"
            } `}>Address</h1>
          <br />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 cursor-pointer ">
            <div>
              <label className={`block text-sm font-medium mb-2  ${
                darkMode ? "text-zinc-400" : "text-zinc-700"
              } `} >
                Country
              </label>
              <select
                value={userDetails.country}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, country: e.target.value })
                }
                className="w-full p-2 border text-zinc-600  rounded-md border-zinc-500  outline-none cursor-pointer dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label  className={`block text-sm font-medium mb-2  ${
                darkMode ? "text-zinc-400" : "text-zinc-700"
              } `}>
                State
              </label>
              <select
                value={userDetails.state}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, state: e.target.value })
                }
                className="w-full p-2 text-zinc-600  border border-zinc-500 rounded-md outline-none cursor-pointer dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
                disabled={!userDetails.country}
              >
                <option className="" value="">
                  Select State
                </option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label  className={`block text-sm font-medium mb-2  ${
                darkMode ? "text-zinc-400" : "text-zinc-700"
              } `}>
                City
              </label>
              <select
                value={userDetails.city}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, city: e.target.value })
                }
                className="w-full p-2 border text-zinc-600  border-zinc-500 rounded-md  outline-none cursor-pointer dark:bg-zinc-800 dark:text-white dark:border-zinc-600"
                disabled={!userDetails.state}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className={` rounded-3xl p-5  ${
            darkMode ? "bg-zinc-900 " : "bg-zinc-100"
          }`}>
          <label className={`block mb-4 text-2xl ${
              darkMode ? "text-zinc-200" : "text-zinc-700"
            }`} >
            Interests
          </label>
          <div className="flex flex-wrap gap-3 ">
            {interestsList.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 cursor-pointer rounded-full text-sm  border-orange-500 ${
                  selectedInterests.includes(interest)
                    ? "bg-[#f58220] text-white"
                    : `bg-[#fcf8ff] border ${darkMode ? 'bg-zinc-800 text-white border-orange-200' : 'text-black '}`
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Manage Account */}
        <div className={` rounded-3xl p-5  ${
            darkMode ? "bg-zinc-900 " : "bg-zinc-100"
          }`}>
          <h1 className={`block mb-3 text-2xl ${
              darkMode ? "text-zinc-200" : "text-zinc-700"
            }`}>
            Manage Account
          </h1>
          <br />
          <div className="flex flex-col gap-1.5">
            <a href="/profile" className="text-red-500 dark:text-red-400">
              Logout
            </a>
            <a href="/profile" className="text-red-500 dark:text-red-400">
              Delete Account
            </a>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6">
          <button className="px-6 py-2 cursor-pointer bg-[#f58220] text-white rounded-md hover:bg-[#e67300] transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
