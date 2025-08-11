// submitForm.tsx
import React from 'react';
import { REQUEST_STEPS } from './constants';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { createRequest } from '@/lib/api';

const FormNavigationButton = ({
  currentStep,
  setCurrentStep,
  form,
  isSubmitting,
  setIsSubmitting,
  clearSavedData
}) => {
  const {user, signInWithMagicLink} = useUser();

  const handleNext = async (e) => {
    e.preventDefault();

    const currentStepFields = REQUEST_STEPS[currentStep].fields;
    console.log('Current Step:', currentStepFields);
    
    try {
      // Make sure subject is an array even if empty before validation
      if (currentStepFields.includes('subject') && !form.getValues('subject')) {
        form.setValue('subject', []);
      }
      
      const isValid = await form.trigger(currentStepFields);
      console.log('Validation result for step', currentStep, isValid, REQUEST_STEPS.length - 1);
      
      // Log form errors if validation fails
      if (!isValid) {
        console.error('Form errors:', form.formState.errors);
      }
      
      if (isValid) {
        if (currentStep < REQUEST_STEPS.length - 1) {
          console.log('Moving to next step:', currentStep + 1);
          setCurrentStep(currentStep + 1);
          setTimeout(() => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
          }, 50);
        } else {
          console.log('Final step reached, submitting form');
          try {
            if (!user) {
              console.log("User not authenticated, storing data in localStorage and redirecting to sign-in");
              localStorage.setItem("pendingTutorRequest", JSON.stringify(form.getValues()));
              console.log("User not authenticated, storing data and redirecting...")
              signInWithMagicLink(form.getValues().email);
            } else {
              console.log("User authenticated, submitting form...");
              await createRequest(form.getValues());
              console.log("Form submitted:", form.getValues());
              // Clear saved form data after successful submission
              if (clearSavedData) {
                clearSavedData();
              }
            }
            setIsSubmitting(true);
          } catch (error) {
            console.error("Form submission error:", error)
          }
        }
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <Button
        type={currentStep === REQUEST_STEPS.length - 1 ? "submit" : "button"}
        onClick={handleNext}
        className="px-14 bg-black text-white mt-5"
        disabled={isSubmitting}
      >
        {currentStep === REQUEST_STEPS.length - 1 ? 'Submit' : 'Save'}
      </Button>
    </div>
  );
};

export default FormNavigationButton;