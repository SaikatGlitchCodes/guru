import { Badge } from "@/components/ui/badge"
import { Briefcase } from "lucide-react"
import ThemedHero from "@/components/ThemedHero"
import EnhancedSearchBar from "./enhanced-search-bar"

export default function PageHeader({
  isJobSupportMode,
  searchBarProps
}) {
  return (
    <ThemedHero>
      <div className="container mx-auto px-4 relative z-20">
        {/* Title Section */}
        <div className="text-center text-white mb-8">
          {isJobSupportMode ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Briefcase className="w-8 h-8" />
                <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
                  Job Support Mode
                </Badge>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold mb-4 animate-fade-in">
                Job Support & Career Mentoring Opportunities
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 animate-fade-in-delay">
                Help professionals advance their careers through specialized mentoring
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-4xl font-bold mb-4 animate-fade-in">
                Tutoring Opportunities
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 animate-fade-in-delay hidden md:block">
                Connect with students who need your expertise
              </p>
            </>
          )}
        </div>

        {/* Enhanced Search Bar */}
        <EnhancedSearchBar {...searchBarProps} />
      </div>
    </ThemedHero>
  )
}
