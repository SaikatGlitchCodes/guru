import React, { useEffect } from 'react';
import { REQUEST_STEPS } from './constants';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { createRequest } from '@/lib/api';
import GoogleAuthButton from '@/components/GoogleAuthButton';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const FormNavigationButton = ({
  currentStep,
  setCurrentStep,
  form,
  isSubmitting,
  setIsSubmitting,
  clearSavedData
}) => {
  const { user, signInWithMagicLink, isRequestInLocalStorage } = useUser();
  const router = useRouter();

  // Handle successful authentication and automatic request creation
  useEffect(() => {
    if (user && isRequestInLocalStorage && !isSubmitting) {
      // User is authenticated and there's a pending request, it should be handled by UserContext
      toast.success("Request submitted successfully! Redirecting...");
      setTimeout(() => {
        router.push('/find-tutors');
      }, 2000);
    }
  }, [user, isRequestInLocalStorage, isSubmitting, router]);

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
            setIsSubmitting(true);
            if (!user) {
              // Save form data to localStorage before redirecting to Google OAuth
              localStorage.setItem("pendingTutorRequest", JSON.stringify(form.getValues()));
              toast.info("Please sign in to submit your request");
              // Don't call signInWithMagicLink here, let user choose Google or email
            } else {
              await createRequest(form.getValues());
              // Clear saved form data after successful submission
              if (clearSavedData) {
                clearSavedData();
              }
              toast.success("Request submitted successfully!");
              router.push('/tutor-jobs');
            }
          } catch (error) {
            console.error("Form submission error:", error);
            toast.error("Failed to submit request. Please try again.");
            setIsSubmitting(false);
          }
        }
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 mt-5">
      <Button
        type={currentStep === REQUEST_STEPS.length - 1 ? "submit" : "button"}
        onClick={handleNext}
        className="px-14 bg-black text-white"
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? 'Submitting...'
          : currentStep === REQUEST_STEPS.length - 1 
            ? (user ? 'Submit' : 'Sign In to Submit') 
            : 'Continue'
        }
      </Button>
      {currentStep === 0 && (
        <div onClick={(e) => e.stopPropagation()}>
          <GoogleAuthButton btn={true} />
        </div>
      )}
      {currentStep === REQUEST_STEPS.length - 1 && !user && (
        <div className="w-full mt-3" onClick={(e) => e.stopPropagation()}>
          <p className="text-sm text-gray-600 mb-2">Sign in to submit your request:</p>
          <GoogleAuthButton btn={false} />
        </div>
      )}
    </div>
  );
};

export default FormNavigationButton;