import React, { useRef, useEffect } from 'react';
import { REQUEST_STEPS } from './constants';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { createRequest } from '@/lib/api';
import { UserPlus } from 'lucide-react';

const FormNavigationButton = ({
  currentStep,
  setCurrentStep,
  form,
  isSubmitting,
  setIsSubmitting,
  clearSavedData
}) => {
  const { user, signInWithMagicLink } = useUser();
  const googleOneTapRef = useRef(null);

  // Initialize Google One Tap when on first step and user is not authenticated
  useEffect(() => {
    if (currentStep === 0 && !user && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      const initializeGoogleOneTap = () => {
        if (typeof window !== 'undefined' && window.google) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            auto_select: false,
            cancel_on_tap_outside: false,
          })

          if (googleOneTapRef.current) {
            window.google.accounts.id.renderButton(googleOneTapRef.current, {
              theme: 'outline',
              size: 'medium',
              width: '200',
              text: 'continue_with',
              shape: 'rectangular',
            })
          }
        }
      }

      // Load Google Identity Services script
      if (!window.google) {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = initializeGoogleOneTap
        script.onerror = () => {
          console.error('Failed to load Google Identity Services')
          if (googleOneTapRef.current) {
            googleOneTapRef.current.style.display = 'none'
          }
        }
        document.head.appendChild(script)

        return () => {
          try {
            document.head.removeChild(script)
          } catch (e) {
            // Script might already be removed
          }
        }
      } else {
        initializeGoogleOneTap()
      }
    }
  }, [currentStep, user])


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

  // Show Google option only on the first step when user is not authenticated
  const showGoogleOption = currentStep === 0 && !user;

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

      {/* Google One Tap Button Container - Shows on first step only */}
      {showGoogleOption && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <div className="flex justify-start ">
          <div ref={googleOneTapRef}></div>
        </div>
      )}
    </div>
  );
};

export default FormNavigationButton;