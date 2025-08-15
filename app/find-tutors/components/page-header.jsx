import ThemedHero from "@/components/ThemedHero"
import EnhancedSearchBar from "./enhanced-search-bar"

export default function PageHeader({
  searchBarProps
}) {
  return (
    <ThemedHero>
      <div className="container mx-auto px-4 relative z-20">
        {/* Title Section */}
        <div className="text-center text-white mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-4 animate-fade-in">
            Find Your Perfect Tutor
          </h1>
        </div>

        {/* Enhanced Search Bar */}
        <EnhancedSearchBar {...searchBarProps} />
      </div>
    </ThemedHero>
  )
}
