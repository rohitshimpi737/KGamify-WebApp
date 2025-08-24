// Centralized form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    // Check required fields
    if (fieldRules.required) {
      const error = validateRequired(value, fieldRules.label || field);
      if (error) {
        errors[field] = error;
        return;
      }
    }
    
    // Skip other validations if field is empty and not required
    if (!value) return;
    
    // Email validation
    if (fieldRules.type === 'email' && !validateEmail(value)) {
      errors[field] = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (fieldRules.type === 'phone' && !validatePhone(value)) {
      errors[field] = 'Please enter a valid phone number';
    }
    
    // Password validation
    if (fieldRules.type === 'password' && !validatePassword(value)) {
      errors[field] = 'Password must be at least 6 characters long';
    }
    
    // Confirm password validation
    if (fieldRules.type === 'confirmPassword' && value !== data[fieldRules.matchField]) {
      errors[field] = 'Passwords do not match';
    }
    
    // Custom validation
    if (fieldRules.validate && typeof fieldRules.validate === 'function') {
      const customError = fieldRules.validate(value, data);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
