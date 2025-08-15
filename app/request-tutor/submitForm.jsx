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
  const { user, signInWithMagicLink } = useUser();

  const handleNext = async (e) => {
    e.preventDefault();

    const currentStepFields = REQUEST_STEPS[currentStep].fields;
    try {
      // Make sure subject is an array even if empty before validation
      if (currentStepFields.includes('subject') && !form.getValues('subject')) {
        form.setValue('subject', []);
      }

      const isValid = await form.trigger(currentStepFields);
      // Log form errors if validation fails
      if (!isValid) {
        console.error('Form errors:', form.formState.errors);
      }

      if (isValid) {
        if (currentStep < REQUEST_STEPS.length - 1) {
          setCurrentStep(currentStep + 1);
          setTimeout(() => {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
          }, 50);
        } else {
          try {
            if (!user) {
              localStorage.setItem("pendingTutorRequest", JSON.stringify(form.getValues()));
              signInWithMagicLink(form.getValues().user_email);
            } else {
              await createRequest(form.getValues());
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
    <div className="flex items-center gap-3 mb-4 mt-5">
      <Button
        type={currentStep === REQUEST_STEPS.length - 1 ? "submit" : "button"}
        onClick={handleNext}
        className="px-14 bg-black text-white"
        disabled={isSubmitting}
      >
        {currentStep === REQUEST_STEPS.length - 1 ? 'Submit' : 'Continue'}
      </Button>
    </div>
  );
};

export default FormNavigationButton;