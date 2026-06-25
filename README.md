# VTU AI Solver

AI-powered VTU question paper solver. Students enter their branch, course name, and course code — the site generates a fully solved paper, module by module, in real time.

---

## Architecture

```
Browser (React + Vite)
    │
    └── POST /api/generate  ← Vercel Edge Function (your API key stays here, never exposed)
              │
              └── Anthropic API (claude-sonnet-4-6)
```

No database. No login. No uploads. Just AI.

---

## Deploy in ~10 minutes (all free)

### Step 1 — Get an Anthropic API key

1. Go to https://console.anthropic.com → sign up / log in
2. Go to **API Keys** → **Create Key** → copy it (you won't see it again)
3. Anthropic gives free credits to new accounts — enough to test

### Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "VTU AI Solver"
gh repo create vtu-ai-solver --public --source=. --push
```

Or create a repo on github.com manually and follow the "push existing repo" instructions.

### Step 3 — Deploy to Vercel

1. Go to https://vercel.com → sign up with GitHub → **Add New Project**
2. Import your `vtu-ai-solver` repo
3. Before deploying, open **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`  
   - Value: your key from Step 1
4. Click **Deploy** — you'll get a live URL in ~1 minute

That's it. Share the URL.

---

## Test locally

```bash
npm install
npm run dev
```

For local API calls to work, install Vercel CLI and run `vercel dev` instead of `npm run dev`.

Or for quick testing: temporarily put your API key in `.env` as `VITE_ANTHROPIC_API_KEY` and modify `api/generate.js` to read it — but never commit that file.

---

## Adding more course topics

Edit `src/lib/utils.js` → `getModuleTopics()`. Add an `if` block for any course keyword and return an array of 5 module topic strings. The AI will use those as context to generate better questions.

---

## How the API key security works

- The key is stored only in Vercel's environment — never in your frontend code
- The browser calls `/api/generate` (your own serverless function)
- That function makes the Anthropic call server-side with the secret key
- Students never see the key, can't extract it, can't abuse it beyond what your Vercel plan allows

