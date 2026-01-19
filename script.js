// Balance chart
const balanceCtx = document.getElementById('balanceChart').getContext('2d');
let balanceHistory = [12345.67]; // Start with current balance
const balanceChart = new Chart(balanceCtx, {
    type: 'line',
    data: {
        labels: Array.from({length: 20}, (_, i) => i.toString()),
        datasets: [{
            data: balanceHistory,
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            borderWidth: 2,
            fill: true,
            pointRadius: 0,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            }
        },
        elements: {
            point: {
                radius: 0
            }
        }
    }
});

// Balance fluctuation variables
let currentBalance = 12345.67;
let initialBalance = 12345.67;
let last24HBalance = 12345.67;
let currentTimeFrame = '24H'; // Default time frame
let updateIntervals = {
    '1H': 2000,   // Update every 2 seconds for 1H
    '24H': 7000,  // Update every 7 seconds for 24H
    '1W': 15000,  // Update every 15 seconds for 1W
    '1M': 30000,  // Update every 30 seconds for 1M
    '1Y': 60000   // Update every 60 seconds for 1Y
};
let balanceUpdateInterval;

// Function to update balance with random fluctuation
function updateBalance() {
    // Random change between -2% and +2%
    const randomChangePercent = (Math.random() - 0.5) * 4; // -2 to +2
    const changeAmount = currentBalance * (randomChangePercent / 100);
    currentBalance += changeAmount;

    // Keep balance positive
    if (currentBalance < 0) currentBalance = 0;

    // Get max history length based on current time frame
    const maxHistoryLength = currentTimeFrame === '1H' ? 60 : currentTimeFrame === '24H' ? 24 : currentTimeFrame === '1W' ? 7 : currentTimeFrame === '1M' ? 30 : 12;

    // Add to history, keep last points based on time frame
    balanceHistory.push(currentBalance);
    if (balanceHistory.length > maxHistoryLength) {
        balanceHistory.shift();
    }

    // Update chart
    balanceChart.data.datasets[0].data = balanceHistory;
    balanceChart.update();

    // Update displayed balance
    const balanceAmountEl = document.querySelector('.balance-amount');
    balanceAmountEl.textContent = `$${currentBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Calculate change based on current time frame (simplified - in real app would track properly)
    const displayChangePercent = ((currentBalance - last24HBalance) / last24HBalance) * 100;
    const changeEl = document.querySelector('.change');
    changeEl.textContent = `${displayChangePercent >= 0 ? '+' : ''}${displayChangePercent.toFixed(2)}% (${currentTimeFrame})`;
    changeEl.style.color = displayChangePercent >= 0 ? '#4CAF50' : '#f44336';
}

// Time filter functionality
const filters = document.querySelectorAll('.filter');
filters.forEach(filter => {
    filter.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        // Update time frame and balance update interval
        const selectedTimeFrame = filter.textContent;
        currentTimeFrame = selectedTimeFrame;

        // Clear existing interval
        if (balanceUpdateInterval) {
            clearInterval(balanceUpdateInterval);
        }

        // Reset balance history for new time frame
        balanceHistory = [currentBalance];

        // Set new update interval
        balanceUpdateInterval = setInterval(updateBalance, updateIntervals[selectedTimeFrame]);

        // Update chart labels based on time frame
        const labelCount = selectedTimeFrame === '1H' ? 60 : selectedTimeFrame === '24H' ? 24 : selectedTimeFrame === '1W' ? 7 : selectedTimeFrame === '1M' ? 30 : 12;
        balanceChart.data.labels = Array.from({length: labelCount}, (_, i) => i.toString());
        balanceChart.update();

        console.log(`Switched to ${selectedTimeFrame} time frame`);
    });
});

// Bottom nav functionality
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        // Here you could navigate to different sections
        // For demo, just change active state
    });
});

// Mock data for faster loading (no API calls) - reduced to 6 coins
function getMockCryptoData() {
    console.log('Loading mock crypto data...');
    const mockData = [
        {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 45000,
            price_change_percentage_24h: 2.5,
            total_volume: 25000000000,
            market_cap: 850000000000,
            sparkline_in_7d: { price: [44000, 44500, 44200, 44800, 45100, 44900, 45000] }
        },
        {
            id: 'ethereum',
            symbol: 'eth',
            name: 'Ethereum',
            current_price: 2800,
            price_change_percentage_24h: -1.2,
            total_volume: 15000000000,
            market_cap: 330000000000,
            sparkline_in_7d: { price: [2850, 2820, 2800, 2780, 2810, 2790, 2800] }
        },
        {
            id: 'binancecoin',
            symbol: 'bnb',
            name: 'Binance Coin',
            current_price: 320,
            price_change_percentage_24h: 1.8,
            total_volume: 1200000000,
            market_cap: 48000000000,
            sparkline_in_7d: { price: [315, 318, 316, 322, 319, 321, 320] }
        },
        {
            id: 'solana',
            symbol: 'sol',
            name: 'Solana',
            current_price: 95,
            price_change_percentage_24h: 3.2,
            total_volume: 2500000000,
            market_cap: 38000000000,
            sparkline_in_7d: { price: [92, 94, 91, 96, 93, 97, 95] }
        },
        {
            id: 'cardano',
            symbol: 'ada',
            name: 'Cardano',
            current_price: 0.45,
            price_change_percentage_24h: -0.8,
            total_volume: 800000000,
            market_cap: 15000000000,
            sparkline_in_7d: { price: [0.46, 0.45, 0.44, 0.46, 0.45, 0.44, 0.45] }
        },
        {
            id: 'polkadot',
            symbol: 'dot',
            name: 'Polkadot',
            current_price: 8.50,
            price_change_percentage_24h: 1.5,
            total_volume: 500000000,
            market_cap: 8500000000,
            sparkline_in_7d: { price: [8.40, 8.45, 8.30, 8.60, 8.45, 8.55, 8.50] }
        }
    ];

    console.log('Mock data loaded:', mockData.length, 'coins');
    return Promise.resolve(mockData);
}

// Live data fetching from CoinGecko (now using mock data for speed)
async function fetchCoinGeckoData(retryCount = 0) {
    console.log('Fetching crypto data...');
    try {
        // Use mock data instead of API for faster loading
        const data = await getMockCryptoData();

        const cryptoList = document.getElementById('cryptoList');
        cryptoList.innerHTML = '';

        const charts = {};

        data.forEach((coin, index) => {
            const item = document.createElement('div');
            item.className = 'crypto-item';
            item.dataset.symbol = coin.id;
            item.innerHTML = `
                <div class="crypto-info">
                    <div class="crypto-logo">${coin.symbol.toUpperCase()}</div>
                    <div>
                        <h3>${coin.name}</h3>
                        <p>Loading...</p>
                    </div>
                </div>
                <div class="crypto-change">Loading...</div>
                ${index < 4 ? `<div class="mini-chart"><canvas id="${coin.symbol}Chart"></canvas></div>` : ''}
                <div class="market-data">
                    <p>Loading...</p>
                    <p>Loading...</p>
                </div>
            `;
            cryptoList.appendChild(item);

            // Initialize chart for first 4
            if (index < 4) {
                const ctx = document.getElementById(`${coin.symbol}Chart`).getContext('2d');
                charts[coin.id] = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['1', '2', '3', '4', '5', '6', '7'],
                        datasets: [{
                            data: [0, 0, 0, 0, 0, 0, 0],
                            borderColor: '#cccccc',
                            borderWidth: 2,
                            fill: false,
                            pointRadius: 0,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            x: {
                                display: false
                            },
                            y: {
                                display: false
                            }
                        },
                        elements: {
                            point: {
                                radius: 0
                            }
                        }
                    }
                });
            }
        });

        // Update data
        data.forEach(coin => {
            const item = document.querySelector(`[data-symbol="${coin.id}"]`);
            if (!item) {
                console.warn('Item not found for coin:', coin.id);
                return;
            }
            const priceEl = item.querySelector('.crypto-info p');
            const changeEl = item.querySelector('.crypto-change');
            const volEl = item.querySelector('.market-data p:first-child');
            const capEl = item.querySelector('.market-data p:last-child');

            const price = coin.current_price;
            const changePercent = coin.price_change_percentage_24h;

            priceEl.textContent = `$${price.toFixed(price < 1 ? 4 : 2)}`;
            changeEl.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
            changeEl.className = `crypto-change ${changePercent >= 0 ? 'positive' : 'negative'}`;

            const volume = coin.total_volume;
            volEl.textContent = `24h Vol: $${(volume / 1e9).toFixed(1)}B`;

            const marketCap = coin.market_cap;
            capEl.textContent = `Market Cap: $${(marketCap / 1e9).toFixed(0)}B`;

            // Update chart if exists
            if (charts[coin.id]) {
                const sparkline = coin.sparkline_in_7d.price.slice(-7);
                charts[coin.id].data.datasets[0].data = sparkline;
                charts[coin.id].data.datasets[0].borderColor = changePercent >= 0 ? '#4CAF50' : '#f44336';
                charts[coin.id].update();
            }
        });
        console.log('Update complete');
    } catch (error) {
        console.error('Error loading mock data:', error);
        if (retryCount < 3) {
            console.log(`Retrying in 5 seconds... (${retryCount + 1}/3)`);
            setTimeout(() => fetchCoinGeckoData(retryCount + 1), 5000);
        }
    }
}

// Initial fetch and set interval for live updates
fetchCoinGeckoData();
setInterval(fetchCoinGeckoData, 60000); // Update every 60 seconds to avoid rate limits

// Start balance fluctuation with default 24H interval
balanceUpdateInterval = setInterval(updateBalance, updateIntervals['24H']);
