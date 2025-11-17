// client/src/App.jsx
import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import Chart from 'react-apexcharts';
import styles from './App.module.css'; 

// --- Chart Configuration (No changes) ---
const lineChartOptions = {
  chart: { type: 'line', height: 350, zoom: { enabled: true } },
  title: { text: 'Financial Data from BigQuery', align: 'left' },
  xaxis: { type: 'datetime' },
  tooltip: { x: { format: 'dd MMM yyyy HH:mm' } }
};

// --- Currency Lookup Dictionary (This is what you will edit) ---
const currencyLookup = {
  'eur-usd': 'Euro / US Dollar',
  'usd-jpy': 'US Dollar / Japanese Yen',
  'gbp-usd': 'British Pound / US Dollar',
  'usd-chf': 'US Dollar / Swiss Franc',
  'aud-usd': 'Australian Dollar / US Dollar',
  'usd-cad': 'US Dollar / Canadian Dollar',
  'nzd-usd': 'New Zealand Dollar / US Dollar',
  'eur-gbp': 'Euro / British Pound',
  'eur-jpy': 'Euro / Japanese Yen',
  'gbp-jpy': 'British Pound / Japanese Yen',
  'btc-usd': 'Bitcoin / US Dollar',
  'eth-usd': 'Ethereum / US Dollar',
  'sol-usd': 'Solana / US Dollar',
  'xrp-usd': 'Ripple / US Dollar',
  'doge-usd': 'Dogecoin / US Dollar',
  'ada-usd': 'Cardano / US Dollar',
  'avax-usd': 'Avalanche / US Dollar',
  'link-usd': 'Chainlink / US Dollar',
  'xau-usd': 'Gold / US Dollar',
  'xag-usd': 'Silver / US Dollar',
  'usd': 'US Dollar',
  'eur': 'Euro',
  'jpy': 'Japanese Yen',
  'gbp': 'British Pound',
  'chf': 'Swiss Franc',
  'aud': 'Australian Dollar',
  'cad': 'Canadian Dollar',
  'nzd': 'New Zealand Dollar',
  'cny': 'Chinese Yuan',
  'hkd': 'Hong Kong Dollar',
  'sgd': 'Singapore Dollar',
  'inr': 'Indian Rupee',
  'mxn': 'Mexican Peso',
  'zar': 'South African Rand',
  'rub': 'Russian Ruble',
  'btc': 'Bitcoin',
  'eth': 'Ethereum',
  'sol': 'Solana',
  'xrp': 'Ripple',
  'doge': 'Dogecoin',
  'ada': 'Cardano',
  'avax': 'Avalanche',
  'link': 'Chainlink',
  'dot': 'Polkadot',
  'matic': 'Polygon',
  'ltc': 'Litecoin',
  'bch': 'Bitcoin Cash',
  'xau': 'Gold',
  'xag': 'Silver',
  
  // *** ADD YOUR MISSING SYMBOLS HERE ***
  // e.g., if you see "brl" in the console, add:
  // 'brl': 'Brazilian Real', 
};

// --- Helper function (No changes) ---
const getFullCurrencyName = (slug) => {
  // *** THIS IS THE DEBUGGING LINE ***
  console.log("Looking up slug:", slug);
  
  if (typeof slug !== 'string' || !slug) return 'Unknown';
  
  const cleanSlug = slug.toLowerCase().trim();

  if (currencyLookup[cleanSlug]) {
    return currencyLookup[cleanSlug];
  }
  let parts = cleanSlug.split('-');
  if (parts.length === 2) {
    const c1 = currencyLookup[parts[0]] || parts[0].toUpperCase();
    const c2 = currencyLookup[parts[1]] || parts[1].toUpperCase();
    return `${c1} / ${c2}`;
  }
  parts = cleanSlug.split('/');
  if (parts.length === 2) {
    const c1 = currencyLookup[parts[0]] || parts[0].toUpperCase();
    const c2 = currencyLookup[parts[1]] || parts[1].toUpperCase();
    return `${c1} / ${c2}`;
  }
  if (cleanSlug.length === 6) {
    const c1_code = cleanSlug.substring(0, 3);
    const c2_code = cleanSlug.substring(3, 6);
    const c1 = currencyLookup[c1_code] || c1_code.toUpperCase();
    const c2 = currencyLookup[c2_code] || c2_code.toUpperCase();
    return `${c1} / ${c2}`;
  }
  return slug.toUpperCase();
};


