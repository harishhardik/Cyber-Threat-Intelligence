# Deploying the React Frontend on Vercel

This guide explains how to deploy the React frontend on Vercel and configure it to connect to your hosted backend.

---

## 1. Why We Separate Frontend and Backend
Our FastAPI backend relies on heavy machine learning libraries (`xgboost`, `scikit-learn`, `pandas`, `numpy`) and a trained model file (`cyber_threat_model.pkl`). The total bundle size exceeds **800 MB**, which goes far beyond Vercel's **500 MB** serverless function limit. 

To resolve this, we:
1. **Deploy the React Frontend** to **Vercel** (lightweight, fast, global CDN).
2. **Deploy the FastAPI Backend** to a container-friendly host like **Render**, **Railway**, or **Hugging Face Spaces**.

---

## 2. Update Vercel Configuration
To stop Vercel from trying to build the Python environment (which fails), we need to update `vercel.json` to only build the static frontend.

Replace the contents of `vercel.json` with:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

> [!NOTE]
> Since we removed the backend build from Vercel, the build will complete successfully in seconds.

---

## 3. Deploy to Vercel Step-by-Step

1. **Commit and Push** the updated `vercel.json` to your GitHub repository.
2. Open the **[Vercel Dashboard](https://vercel.com/)** and click **Add New** > **Project**.
3. Select your GitHub repository and import it.
4. In the **Configure Project** step:
   - **Framework Preset**: Vite (automatically detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-api-url.onrender.com` (replace with your actual deployed backend URL, without a trailing slash)
6. Click **Deploy**.

---

## 4. Local Development Redirect (Optional)
If you want to run the frontend locally while connecting to your remote backend, you can create a `.env.local` file in the root directory:

```env
VITE_API_URL=https://your-backend-api-url.onrender.com
```
This will override the default `/api` local endpoint and point your local Vite frontend to the live remote API.
