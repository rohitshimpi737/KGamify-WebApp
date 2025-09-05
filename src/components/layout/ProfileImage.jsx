import { useState } from 'react';
import DefaultImage from "../../assets/image.png";

const ProfileImage = ({ 
  size = 'md', 
  editable = false, 
  darkMode = false,
  onImageChange,
  imageSrc = DefaultImage 
}) => {
  const [image, setImage] = useState(imageSrc);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        if (onImageChange) {
          onImageChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {editable && (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      )}
      <div className={`
        w-full h-full rounded-full 
        bg-gray-200 border-4 border-white 
        shadow-lg overflow-hidden 
        transition-all duration-200
        ${darkMode ? 'dark:bg-zinc-800 dark:border-zinc-700' : ''}
      `}>
        <img
          src={image}
          alt="Profile"
          className="w-full h-full object-cover transition-transform duration-200"
        />
      </div>
    </div>
  );
};

export default ProfileImage;