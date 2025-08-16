export async function generateMetadata({ params }) {
  const subjectSlug = params.subject
  
  const subjectMapping = {
    'mathematics': 'Mathematics',
    'physics': 'Physics', 
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    'english': 'English',
    'computer-science': 'Computer Science',
    'programming': 'Programming',
    'python': 'Python',
    'javascript': 'JavaScript',
    'react': 'React',
    'nodejs': 'Node.js',
    'neet': 'NEET',
    'jee': 'JEE',
    'cbse': 'CBSE',
    'icse': 'ICSE',
  }

  const subjectName = subjectMapping[subjectSlug]
  
  if (!subjectName) {
    return {
      title: 'Subject Not Found | FindGuru',
      description: 'The requested subject page was not found.',
    }
  }

  const subjectSEO = {
    'mathematics': {
      title: `Best Mathematics Tutors Online | Expert Math Teachers | FindGuru`,
      description: `Find top-rated mathematics tutors online. Expert help in algebra, calculus, geometry, statistics. ✅ IIT/NIT graduates ✅ JEE/NEET prep ✅ CBSE/ICSE boards. Book now!`,
      keywords: 'mathematics tutors, math teachers online, algebra help, calculus tutoring, geometry tutor, statistics help, IIT JEE maths, NEET mathematics',
    },
    'physics': {
      title: `Top Physics Tutors for JEE & NEET | Expert Physics Teachers | FindGuru`,
      description: `Master physics with expert tutors. Mechanics, thermodynamics, electromagnetism made easy. ✅ JEE/NEET specialists ✅ Board exam prep ✅ 24/7 support. Start today!`,
      keywords: 'physics tutors, JEE physics, NEET physics, mechanics tutor, thermodynamics help, electromagnetism, physics board exam',
    },
    'chemistry': {
      title: `Best Chemistry Tutors Online | Organic, Inorganic & Physical Chemistry | FindGuru`,
      description: `Learn chemistry from experienced tutors. Organic, inorganic, physical chemistry made simple. ✅ JEE/NEET experts ✅ Lab techniques ✅ Board exams. Book now!`,
      keywords: 'chemistry tutors, organic chemistry help, inorganic chemistry tutor, physical chemistry, JEE chemistry, NEET chemistry prep',
    },
    'programming': {
      title: `Learn Programming from Expert Developers | Python, Java, Web Dev | FindGuru`,
      description: `Master coding with industry professionals. Python, Java, C++, web development, data structures. ✅ Interview prep ✅ Project guidance ✅ Career support. Start coding!`,
      keywords: 'programming tutors, coding bootcamp, Python tutor, Java programming, web development, data structures, coding interview prep',
    },
    // Add more subjects
  }

  const seoData = subjectSEO[subjectSlug] || {
    title: `${subjectName} Tutors Online | Expert ${subjectName} Teachers | FindGuru`,
    description: `Find the best ${subjectName} tutors online. Expert teachers, verified profiles, affordable rates. Book your first lesson today!`,
    keywords: `${subjectName.toLowerCase()} tutors, ${subjectName.toLowerCase()} teachers online, ${subjectName.toLowerCase()} help`
  }

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      images: [`/og-${subjectSlug}.jpg`],
      url: `https://findguru.com/tutors/${subjectSlug}`,
    },
    twitter: {
      title: seoData.title,
      description: seoData.description,
      images: [`/twitter-${subjectSlug}.jpg`],
    },
    alternates: {
      canonical: `https://findguru.com/tutors/${subjectSlug}`,
    },
  }
}

export async function generateStaticParams() {
  // Generate static pages for popular subjects
  return [
    { subject: 'mathematics' },
    { subject: 'physics' },
    { subject: 'chemistry' },
    { subject: 'biology' },
    { subject: 'english' },
    { subject: 'computer-science' },
    { subject: 'programming' },
    { subject: 'python' },
    { subject: 'javascript' },
    { subject: 'react' },
    { subject: 'nodejs' },
    { subject: 'neet' },
    { subject: 'jee' },
    { subject: 'cbse' },
    { subject: 'icse' },
  ]
}
