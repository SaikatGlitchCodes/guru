# Setup Guide for Mentoring Platform

## 🚀 Quick Start

### 1. Environment Variables Setup

The navbar is not showing because Supabase environment variables are missing. You need to:

1. **Copy the example environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Get your Supabase credentials:**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Create a new project or open your existing one
   - Go to Settings → API
   - Copy the "Project URL" and "anon public" key

3. **Edit `.env.local` file:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 2. Database Setup

Your Supabase database needs to be set up with the proper schema:

1. **Run the migration:**
   ```bash
   npx supabase db push
   ```

2. **Or manually create tables** using the SQL files in `supabase/migrations/`

### 3. Test User Authentication

Once environment variables are set:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Check the console** for debug messages showing:
   - ✅ Supabase URL: Set
   - ✅ Supabase Key: Set
   - 👤 User authentication status

### 4. Create a Test User

To test the navbar:

1. Navigate to any page that triggers authentication
2. Use the magic link sign-in with your email
3. Check that the navbar appears after successful authentication

## 🐛 Debugging

### Current Issue: Navbar Not Showing

**Root Cause:** Missing Supabase environment variables
- `user` and `profile` are null because Supabase client can't connect
- The `DebugAuth` component (bottom-right corner) will show current state

**Solution:** Set up `.env.local` file as described above

### Debug Tools Available

1. **Console Logs:** Check browser console for detailed authentication flow
2. **Debug Widget:** Bottom-right corner shows current user/profile state
3. **Network Tab:** Check if Supabase requests are being made

## 📝 Next Steps

After fixing environment variables:

1. ✅ Test user authentication
2. ✅ Verify navbar appears
3. ✅ Test profile page functionality
4. ✅ Set up Stripe environment variables for payments
5. ✅ Deploy and configure production environment

## 🔗 Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Project Documentation](./README.md)
