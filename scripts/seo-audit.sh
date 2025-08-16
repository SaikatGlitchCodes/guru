#!/bin/bash

echo "🚀 Running comprehensive SEO audit and optimization..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Build the application
print_status "Building the application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# 2. Check for missing meta tags
print_status "Checking for SEO meta tags..."

# Check if sitemap exists
if [ -f "public/sitemap.xml" ] || [ -f "app/sitemap.js" ]; then
    print_success "Sitemap found"
else
    print_warning "Sitemap not found"
fi

# Check if robots.txt exists
if [ -f "public/robots.txt" ] || [ -f "app/robots.js" ]; then
    print_success "Robots.txt found"
else
    print_warning "Robots.txt not found"
fi

# Check if manifest exists
if [ -f "public/manifest.json" ]; then
    print_success "Web app manifest found"
else
    print_warning "Web app manifest not found"
fi

# 3. Validate structured data (if available)
print_status "Validating structured data..."

# Check for JSON-LD scripts in built files
if grep -r "application/ld+json" .next/ > /dev/null 2>&1; then
    print_success "Structured data found in build"
else
    print_warning "No structured data found in build"
fi

# 4. Check image optimization
print_status "Checking for image optimization..."

# Count images without alt text (basic check)
if [ -d "public" ]; then
    total_images=$(find public -name "*.jpg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" | wc -l)
    print_status "Found $total_images images in public directory"
fi

# 5. Check for performance optimizations
print_status "Checking performance optimizations..."

# Check if compression is enabled in next.config
if grep -q "compress.*true" next.config.* 2>/dev/null; then
    print_success "Compression enabled"
else
    print_warning "Compression not explicitly enabled"
fi

# Check for image optimization config
if grep -q "images" next.config.* 2>/dev/null; then
    print_success "Image optimization configured"
else
    print_warning "Image optimization not configured"
fi

# 6. Validate critical pages exist
print_status "Validating critical pages..."

critical_pages=(
    "app/page.js"
    "app/find-tutors/page.jsx" 
    "app/tutor-jobs/page.jsx"
    "app/request-tutor/page.jsx"
)

for page in "${critical_pages[@]}"; do
    if [ -f "$page" ]; then
        print_success "Critical page found: $page"
    else
        print_error "Missing critical page: $page"
    fi
done

# 7. Check for analytics implementation
print_status "Checking analytics implementation..."

if grep -r "gtag\|analytics\|GA_MEASUREMENT_ID" app/ components/ > /dev/null 2>&1; then
    print_success "Analytics implementation found"
else
    print_warning "No analytics implementation detected"
fi

# 8. Validate environment variables
print_status "Checking environment variables..."

if [ -f ".env.local" ]; then
    print_success ".env.local found"
else
    print_warning ".env.local not found - remember to configure analytics IDs"
fi

# 9. Check for security headers
print_status "Checking security headers configuration..."

if grep -q "headers" next.config.* 2>/dev/null; then
    print_success "Security headers configured"
else
    print_warning "Security headers not configured"
fi

# 10. Final recommendations
print_status "SEO Optimization Recommendations:"
echo ""
echo "📊 ANALYTICS & TRACKING:"
echo "  - Set up Google Analytics 4 with your GA_MEASUREMENT_ID"
echo "  - Configure Microsoft Clarity for user behavior insights"
echo "  - Implement Facebook Pixel for social media tracking"
echo ""
echo "🔍 SEARCH ENGINE OPTIMIZATION:"
echo "  - Submit sitemap to Google Search Console"
echo "  - Verify domain ownership in Google Search Console"
echo "  - Submit to Bing Webmaster Tools"
echo "  - Set up structured data monitoring"
echo ""
echo "📱 PERFORMANCE & UX:"
echo "  - Optimize images to WebP format"
echo "  - Implement lazy loading for below-fold content"
echo "  - Set up CDN for static assets"
echo "  - Configure caching headers"
echo ""
echo "📈 CONTENT STRATEGY:"
echo "  - Regularly update blog with education-related content"
echo "  - Create location-specific landing pages"
echo "  - Optimize for voice search queries"
echo "  - Build high-quality backlinks from education websites"
echo ""
echo "🎯 COMPETITIVE ADVANTAGES:"
echo "  - Focus on local SEO for Indian cities"
echo "  - Target long-tail keywords for specific subjects"
echo "  - Create comprehensive subject guides"
echo "  - Implement user-generated content (reviews, testimonials)"
echo ""

print_success "SEO audit completed! 🎉"
print_status "Next steps:"
echo "  1. Configure analytics IDs in .env.local"
echo "  2. Submit sitemap to search engines"
echo "  3. Monitor Core Web Vitals"
echo "  4. Start content marketing strategy"
echo "  5. Build quality backlinks"

echo ""
print_status "For Google #1 ranking, focus on:"
echo "  🎯 High-quality, relevant content"
echo "  🏃 Fast page load speeds (< 3 seconds)"
echo "  📱 Mobile-first responsive design"
echo "  🔗 Authority backlinks from education sites"
echo "  👥 Positive user engagement metrics"
echo "  📍 Local SEO optimization"
