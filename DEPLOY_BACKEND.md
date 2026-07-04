# Deploying the FastAPI Backend

This guide explains how to deploy the FastAPI backend to a service that supports large Python dependencies and Docker containers, such as **Render** or **Railway**.

---

## 1. Prerequisites
Before deploying, make sure you have:
1. A **Google Gemini API Key** (from Google AI Studio).
2. The backend repository uploaded to GitHub.
3. The newly added [backend/Dockerfile](file:///c:/Users/haris/OneDrive/Desktop/Hackathons/GENAI%20APAC%2026/Cyber-Threat-Intelligence/backend/Dockerfile) included in your codebase. Using a Docker deployment guarantees that all binary ML libraries (`xgboost`, `scikit-learn`, `pandas`) install cleanly without platform version conflicts.

---

## 2. Option A: Deploy on Render (Recommended)
Render is a cloud platform that makes it very simple to deploy containerized web services.

### Steps:
1. Log in to **[Render.com](https://render.com/)**.
2. Click **New** > **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name**: `cyber-threat-intelligence-backend`
   - **Region**: Select closest to your users
   - **Language**: `Docker` (Render will automatically detect the `Dockerfile` inside `backend/` if configured correctly, or you can point to it)
   - **Branch**: `main` (or your active branch)
   - **Root Directory**: `backend` (This is **CRITICAL** so Render runs the build from the `backend/` folder)
5. Select a Plan (the **Free** tier works, but may take a minute to spin up from cold starts; a paid tier is recommended for production).
6. Click **Advanced** and add the following **Environment Variables**:
   - `GEMINI_API_KEY`: `your_actual_gemini_api_key`
   - `CORS_ORIGINS`: `https://your-frontend-vercel-app.vercel.app,http://localhost:5173` (This allows your Vercel frontend to fetch data)
   - `PORT`: `8000` (Render will automatically map its external port to this)
7. Click **Create Web Service**.

---

## 3. Option B: Deploy on Railway
Railway is another developer-focused platform that builds and hosts Docker images automatically.

### Steps:
1. Log in to **[Railway.app](https://railway.app/)**.
2. Click **New Project** > **Deploy from GitHub repo**.
3. Choose your repository.
4. Click **Variables** and add:
   - `GEMINI_API_KEY`: `your_actual_gemini_api_key`
   - `CORS_ORIGINS`: `https://your-frontend-vercel-app.vercel.app,http://localhost:5173`
   - `PORT`: `8000`
5. Click **Settings** and scroll to the **Build** section:
   - Set **Builder** to `Docker`
   - Set **Docker file path** to `backend/Dockerfile`
6. Railway will automatically build and assign a public domain to your backend. You can copy the generated domain and use it in your Vercel frontend config.

---

## 4. Testing Your Deployment
Once deployed, check if your backend is working:
- Access your backend URL at the root: `https://your-backend-url.com/`
  - It should respond with: `{"status": "running", "project": "SentinelAI"}`
- Access the interactive documentation: `https://your-backend-url.com/docs`
  - This should render the Swagger UI correctly.
- Test the health diagnostics: `https://your-backend-url.com/health`
  - This will diagnostic check if ML models are loaded and if Gemini API is active.
