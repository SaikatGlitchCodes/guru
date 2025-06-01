// submitForm.tsx
import React from 'react';
import { REQUEST_STEPS } from './page';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

const FormNavigationButton = ({
  currentStep,
  setCurrentStep,
  form,
  isSubmitting,
  setIsSubmitting
}) => {
  const {user} = useUser();

  const handleNext = async (e) => {
    e.preventDefault();

    const currentStepFields = REQUEST_STEPS[currentStep].fields;
    console.log('Current Step:', currentStepFields);
    const isValid = await form.trigger(currentStepFields);
    console.log('Validation result for step', currentStep, isValid);
    if (isValid) {
      if (currentStep < REQUEST_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
        setTimeout(() => {
          window.scrollTo({ bottom: 0, behavior: 'smooth' });
        }, 50);
      } else {
        try {
          if (!user) {
            localStorage.setItem("pendingTutorRequest", JSON.stringify(form.getValues()));
            console.log("User not authenticated, storing data and redirecting...")
            await new Promise((resolve) => setTimeout(resolve, 1500))
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            console.log("Form submitted:", form.getValues());
          }
          setIsSubmitting(true);
        } catch (error) {
          console.error("Form submission error:", error)
        }
      }
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <Button
        type={currentStep === REQUEST_STEPS.length - 1 ? "submit" : "button"}
        onClick={handleNext}
        className="px-14 bg-black text-white mt-5"
      // disabled={isSubmitting}
      >
        {currentStep === REQUEST_STEPS.length - 1 ? 'Submit' : 'Save'}
      </Button>
    </div>
  );
};

export default FormNavigationButton;