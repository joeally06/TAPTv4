// Update handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrors([]);

  const validationErrors = validateMembershipForm(formData);
  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    setIsSubmitting(false);
    
    const firstErrorField = document.querySelector(`[name="${validationErrors[0].field}"]`);
    firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL is not defined');
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/submit-membership`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit application');
    }

    setSubmitSuccess(true);
    
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: null,
      organization: '',
      position: '',
      membership_type: '',
      is_new_member: '',
      hear_about_us: null,
      interests: [],
      agree_to_terms: false
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    setErrors([{ 
      field: 'submit', 
      message: error.message || 'Failed to submit application. Please try again.' 
    }]);
  } finally {
    setIsSubmitting(false);
  }
};