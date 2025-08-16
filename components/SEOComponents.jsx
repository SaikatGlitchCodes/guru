"use client"

import { useEffect } from 'react'
import Head from 'next/head'

export function SEOOptimizer({ 
  title, 
  description, 
  keywords,
  canonicalUrl,
  structuredData,
  openGraph = {},
  twitter = {},
  noindex = false,
  nofollow = false 
}) {
  
  useEffect(() => {
    // Update meta tags dynamically
    if (title) {
      document.title = title
    }

    // Update meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.name = 'description'
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = description
    }

    // Update keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.name = 'keywords'
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.content = keywords
    }

    // Update canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = canonicalUrl
    }

    // Update robots meta
    const robotsContent = []
    if (noindex) robotsContent.push('noindex')
    else robotsContent.push('index')
    
    if (nofollow) robotsContent.push('nofollow')
    else robotsContent.push('follow')

    let robotsMeta = document.querySelector('meta[name="robots"]')
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta')
      robotsMeta.name = 'robots'
      document.head.appendChild(robotsMeta)
    }
    robotsMeta.content = robotsContent.join(', ')

    // Add structured data
    if (structuredData) {
      const existingLD = document.querySelector('script[type="application/ld+json"]')
      if (existingLD) {
        existingLD.remove()
      }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }

  }, [title, description, keywords, canonicalUrl, structuredData, noindex, nofollow])

  return null
}

// Breadcrumb component with structured data
export function SEOBreadcrumbs({ items = [] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.href ? `https://findguru.com${item.href}` : undefined
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
        <ol className="flex items-center space-x-2" itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, index) => (
            <li key={index} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              {index > 0 && <span className="mx-2">/</span>}
              {item.href ? (
                <a 
                  href={item.href}
                  className="hover:text-blue-600 transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.name}</span>
                </a>
              ) : (
                <span className="text-gray-900 font-medium" itemProp="name">
                  {item.name}
                </span>
              )}
              <meta itemProp="position" content={index + 1} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

// FAQ component with structured data
export function SEOFAQSection({ faqs = [] }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6" itemScope itemType="https://schema.org/Question">
              <h3 className="text-lg font-semibold mb-3" itemProp="name">
                {faq.question}
              </h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p className="text-gray-700" itemProp="text">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

// Article component with structured data
export function SEOArticle({ 
  title, 
  author, 
  datePublished, 
  dateModified,
  description,
  image,
  articleBody,
  category,
  tags = []
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "description": description,
    "image": image,
    "articleBody": articleBody,
    "articleSection": category,
    "keywords": tags.join(", "),
    "publisher": {
      "@type": "Organization",
      "name": "FindGuru",
      "logo": {
        "@type": "ImageObject",
        "url": "https://findguru.com/logo.png"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
