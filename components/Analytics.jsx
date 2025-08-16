"use client"

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Google Analytics 4 - Main component that uses useSearchParams
function GoogleAnalyticsContent({ GA_MEASUREMENT_ID }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    // Load GA script
    const script1 = document.createElement('script')
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script1.async = true
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
    `
    document.head.appendChild(script2)

    return () => {
      if (document.head.contains(script1)) document.head.removeChild(script1)
      if (document.head.contains(script2)) document.head.removeChild(script2)
    }
  }, [GA_MEASUREMENT_ID])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    // Track page views
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
        page_title: document.title,
      })
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID])

  return null
}

// Wrapper component with Suspense boundary
export function GoogleAnalytics({ GA_MEASUREMENT_ID }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />
    </Suspense>
  )
}

// Microsoft Clarity
export function MicrosoftClarity({ CLARITY_PROJECT_ID }) {
  useEffect(() => {
    if (!CLARITY_PROJECT_ID) return

    const script = document.createElement('script')
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
    `
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [CLARITY_PROJECT_ID])

  return null
}

// Custom event tracking
export function trackEvent(eventName, parameters = {}) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, {
      custom_parameter_1: parameters.category || 'engagement',
      custom_parameter_2: parameters.label || '',
      value: parameters.value || 1,
      ...parameters
    })
  }

  // Also track with Facebook Pixel if available
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', eventName, parameters)
  }
}

// Track specific user actions for SEO insights
export function useAnalytics() {
  const trackTutorSearch = (searchTerm, resultsCount) => {
    trackEvent('search', {
      search_term: searchTerm,
      content_category: 'tutor_search',
      value: resultsCount
    })
  }

  const trackTutorContact = (tutorId, subject) => {
    trackEvent('contact_tutor', {
      content_category: 'tutor_interaction',
      tutor_id: tutorId,
      subject: subject
    })
  }

  const trackRequestSubmission = (subjects, requestType) => {
    trackEvent('submit_request', {
      content_category: 'student_request',
      subjects: subjects.join(','),
      request_type: requestType
    })
  }

  const trackPageEngagement = (timeSpent, scrollDepth) => {
    trackEvent('page_engagement', {
      content_category: 'user_behavior',
      engagement_time_msec: timeSpent,
      scroll_depth: scrollDepth
    })
  }

  return {
    trackTutorSearch,
    trackTutorContact, 
    trackRequestSubmission,
    trackPageEngagement
  }
}

// Page performance tracking
export function usePerformanceTracking() {
  useEffect(() => {
    // Track Core Web Vitals
    if ('web-vital' in window) return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          trackEvent('web_vitals', {
            metric_name: 'LCP',
            metric_value: Math.round(entry.startTime),
            content_category: 'performance'
          })
        }
        
        if (entry.entryType === 'first-input') {
          trackEvent('web_vitals', {
            metric_name: 'FID', 
            metric_value: Math.round(entry.processingStart - entry.startTime),
            content_category: 'performance'
          })
        }
      }
    })

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })

    // Track Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
    })

    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Send CLS when page is hidden
    const sendCLS = () => {
      trackEvent('web_vitals', {
        metric_name: 'CLS',
        metric_value: Math.round(clsValue * 1000),
        content_category: 'performance'
      })
    }

    window.addEventListener('beforeunload', sendCLS)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendCLS()
      }
    })

    return () => {
      observer.disconnect()
      clsObserver.disconnect()
      window.removeEventListener('beforeunload', sendCLS)
    }
  }, [])
}
