// express-server/routes/trade_routes.js

const express = require('express');
const router = express.Router();

// 1. Import the service functions
const { 
    getLatestFeaturesForPrediction, 
    getTradePrediction, 
    getGeminiAdvice,
    getTableSchema,
    getAvailableSymbols
} = require('../services/gcp_service'); 

// 2. GET /api/schema
router.get('/schema', async (req, res) => {
  try {
    const schema = await getTableSchema();
    res.status(200).json(schema);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch schema", details: error.message });
  }
});

// 3. GET /api/symbols
router.get('/symbols', async (req, res) => {
  try {
    const symbols = await getAvailableSymbols();
    res.status(200).json(symbols);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch symbols", details: error.message });
  }
});

// 4. POST /api/trade-advice
router.post('/trade-advice', async (req, res) => {
    const { symbol, userQuery } = req.body;

    if (!symbol || !userQuery) {
        return res.status(400).json({ error: "Missing 'symbol' or 'userQuery' in request body." });
    }

    try {
        const featureInstances = await getLatestFeaturesForPrediction(symbol);

        if (featureInstances.length === 0) {
            return res.status(404).json({ error: "No recent data found in BigQuery for this symbol." });
        }

        // Bypassing custom model for now
        // const predictionResult = await getTradePrediction(featureInstances);
        
        // Sending BigQuery data directly to Gemini
        const adviceContent = await getGeminiAdvice(featureInstances, userQuery);

        const cleanedAdvice = adviceContent.replace(/```json/g, '').replace(/```/g, '');

        res.status(200).json({
            status: 'success',
            symbol: symbol,
            advice: JSON.parse(cleanedAdvice)
        });

    } catch (error) {
        console.error(`Error processing trade advice for ${symbol}:`, error.message);
        res.status(500).json({ 
            error: "Internal server error during prediction/advice generation.",
            details: error.message 
        });
    }
});

module.exports = router;