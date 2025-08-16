import { getAllSubjects } from '@/lib/supabaseAPI'

export default async function sitemap() {
  const baseUrl = 'https://toptutor.com'
  
  // Static pages with high priority
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/find-tutors`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tutor-jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/request-tutor`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/job-support`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/callback`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  try {
    // Dynamic pages for subjects
    const subjectsResult = await getAllSubjects()
    const subjects = subjectsResult.data || []
    
    const subjectPages = subjects.map((subject) => ({
      url: `${baseUrl}/find-tutors?subjects=${encodeURIComponent(subject)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }))

    // SEO landing pages for popular subjects
    const popularSubjects = [
      'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
      'Computer Science', 'Programming', 'NEET', 'JEE', 'CBSE',
      'ICSE', 'Python', 'JavaScript', 'React', 'Node.js'
    ]
    
    const seoPages = popularSubjects.map((subject) => ({
      url: `${baseUrl}/tutors/${subject.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    return [
      ...staticPages,
      ...subjectPages,
      ...seoPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
