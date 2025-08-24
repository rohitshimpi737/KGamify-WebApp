import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API, { getUserId } from '../services/api';

export const useProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    country: "US",
    state: "CA", 
    city: "Los Angeles",
    qualification: "",
    interests: []
  });

  // Initialize profile data from user context
  useEffect(() => {
    if (user) {
      const primaryQualification = user.qualifications?.[0]?.user_qualification || "";
      
      setProfileData(prev => ({
        ...prev,
        name: user.user_name || "",
        email: user.email || "",
        phone: user.phone_no || "",
        qualification: primaryQualification,
        age: user.age || "",
        // Parse location if available, otherwise keep defaults
        city: user.location ? user.location.split(",")?.[0]?.trim() : prev.city,
        state: user.location ? user.location.split(",")?.[1]?.trim() : prev.state,
        country: user.location ? user.location.split(",")?.[2]?.trim() : prev.country,
        interests: user.interests ? 
          (typeof user.interests === 'string' 
            ? user.interests.split(',').map(i => i.trim()).filter(i => i)
            : []) : []
      }));
    }
  }, [user]);

  // Update profile field
  const updateField = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  // Update location with cascade
  const updateLocation = (field, value) => {
    setProfileData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when parent changes
      if (field === 'country') {
        newData.state = '';
        newData.city = '';
      } else if (field === 'state') {
        newData.city = '';
      }
      
      return newData;
    });
    setError(null);
  };

  // Toggle interest
  const toggleInterest = (interest) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(item => item !== interest)
        : [...prev.interests, interest]
    }));
    setError(null);
  };

  // Save profile changes
  const saveProfile = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Always send all fields to ensure complete update
      const personalData = {
        userId: userId,
        name: profileData.name || '',
        email: profileData.email || '',
        age: profileData.age?.toString() || '',
        phoneNo: profileData.phone || '',
        interests: profileData.interests.length > 0 ? profileData.interests.join(',') : '',
        location: ''
      };

      // Create location string if we have any location data
      const locationParts = [profileData.city, profileData.state, profileData.country].filter(Boolean);
      if (locationParts.length > 0) {
        personalData.location = locationParts.join(', ');
      }

      // Call API to update personal data
      const personalResult = await API.user.updatePersonalData(personalData);

      // Also update qualification if it exists
      let qualificationResult = { success: true }; // Default to success if no qualification
      if (profileData.qualification?.trim()) {
        const qualificationData = {
          userId: userId,
          qualification: profileData.qualification.trim(),
          educationType: profileData.qualification.trim(),
          instituteName: '', // Keep empty as requested
          boardName: '', // Keep empty as requested
          passingYear: '', // Keep empty as requested
          percentage: '', // Keep empty as requested
          isHighest: true,
        };
        
        console.log('Sending qualification data:', qualificationData);
        qualificationResult = await API.user.updateQualificationDetails(qualificationData);
        console.log('Qualification result:', qualificationResult);
      }

      if (personalResult.success && qualificationResult.success) {
        return true;
      } else {
        const errors = [];
        if (!personalResult.success) errors.push(`Personal data: ${personalResult.error}`);
        if (!qualificationResult.success) errors.push(`Qualification: ${qualificationResult.error}`);
        throw new Error(errors.join(', '));
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Reset profile to original user data
  const resetProfile = () => {
    if (user) {
      const primaryQualification = user.qualifications?.[0]?.user_qualification || "";
      
      setProfileData({
        name: user.user_name || "",
        email: user.email || "",
        phone: user.phone_no || "",
        qualification: primaryQualification,
        age: user.age || "",
        city: user.location ? user.location.split(",")?.[0]?.trim() : "Los Angeles",
        state: user.location ? user.location.split(",")?.[1]?.trim() : "CA",
        country: user.location ? user.location.split(",")?.[2]?.trim() : "US",
        interests: user.interests ? 
          (typeof user.interests === 'string' 
            ? user.interests.split(',').map(i => i.trim()).filter(i => i)
            : []) : []
      });
    }
    setError(null);
  };

  return {
    profileData,
    isLoading,
    isSaving,
    error,
    updateField,
    updateLocation,
    toggleInterest,
    saveProfile,
    resetProfile,
  };
};
