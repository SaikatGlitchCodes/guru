"use client"
import { Suspense, useEffect, useState } from "react"
import RequestBrowser from "./components/request-browser"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Search, Users, TrendingUp, Clock, DollarSign } from "lucide-react"
import { getOpenRequests } from "@/lib/supabaseAPI"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NewRequestBrowser from "./components/request-browser-new"

const CACHE_DURATION = 5 ;

export default function BrowseRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchRequests = async (skipCache = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check cache first unless skipCache is true
      if (!skipCache) {
        const cachedData = localStorage.getItem('requestsCache');
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const isCacheValid = Date.now() - timestamp < CACHE_DURATION;
          
          if (isCacheValid) {
            setRequests(data);
            setIsLoading(false);
            return;
          }
        }
      }
      
      // Fetch requests using the API function
      const result = await getOpenRequests({});
      console.log('Fetched requests:', result);  
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to fetch requests');
      }
      
      setRequests(result.data || []);
      localStorage.setItem('requestsCache', JSON.stringify({
        data: result.data || [],
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Fetching requests on component mount');
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black py-10 overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b black black z-10"></div>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(white 1px, transparent 1px),
                linear-gradient(90deg, white 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}
          ></div>
        </div>

        <style jsx>{`
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(40px, 40px); }
          }
        `}</style>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center text-white mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 animate-fade-in">
              Tutoring Opportunities
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 animate-fade-in-delay">
              Connect with students who need your expertise
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 animate-slide-up">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search by subject, location, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-high">Highest Price</SelectItem>
                    <SelectItem value="price-low">Lowest Price</SelectItem>
                    <SelectItem value="urgent">Most Urgent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                        <div className="flex gap-2 mb-4">
                          <div className="h-6 w-20 bg-gray-200 rounded"></div>
                          <div className="h-6 w-16 bg-gray-200 rounded"></div>
                          <div className="h-6 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <RequestBrowser 
            initialRequests={requests} 
            searchQuery={searchQuery}
            sortBy={sortBy}
          />
        </Suspense>
      </div>
    </div>
  )
}