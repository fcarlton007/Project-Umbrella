# ☂️ Project: Umbrella - AI Financial Forecasting Platform

![Project Umbrella Banner Placeholder](./images/Project%20Umbrella%20Architecture%20Model.png)

## ✨ Overview & Value Proposition

**Project: Umbrella** is an advanced, **MERN**-stack-powered financial intelligence platform designed to provide real-time, actionable trading insights. It securely leverages **Google Cloud's Big Data (BigQuery)** and **Generative AI (Vertex AI/Gemini)** capabilities to predict market movements.

### Key Features:
* ✅ **Full Stack MERN:** Highly responsive, scalable web dashboard.
* 📈 **Real-Time Forecasting:** Provides trade predictions for **Foreign Exchange (FX)** and **E-currency (Crypto)** using proprietary ML models.
* 🧠 **Gemini Advisory:** Uses **Vertex AI** to ground the Gemini LLM with prediction data, generating clear, natural-language **strategic advice** and rationales.
* 📊 **Visualization:** Displays complex time-series data, technical indicators, and forecasts in intuitive charts.
* 🔒 **Cloud Native:** Built for enterprise scale and security using Google Cloud Services.

---

## 💻 Tech Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend (R)** | **React** | Interactive dashboard, prompt interface, and visualization rendering. |
| **Backend (E/N)** | **Express.js / Node.js** | Secure API gateway, handles user requests, and orchestrates calls to Google Cloud. |
| **Database (M)** | **MongoDB** | Fast caching for recent AI advice, user profiles, and session management. |
| **Big Data** | **Google Cloud BigQuery** | Petabyte-scale data ingestion and storage for all historical FX and Crypto data. |
| **AI/ML** | **Vertex AI, Gemini** | Hosts custom ML models and provides LLM endpoints for advisory generation. |

---

## 🚀 Getting Started

Follow these steps to deploy a local development environment.

### 1. Prerequisites

Ensure you have the following installed:
* Node.js (LTS version)
* npm or yarn
* MongoDB (running locally or a connection string for Atlas)
* **Google Cloud CLI** configured and authenticated (`gcloud auth application-default login`)

### 2. Deployment

```bash
# 1. Clone the repository
git clone [https://github.com/your-username/bigquery-trade-predictor.git](https://github.com/your-username/bigquery-trade-predictor.git)
cd bigquery-trade-predictor

# 2. Install dependencies (server and client)
npm install # in the root directory
cd client && npm install

# 3. Setup Environment Variables
# Create a .env file in the root directory and add:
# NODE_ENV=development
# MONGODB_URI=your_mongo_connection_string
# GCLOUD_PROJECT_ID=umbrella-finance-ai 
# GCLOUD_SA_KEY_PATH=/path/to/your/service_account_key.json