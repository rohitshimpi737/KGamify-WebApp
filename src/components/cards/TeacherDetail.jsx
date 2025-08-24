import { useState, useEffect } from 'react';
import API from '../../services/api';

const TeacherDetail = ({ onClose, teacher, teacherId }) => {
  const [teacherDetails, setTeacherDetails] = useState(teacher || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load detailed teacher info if we have teacherId but no detailed data
  useEffect(() => {
    const loadTeacherDetails = async () => {
      if (teacherId && (!teacher || !teacher.detailedLoaded)) {
        setIsLoading(true);
        setError(null);
        
        try {
          const result = await API.teacher.getTeacherDetails(teacherId);
          
          if (result.success && result.teacher) {
            setTeacherDetails({
              ...teacher,
              ...result.teacher,
              detailedLoaded: true
            });
          } else {
            setError('Failed to load teacher details');
          }
        } catch (err) {
          console.error('Error loading teacher details:', err);
          setError('Failed to load teacher details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadTeacherDetails();
  }, [teacherId, teacher]);

  const displayTeacher = teacherDetails || teacher;
  return (
    <div className={`w-full`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 ">
        <span className="text-black font-medium">Teacher Detail</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-orange-300 rounded-full cursor-pointer transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5 text-gray-800 "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Profile Icon Container */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-orange-400 "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {/* <img src={teacher.profilePic} className="w-12 h-12 " alt="" />     */}
        </div>
      </div>

      {/* Rest of the content remains the same */}
      <h3 className="text-lg font-semibold text-center mb-6 text-gray-800">
        {isLoading ? "Loading..." : displayTeacher?.name || "Unknown Teacher"}
      </h3>

      {error && (
        <div className="text-center mb-4 text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Department:</span>
          <span className="text-gray-700 font-medium">
            {isLoading ? "Loading..." : displayTeacher?.department || "N/A"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Institute:</span>
          <span className="text-gray-700 font-medium">
            {isLoading ? "Loading..." : displayTeacher?.institute || "N/A"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Championships:</span>
          <span className="text-gray-700 font-medium">
            {isLoading ? "Loading..." : displayTeacher?.championshipsCreated || "0"}
          </span>
        </div>

        {displayTeacher?.email && (
          <div className="flex justify-between">
            <span className="text-gray-500">Email:</span>
            <span className="text-gray-700 font-medium">{displayTeacher.email}</span>
          </div>
        )}

        {displayTeacher?.phone && (
          <div className="flex justify-between">
            <span className="text-gray-500">Phone:</span>
            <span className="text-gray-700 font-medium">{displayTeacher.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDetail;
