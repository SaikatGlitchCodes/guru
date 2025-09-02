import PersonalInformation from "@/components/profile/PersonalInformation"
import AccountInfo from "@/components/profile/AccountInfo"
import AddressInfo from "@/components/profile/AddressInfo"
import ProfileDetails from "@/components/profile/ProfileDetails"
import Subject from "@/components/profile/TutorComponents/Subject"
import ProfessionalInformation from "@/components/profile/TutorComponents/ProfessionalInformation"
import LanguagesAndSpecializations from "@/components/profile/TutorComponents/LanguagesAndSpecializations"
import AvailabilityAndPreferences from "@/components/profile/TutorComponents/AvailabilityAndPreferences"

// Define profile steps in order of importance with layout preferences
export const PROFILE_STEPS = [
    {
        title: "Personal Information",
        Component: PersonalInformation,
        fields: ["name", "phone_number", "gender"],
        description: "Basic information required for your profile",
        layout: "col-span-1",
        priority: 1
    },
    {
        title: "Profile Details",
        Component: ProfileDetails,
        fields: ["bio"],
        description: "Tell others about yourself",
        layout: "col-span-1",
        priority: 2
    },
    {
        title: "Account Info",
        Component: AccountInfo,
        fields: ["role"],
        description: "Your role and account settings",
        layout: "col-span-1",
        priority: 3
    },
    {
        title: "Address Information",
        Component: AddressInfo,
        fields: ["address.street", "address.city", "address.country"],
        description: "Where you're located",
        layout: "col-span-1",
        priority: 4
    }
]

// Tutor-specific steps (will be added after basic steps for tutors)
export const TUTOR_STEPS = [
    {
        title: "Teaching Subjects",
        Component: Subject,
        fields: [],
        description: "Subjects you can teach",
        layout: "col-span-1",
        priority: 3
    },
    {
        title: "Availability",
        Component: AvailabilityAndPreferences,
        fields: [],
        description: "Your availability and preferences",
        layout: "col-span-1",
        priority: 4
    },
    {
        title: "Professional Information",
        Component: ProfessionalInformation,
        fields: [],
        description: "Your rates and professional details",
        layout: "col-span-1",
        priority: 5
    },
    {
        title: "Languages & Skills",
        Component: LanguagesAndSpecializations,
        fields: [],
        description: "Languages and specializations",
        layout: "col-span-1",
        priority: 6
    }
]

const NEW_PROFILE_STEPS = [
    {
        title: "Personal Information",
        Component: PersonalInformation,
        fields: ["name", "phone_number", "gender"],
        description: "Basic information required for your profile",
        layout: "col-span-1",
        priority: 1
    },
    {
        title: "Teaching Subjects",
        Component: Subject,
        fields: [],
        description: "Subjects you can teach",
        layout: "col-span-1",
        priority: 3
    },
    {
        title: "Profile Details",
        Component: ProfileDetails,
        fields: ["bio"],
        description: "Tell others about yourself",
        layout: "col-span-1",
        priority: 2
    },
    {
        title: "Account Info",
        Component: AccountInfo,
        fields: ["role"],
        description: "Your role and account settings",
        layout: "col-span-1",
        priority: 3
    },
    {
        title: "Address Information",
        Component: AddressInfo,
        fields: ["address.street", "address.city", "address.country"],
        description: "Where you're located",
        layout: "col-span-1",
        priority: 4
    },
    
    {
        title: "Availability",
        Component: AvailabilityAndPreferences,
        fields: [],
        description: "Your availability and preferences",
        layout: "col-span-1",
        priority: 4
    },
    {
        title: "Professional Information",
        Component: ProfessionalInformation,
        fields: [],
        description: "Your rates and professional details",
        layout: "col-span-1",
        priority: 5
    },
    {
        title: "Languages & Skills",
        Component: LanguagesAndSpecializations,
        fields: [],
        description: "Languages and specializations",
        layout: "col-span-1",
        priority: 6
    }
]

// Dynamic layout arrangement for better visual balance
export const getLayoutArrangement = (steps, currentStep) => {
    const visibleSteps = steps.slice(0, currentStep + 1);

    return visibleSteps.map((step, index) => {
        return {
            ...step,
            layout: "col-span-1",
            index
        };
    });
};

// Get steps based on role
export const getStepsForRole = (role) => {
    // const baseSteps = [...PROFILE_STEPS]
    // if (role === 'tutor') {
    //     return [...baseSteps, ...TUTOR_STEPS]
    // }
    return NEW_PROFILE_STEPS
}
