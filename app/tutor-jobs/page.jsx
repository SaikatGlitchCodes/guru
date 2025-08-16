"use client"

// Force dynamic rendering to fix useSearchParams issue
export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import RequestBrowser from "./components/request-browser"
import FilterSidebar from "./components/filter-sidebar"
import QuickFilters from "./components/quick-filters"
import PageHeader from "./components/page-header"
import StatusAlerts from "./components/status-alerts"
import LoadingSkeleton from "./components/loading-skeleton"
import { useTutorJobsLogic } from "./hooks/useTutorJobsLogic"

export default function BrowseRequestsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BrowseRequestsContent />
    </Suspense>
  )
}

function BrowseRequestsContent() {
  const router = useRouter()
  
  // Use our custom hook for all the logic
  const {
    // State
    requests,
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
    isLoading,
    error,
    searchQuery,
    sortBy,
    isFilterSidebarOpen,
    filterOptions,
    isFilterOptionsLoading,
    activeQuickFilters,
    isApplyingFilters,
    filters,
    requestStats,
    hasResults,
    isJobSupportMode,
    
    // Handlers
    handlePageChange,
    handleFiltersChange,
    handleSearchChange,
    handleSortChange,
    handleClearAllFilters,
    handleQuickFilter,
    handleRefresh,
    setIsFilterSidebarOpen
  } = useTutorJobsLogic()

  // Enhanced search bar props
  const searchBarProps = {
    searchQuery,
    sortBy,
    isJobSupportMode,
    isApplyingFilters,
    requestStats,
    filters,
    activeQuickFilters,
    filterOptions,
    isFilterOptionsLoading,
    filteredRequests: requests,
    onSearchChange: handleSearchChange,
    onSortChange: handleSortChange,
    onJobSupportToggle: () => {
      if (!isJobSupportMode) {
        router.push('/tutor-jobs?filter=job-support')
      } else {
        router.push('/tutor-jobs')
      }
    },
    onClearAllFilters: handleClearAllFilters,
    onFiltersChange: handleFiltersChange,
    router
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header with Search */}
      <PageHeader 
        isJobSupportMode={isJobSupportMode}
        searchBarProps={searchBarProps}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Status Alerts */}
        <StatusAlerts
          isJobSupportMode={isJobSupportMode}
          error={error}
          onRefresh={handleRefresh}
          onViewAllJobs={() => router.push('/tutor-jobs')}
        />

        {/* Quick Filters */}
        <QuickFilters
          onFilterSelect={handleQuickFilter}
          activeFilters={activeQuickFilters}
        />

        {/* Main Content Layout */}
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Suspense fallback={<LoadingSkeleton />}>
              <RequestBrowser
                requests={requests}
                totalItems={totalItems}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                isLoading={isLoading}
                onPageChange={handlePageChange}
              />
            </Suspense>
          </div>

          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              isOpen={true}
              onClose={() => setIsFilterSidebarOpen(false)}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearAll={handleClearAllFilters}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
