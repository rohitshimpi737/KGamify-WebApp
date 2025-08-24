import { useState, useEffect } from 'react';
import API from '../../services/api';

const TeacherDetail = ({ onClose, teacher }) => {
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTeacherDetails = async () => {
      if (!teacher?.id) {
        setTeacherDetails(teacher);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await API.teacher.getTeacherDetails(teacher.id);
        
        if (response.success) {
          setTeacherDetails({
            ...teacher,
            ...response.teacher,
            imageUrl: teacher.image || response.teacher?.image
          });
        } else {
          setError('Could not load teacher details');
        }
      } catch (err) {
        console.error('Error loading teacher details:', err);
        setError('Failed to load teacher information');
      } finally {
        setIsLoading(false);
      }
    };

    loadTeacherDetails();
  }, [teacher]);

  const displayTeacher = teacherDetails || teacher;

  return (
    <div className="w-full">
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Teacher Details</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-orange-100 transition-colors"
        >
          <svg 
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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

      {/* Profile Image/Icon */}
      <div className="flex justify-center mb-6">
        {displayTeacher?.imageUrl ? (
          <img 
            src={displayTeacher.imageUrl}
            alt={displayTeacher.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-orange-100"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Teacher Name */}
      <div className="text-center mb-6">
        <h4 className="text-xl font-semibold text-gray-900">
          {isLoading ? "Loading..." : displayTeacher?.name || "Unknown Teacher"}
        </h4>
        {displayTeacher?.designation && (
          <p className="text-sm text-gray-500 mt-1">{displayTeacher.designation}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center mb-4 p-2 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Teacher Details */}
  <div className="space-y-4">
        {[
          { label: 'Department', value: displayTeacher?.department },
          { label: 'Institute', value: displayTeacher?.institute },
          { 
            label: 'Championships', 
            value: displayTeacher?.championship_count || '0',
            suffix: 'created'
          }
        ].map((item, index) => (
          item.value && (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{item.label}:</span>
              <span className="text-sm font-medium text-gray-900">
                {item.value} {item.suffix}
              </span>
            </div>
          )
        ))}
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default TeacherDetail;