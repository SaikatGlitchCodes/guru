"use client"
import { Suspense, useEffect, useState } from "react"
import RequestBrowser from "./components/request-browser"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export default function BrowseRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      const { data, error } = await supabase
        .from('requests')
        .select(
          'description, gender_preference, created_at, get_tutors_from, i_need_someone, language, level, nature, offline_meeting, online_meeting, price_amount, price_currency, price_currency_symbol, price_option, status, travel_meeting, tutors_want, type, updated_at, subjects (*), address:addresses (*)'
        )
        .order('created_at', { ascending: false });
      console.log('Fetched requests:', data);
      if (error) throw error;
      
      setRequests(data);
      localStorage.setItem('requestsCache', JSON.stringify({
        data,
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
    fetchRequests(true);
  }, []);

  return (
    <div className="min-h-screen pb-15 bg-gray-50">
      <div className="container mx-auto">
          {/* <Button 
            onClick={() => fetchRequests(true)} 
            variant="outline" 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button> */}
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <RequestBrowser initialRequests={requests} />
        </Suspense>
      </div>
    </div>
  )
}