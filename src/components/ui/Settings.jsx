// src/components/ui/Settings.jsx
import { useTheme } from '../../contexts/ThemeContext';

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  /*const [copied, setCopied] = useState(false);

  const copyLicense = () => {
    navigator.clipboard.writeText('LICENSE-KEY-12345');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
 };*/

  return (
    <div className="ml-0 p-6 max-w-md mx-auto space-y-8 min-h-screen">
      <h1 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-orange-400':''}` }>Settings</h1>

      <div className="space-y-4">
        {/* Dark Theme Toggle */}
        <div className={`flex items-center justify-between p-4 rounded-lg  ${darkMode ? 'bg-gray-700 hover:bg-[#f58220]  text-white ':'bg-gray-100 hover:bg-orange-200'}`}>
          <div>
            <h2 className="font-semibold">Dark Theme</h2>
            <p className="text-sm text-gray-600  ">
              Toggle dark mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative rounded-full w-12 h-6 transition-colors duration-200 ${
              darkMode ? 'bg-orange-500 ' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                darkMode ? 'translate-x-6 ' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* License Section */}
        <div className={`p-4 rounded-lg h ${darkMode ? 'bg-gray-700 hover:bg-[#f58220]  text-white ':'bg-gray-100 hover:bg-orange-200'}`}>
          <h2 className="font-semibold mb-2">License</h2>
          <div className="relative">
            <pre className={`p-3 rounded-md text-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              LICENSE-KEY-12345
            </pre>
            {/* <button
              onClick={copyLicense}
              className="absolute top-2 right-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
            >
              {copied ? (
                <span className="text-sm text-green-500">✓ Copied</span>
              ) : (
                <span className="text-sm text-blue-500 dark:text-blue-400">Copy</span>
              )}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;