function App() {
  // --- State Variables ---
  const [symbol, setSymbol] = useState('');
  const [userQuery, setUserQuery] = useState('What is the forecast for this symbol?');
  const [advice, setAdvice] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schema, setSchema] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: '',
    x: 0,
    y: 0
  });

  // --- Fetch metadata on page load ---
  useEffect(() => {
    axios.get('/api/schema')
      .then(response => {
        setSchema(response.data);
      })
      .catch(err => console.error("Failed to fetch schema", err));
    axios.get('/api/symbols')
      .then(response => {
        setSymbols(response.data); 
      })
      .catch(err => console.error("Failed to fetch symbols", err));
  }, []); // Runs once on load

  // --- Data Fetching Function ---
  const fetchData = async (symbol, query) => {
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    setChartData([]);
    try {
      const adviceResponse = await axios.post('/api/trade-advice', { symbol, userQuery });
      setAdvice(adviceResponse.data.advice);
      const chartResponse = await axios.get('/api/chart-data', { params: { symbol } });
      const transformedData = chartResponse.data.map(item => ({
        x: new Date(item.date.value).getTime(), 
        y: item.close
      }));
      setChartData(transformedData);
    } catch (error) {
      const errorMsg = error.response ? error.response.data.details : error.message;
      setError(`API Request FAILED: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Form Submit Handler ---
  const handleSubmit = (event) => {
    event.preventDefault(); 
    if (!symbol) {
        setError("Please enter a symbol (e.g., 'eur-usd').");
        return;
    }
    fetchData(symbol, userQuery);
  };
  
  // --- Symbol Click Handler ---
  const handleSymbolClick = (clickedSymbol) => {
    setSymbol(clickedSymbol);
  };

  // --- Tooltip Event Handlers ---
  const handleSymbolMouseEnter = (event, slug) => {
    const fullName = getFullCurrencyName(slug); 
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      content: fullName,
      x: rect.right + 15, 
      y: rect.top + (rect.height / 2)
    });
  };

  const handleSymbolMouseLeave = () => {
    setTooltip({ visible: false, content: '', x: 0, y: 0 });
  };

  // --- Render Logic ---
  const renderResults = () => {
    if (isLoading) {
      return <p className={styles.loadingText}>Loading AI advice and Chart Data...</p>;
    }
    if (error) {
      return <p className={styles.errorText}>{error}</p>;
    }
    if (advice && chartData.length > 0) {
      const signalClass = advice.signal === 'LONG' ? styles.signalLong : styles.signalShort;
      return (
        <>
          <div className={styles.card}>
            <h2>AI Trading Signal</h2>
            <p><span className={`${styles.signal} ${signalClass}`}>{advice.signal}</span></p>
            <h3>Rationale:</h3>
            <p className={styles.rationale}>{advice.rationale || "No rationale provided."}</p>
          </div>
          <div className={styles.card}>
            <h2>Data for: {symbol}</h2>
            <Chart options={lineChartOptions} series={[{ name: 'Price', data: chartData }]} type="line" height={350} />
          </div>
        </>
      );
    }
    return null; // Render nothing on initial load
  };

  // --- Main App Return ---
  return (
    <div>
      {/* --- Floating Tooltip --- */}
      {tooltip.visible && (
        <div 
          className={styles.tooltip} 
          style={{ top: `${tooltip.y}px`, left: `${tooltip.x}px` }}
        >
          {tooltip.content}
        </div>
      )}

      {/* --- Navigation Bar --- */}
      <nav className={styles.navbar}>
        <div className={styles.brand}>
          ⚡ Pulse AI 
        </div>
        <ul className={styles.navLinks}>
          <li><a href="#" className={styles.active}>Dashboard</a></li>
          <li><a href="#">Data Explorer</a></li>
          <li><a href="#">Alerts</a></li>
          <li><a href="#">Profile</a></li>
        </ul>
      </nav>

      {/* --- Main Dashboard Grid --- */}
      <div className={styles.dashboardContainer}>
        
        {/* --- Left Column: Control Panel --- */}
        <div className={styles.controlPanel}>
          {/* Card 1: The Form */}
          <div className={styles.card}>
            <h2>New Analysis</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="symbol">Symbol (e.g., eur-usd):</label>
                <input type="text" id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="query">Your Prompt:</label>
                <textarea id="query" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />
              </div>
              <button type="submit" disabled={isLoading} className={styles.submitButton}>
                {isLoading ? 'Loading...' : 'Get AI Advice'}
              </button>
            </form>
          </div>

          {/* Card 2: Available Symbols */}
          <div className={styles.card}>
            <h2>Available Symbols</h2>
            <div className={styles.symbolList}>
              <ul className={styles.dataList}>
                {symbols.length > 0 ? (
                  // Map over the array of strings
                  symbols.map(slug => (
                    <li 
                      key={slug} 
                      className={`${styles.dataListItem} ${styles.clickableSymbol}`}
                      onClick={() => handleSymbolClick(slug)} 
                      onMouseEnter={(e) => handleSymbolMouseEnter(e, slug)} // Pass the slug
                      onMouseLeave={handleSymbolMouseLeave}
                    >
                      {slug} {/* Display the slug */}
                    </li>
                  ))
                ) : (
                  <p>Loading symbols...</p>
                )}
              </ul>
            </div>
          </div>

          {/* Card 3: Dataset Columns */}
          <div className={styles.card}>
            <h2>Dataset Columns</h2>
            <ul className={styles.dataList}>
              {schema.length > 0 ? (
                schema.map(col => <li key={col} className={styles.dataListItem}>{col}</li>)
              ) : (
                <p>Loading schema...</p>
              )}
            </ul>
          </div>
        </div>

        {/* --- Right Column: Main Content --- */}
        <div className={styles.mainContent}>
          {renderResults()}
        </div>

      </div>
    </div>
  );
}

export default App;