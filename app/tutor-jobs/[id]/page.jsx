"use client"
import { useRequestDetailLogic } from "./hooks/useRequestDetailLogic"
import LoadingState, { NotFoundState } from "./components/loading-states"
import RequestHeader from "./components/request-header"
import StudentProfileCard from "./components/student-profile-card"
import RequestDetailsSection from "./components/request-details-section"
import ContactSidebar from "./components/contact-sidebar"
import ContactModal from "./components/contact-modal"
import AuthModalDialog from "./components/auth-modal-dialog"

export default function RequestDetailPage() {
  const {
    // State
    request,
    loading,
    contacting,
    showContactModal,
    hasContacted,
    showAuthModal,
    
    // Computed values
    urgencyInfo,
    popularityInfo,
    contactCost,
    timeAgo,
    shouldShowRecommendation,
    
    // User data
    user,
    profile,
    
    // Actions
    handleContactStudent,
    handleCopyToClipboard,
    handleOpenWhatsApp,
    handleOpenEmail,
    setShowContactModal,
    setShowAuthModal,
    
    // Navigation
    router
  } = useRequestDetailLogic()

  if (loading) {
    return <LoadingState />
  }

  if (!request) {
    return <NotFoundState onGoBack={() => router.back()} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with breadcrumb */}
      <RequestHeader 
        request={request} 
        onGoBack={() => router.back()} 
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Student Profile Card */}
            <StudentProfileCard
              request={request}
              timeAgo={timeAgo}
              shouldShowRecommendation={shouldShowRecommendation}
            />

            {/* Request Details */}
            <RequestDetailsSection request={request} />
          </div>

          {/* Sidebar */}
          <div>
            <ContactSidebar
              request={request}
              user={user}
              profile={profile}
              contactCost={contactCost}
              contacting={contacting}
              onContactStudent={handleContactStudent}
              onShowContactModal={setShowContactModal}
            />
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onOpenChange={setShowContactModal}
        request={request}
        onCopyToClipboard={handleCopyToClipboard}
        onOpenEmail={handleOpenEmail}
        onOpenWhatsApp={handleOpenWhatsApp}
      />

      {/* Auth Modal */}
      <AuthModalDialog
        isOpen={showAuthModal}
        onOpenChange={setShowAuthModal}
      />
    </div>
  )
}
