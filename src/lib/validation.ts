// Validation utility functions

export interface ValidationError {
  field: string;
  message: string;
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Allows formats: (123) 456-7890, 123-456-7890, 1234567890
  const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

export interface MembershipFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  membershipType: string;
  isNewMember: string;
  hearAboutUs: string;
  interests: string[];
  agreeToTerms: boolean;
}

export const validateMembershipForm = (data: MembershipFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!data.firstName.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!data.lastName.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!data.phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  if (!data.organization.trim()) {
    errors.push({ field: 'organization', message: 'Organization is required' });
  }

  if (!data.position.trim()) {
    errors.push({ field: 'position', message: 'Position is required' });
  }

  if (!data.membershipType) {
    errors.push({ field: 'membershipType', message: 'Please select a membership type' });
  }

  if (!data.isNewMember) {
    errors.push({ field: 'isNewMember', message: 'Please indicate if you are a new member' });
  }

  if (!data.agreeToTerms) {
    errors.push({ field: 'agreeToTerms', message: 'You must agree to the terms and conditions' });
  }

  if (data.interests.length === 0) {
    errors.push({ field: 'interests', message: 'Please select at least one area of interest' });
  }

  return errors;
};
