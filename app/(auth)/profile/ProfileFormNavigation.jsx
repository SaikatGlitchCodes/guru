import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getStepsForRole } from './constants';

const ProfileFormNavigationButton = ({
  currentStep,
  setCurrentStep,
  form,
  isSaving,
  onSubmit,
  role
}) => {
  const steps = getStepsForRole(role)
  
  // Check if form has any changes using React Hook Form's dirtyFields
  const hasChanges = Object.keys(form.formState.dirtyFields).length > 0

  const handleNext = async (e) => {
    e.preventDefault();

    const currentStepFields = steps[currentStep].fields;
    
    try {
      // Only validate if there are fields to validate
      if (currentStepFields && currentStepFields.length > 0) {
        // Validate current step fields
        const isValid = await form.trigger(currentStepFields);
        
        if (!isValid) {
          console.error('Form errors:', form.formState.errors);
          
          // Find and focus on the first error field
          const errors = form.formState.errors;
          let firstErrorField = null;
          
          // Check for field errors in current step
          for (const field of currentStepFields) {
            const fieldParts = field.split('.');
            let hasError;
            
            if (fieldParts.length > 1) {
              hasError = errors[fieldParts[0]]?.[fieldParts[1]];
            } else {
              hasError = errors[field];
            }
            
            if (hasError) {
              firstErrorField = field;
              break;
            }
          }
          
          if (firstErrorField) {
            // Scroll to and focus the error field
            setTimeout(() => {
              const element = document.querySelector(`[name="${firstErrorField}"]`) || 
                            document.querySelector(`[name="${firstErrorField.replace('.', '\\.')}"]`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
              }
            }, 100);
          }
          return;
        }
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        // Scroll to the new step
        setTimeout(() => {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        }, 100);
      } else {
        // Final step - submit the form
        await onSubmit(form.getValues());
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        const currentStepElement = document.querySelector('.profile-step-container');
        if (currentStepElement) {
          currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 mt-5 pt-6 border-t">
      <div className="flex items-center gap-3">
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={isSaving}
          >
            Previous
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </div>
        <Button
          type={currentStep === steps.length - 1 ? "submit" : "button"}
          onClick={handleNext}
          disabled={isSaving || (currentStep === steps.length - 1 && !hasChanges)}
          className="px-8"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving 
            ? 'Saving...'
            : currentStep === steps.length - 1 
              ? hasChanges ? 'Save Profile' : 'No Changes'
              : 'Continue'
          }
        </Button>
      </div>
    </div>
  );
};

export default ProfileFormNavigationButton;
