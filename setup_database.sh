#!/bin/bash

# Mentoring Platform Database Setup Script

echo "🎓 Mentoring Platform Database Setup"
echo "==================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "Select setup option:"
echo "1) Fresh install (complete schema from scratch)"
echo "2) Add to existing database (tutors and additional tables only)"
echo "3) Reset and rebuild entire database"
echo ""

read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Setting up complete schema from scratch..."
        supabase migration new complete_schema
        echo "📁 Please copy the content from supabase/migrations/20250724000001_complete_schema.sql"
        echo "   to the newly created migration file, then run:"
        echo "   supabase db push"
        ;;
    2)
        echo "📦 Adding tutors and additional tables to existing database..."
        supabase migration new tutors_and_additional_tables
        echo "📁 Please copy the content from supabase/migrations/20250724000000_tutors_and_additional_tables.sql"
        echo "   to the newly created migration file, then run:"
        echo "   supabase db push"
        ;;
    3)
        echo "🔄 Resetting and rebuilding entire database..."
        echo "⚠️  WARNING: This will delete all existing data!"
        read -p "Are you sure? (y/N): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            supabase db reset
            echo "✅ Database reset complete"
        else
            echo "❌ Reset cancelled"
        fi
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📋 Next steps:"
echo "1. If using Supabase CLI locally:"
echo "   supabase db push    # Apply migrations automatically"
echo ""
echo "2. If using Supabase Dashboard:"
echo "   - Go to https://supabase.com/dashboard"
echo "   - Navigate to your project > SQL Editor"
echo "   - Copy/paste contents of your chosen migration file"
echo "   - Click 'Run' to execute"
echo ""
echo "3. Seed the database (optional):"
echo "   - Copy/paste contents of supabase/seed_data.sql"
echo "   - Click 'Run' to populate with sample data"
echo ""
echo "4. Update your .env.local file:"
echo "   NEXT_PUBLIC_SUPABASE_URL=your_project_url"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
echo ""
echo "5. Test your app: npm run dev"
echo ""
echo "🔗 Helpful commands:"
echo "   supabase start          # Start local development"
echo "   supabase status         # Check status"
echo "   supabase db push        # Apply migrations"
echo "   supabase db reset       # Reset database"
echo ""
echo "📖 See DATABASE_SCHEMA.md for detailed documentation"
echo "✅ The migration files now use correct PostgreSQL syntax!"
