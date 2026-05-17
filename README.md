# Resume AI / Portfolio Builder

Welcome to the Resume AI project! This is a modern, interactive web application that helps you build a stunning 3D editorial-style resume and portfolio using AI.

Want to get your own resume up and running on the internet as fast as possible? Follow the simple steps below to launch directly to Vercel!

---

## 🚀 Quick Launch (Direct to Vercel)

The easiest way to get your own version of this website live is to deploy it directly using Vercel.

### Step 1: Get Your Keys Ready
Before deploying, you need to set up two free services:
1. **Supabase (Database & Login):**
   - Go to [Supabase](https://supabase.com/) and create a free project.
   - Go to the **SQL Editor**, open the `supabase_schema.sql` file from this code, and run it to set up your tables.
   - Go to **Project Settings > API** and copy your **Project URL** and **anon public key**.
2. **Google Gemini (AI Features):**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Create a free API key and copy it.

### Step 2: Upload to GitHub
1. Create a GitHub account if you don't have one.
2. Fork or upload this project code to your own GitHub repository.

### Step 3: Deploy to Vercel
1. Go to [Vercel](https://vercel.com/) and create an account (or log in with GitHub).
2. Click **"Add New..."** and select **"Project"**.
3. Import your newly created GitHub repository.
4. **Crucial Step:** Before clicking Deploy, open the **Environment Variables** section and add the keys you got from Step 1:
   - Name: `VITE_SUPABASE_URL` | Value: *(Your Supabase URL)*
   - Name: `VITE_SUPABASE_ANON_KEY` | Value: *(Your Supabase Anon Key)*
   - Name: `VITE_GEMINI_API_KEY` | Value: *(Your Gemini API Key)*
5. Click **Deploy**!

### Step 4: Create Your Resume!
Once Vercel finishes building (it takes about a minute), they will give you a live URL for your website. 
- Click on your new live website link.
- Enter your email to log in via a magic link.
- Start creating your awesome resume!

---

## 💻 Running it locally (For Developers)

If you want to edit the code on your computer, follow these steps:
1. Download the code and run `npm install`.
2. Create a `.env.local` file and add the three environment variables mentioned above.
3. Run `npm run dev` and open `http://localhost:5173` in your browser.
