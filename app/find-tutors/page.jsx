"use client"

// Force dynamic rendering to fix useSearchParams issue
export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import TutorBrowser from "./components/tutor-browser"
import FilterSidebar from "./components/filter-sidebar"
import QuickFilters from "./components/quick-filters"
import PageHeader from "./components/page-header"
import LoadingSkeleton from "./components/loading-skeleton"
import { useFindTutorsLogic } from "./hooks/useFindTutorsLogic"

export default function FindTutorsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <FindTutorsContent />
    </Suspense>
  )
}

function FindTutorsContent() {
  const router = useRouter()
  
  // Use our custom hook for all the logic
  const {
    // State
    tutors,
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
    isLoading,
    error,
    searchQuery,
    sortBy,
    filters,
    filterOptions,
    isFilterOptionsLoading,
    activeQuickFilters,
    isApplyingFilters,
    tutorStats,
    hasResults,
    
    // Handlers
    handlePageChange,
    handleFiltersChange,
    handleSearchChange,
    handleSortChange,
    handleClearAllFilters,
    handleQuickFilter,
    handleRefresh
  } = useFindTutorsLogic()

  // Enhanced search bar props
  const searchBarProps = {
    searchQuery,
    sortBy,
    isApplyingFilters,
    tutorStats,
    filters,
    activeQuickFilters,
    filterOptions,
    isFilterOptionsLoading,
    filteredTutors: tutors,
    onSearchChange: handleSearchChange,
    onSortChange: handleSortChange,
    onClearAllFilters: handleClearAllFilters,
    onFiltersChange: handleFiltersChange,
    router
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header with Search */}
      <PageHeader searchBarProps={searchBarProps} />

      <div className="container mx-auto px-4 py-8">
        {/* Quick Filters */}
        <QuickFilters
          onFilterSelect={handleQuickFilter}
          activeFilters={activeQuickFilters}
        />

        {/* Main Content Layout */}
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}

            <Suspense fallback={<LoadingSkeleton />}>
              <TutorBrowser
                tutors={tutors}
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
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearAll={handleClearAllFilters}
              filterOptions={filterOptions}
              isLoading={isFilterOptionsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
