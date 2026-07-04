# Cyber Threat Intelligence Dashboard

This project includes a React frontend and a FastAPI backend. The Vercel deployment setup below serves the frontend from the Vite build and routes API requests to the backend via /api.

## Vercel deployment

1. Push this repository to GitHub.
2. In Vercel, import the repository.
3. Vercel will use the provided vercel.json configuration automatically.
4. Set these environment variables in Vercel:
   - VITE_API_URL=/api
   - GEMINI_API_KEY=your_key_here
   - CORS_ORIGINS=https://your-app.vercel.app

## Local development

- Frontend: npm install && npm run dev
- Backend: cd backend && pip install -r requirements.txt && uvicorn app:app --reload

The frontend will call the backend at /api during Vercel deployments and at http://127.0.0.1:8000 locally unless VITE_API_URL is overridden.
