// Force dynamic rendering to fix useSearchParams issue
export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Education Blog | Study Tips, Exam Prep & Learning Resources | Toptutor",
  description: "Discover expert study tips, exam preparation strategies, and learning resources from top educators. Latest education trends, subject guides, and career advice for students.",
  keywords: "education blog, study tips, exam preparation, learning resources, NEET preparation, JEE tips, CBSE study guide, online learning",
  openGraph: {
    title: "Education Blog - Study Tips & Learning Resources | Toptutor",
    description: "Expert education advice, study tips, and learning resources from top educators.",
    images: ['/og-blog.jpg'],
    url: 'https://toptutor.com/blog',
  },
  alternates: {
    canonical: 'https://toptutor.com/blog',
  },
}

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Proven Study Techniques That Actually Work",
      excerpt: "Discover scientifically-backed study methods that can improve your learning efficiency by up to 300%. From spaced repetition to active recall.",
      author: "Dr. Sarah Kumar",
      date: "2025-01-15",
      category: "Study Tips",
      image: "/blog/study-techniques.jpg",
      slug: "proven-study-techniques-that-work",
      readTime: "8 min read"
    },
    {
      id: 2, 
      title: "NEET 2025: Complete Preparation Strategy",
      excerpt: "A comprehensive guide to crack NEET 2025. Subject-wise preparation tips, important topics, time management, and expert advice.",
      author: "Prof. Rajesh Sharma",
      date: "2025-01-10",
      category: "NEET",
      image: "/blog/neet-preparation.jpg",
      slug: "neet-2025-complete-preparation-strategy",
      readTime: "12 min read"
    },
    {
      id: 3,
      title: "JEE Main vs JEE Advanced: Key Differences Explained",
      excerpt: "Understanding the differences between JEE Main and JEE Advanced. Exam patterns, eligibility criteria, and preparation strategies.",
      author: "IIT Delhi Faculty",
      date: "2025-01-08",
      category: "JEE",
      image: "/blog/jee-main-advanced.jpg",
      slug: "jee-main-vs-jee-advanced-differences",
      readTime: "10 min read"
    },
    {
      id: 4,
      title: "How to Choose the Right Online Tutor",
      excerpt: "A complete guide to finding the perfect online tutor. What to look for, questions to ask, and red flags to avoid.",
      author: "TopTutor Team",
      date: "2025-01-05",
      category: "Online Learning",
      image: "/blog/choose-online-tutor.jpg",
      slug: "how-to-choose-right-online-tutor",
      readTime: "6 min read"
    },
    {
      id: 5,
      title: "CBSE Board Exam 2025: Last Minute Preparation Tips",
      excerpt: "Strategic tips for CBSE board exam preparation in the final weeks. Subject-wise strategies and stress management techniques.",
      author: "CBSE Expert Panel",
      date: "2025-01-03",
      category: "Board Exams",
      image: "/blog/cbse-board-tips.jpg",
      slug: "cbse-board-exam-last-minute-tips",
      readTime: "9 min read"
    },
    {
      id: 6,
      title: "Programming for Beginners: Where to Start",
      excerpt: "A beginner's roadmap to programming. Languages to start with, learning resources, and building your first project.",
      author: "Tech Guru",
      date: "2024-12-30",
      category: "Programming",
      image: "/blog/programming-beginners.jpg",
      slug: "programming-for-beginners-where-to-start",
      readTime: "11 min read"
    }
  ]

  const categories = ["All", "Study Tips", "NEET", "JEE", "Board Exams", "Online Learning", "Programming", "Career Guidance"]

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Toptutor Education Blog",
    "description": "Expert education advice, study tips, and learning resources",
    "url": "https://toptutor.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Toptutor",
      "logo": "https://toptutor.com/logo.png"
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "datePublished": post.date,
      "url": `https://toptutor.com/blog/${post.slug}`,
      "image": `https://toptutor.com${post.image}`
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Education Blog
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Expert study tips, exam strategies, and learning resources from top educators
              </p>
              
              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      index === 0 
                        ? 'bg-white text-blue-600' 
                        : 'bg-blue-500 text-white hover:bg-blue-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <div className="text-gray-400 text-4xl">📚</div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 line-clamp-2">
                      <a href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </a>
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm font-medium">{post.author}</div>
                          <div className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <a 
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Read More →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Load More Articles
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-blue-100 mb-8">Get the latest study tips and exam strategies delivered to your inbox</p>
            
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
