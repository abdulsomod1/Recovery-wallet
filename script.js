// Balance chart
const balanceCtx = document.getElementById('balanceChart').getContext('2d');
const balanceChart = new Chart(balanceCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            data: [10000, 10500, 10200, 10800, 11500, 12346],
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

// Time filter functionality
const filters = document.querySelectorAll('.filter');
filters.forEach(filter => {
    filter.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        // Here you could update charts based on selected time frame
        // For demo, just change active state
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

// Live data fetching from CoinGecko
async function fetchCoinGeckoData(retryCount = 0) {
    console.log('Fetching CoinGecko data...');
    const ids = 'bitcoin,ethereum,binancecoin,cardano,solana,polkadot,chainlink,litecoin,bitcoin-cash,stellar,avalanche-2,chain-2,cosmos,algorand,vechain,tron,theta-token,filecoin,aave,maker,compound-governance-token,uniswap,sushi,pancakeswap-token,1inch,curve-dao-token,yearn-finance,synthetix-network-token,balancer,ren,loopring,kyber-network,bancor,0x,basic-attention-token,civic,golem,storj,maidsafecoin,iostoken,wax,zilliqa,icon,ontology,harmony,near,flow,internet-computer,hedera-hashgraph,elrond-erd-2,theta-fuel,ocean-protocol,skale,celer-network,ankr,fetch-ai,band-protocol';

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=true`);
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Data received:', data.length, 'coins');

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
        console.error('Error fetching data from CoinGecko:', error);
        if (retryCount < 3) {
            console.log(`Retrying in 5 seconds... (${retryCount + 1}/3)`);
            setTimeout(() => fetchCoinGeckoData(retryCount + 1), 5000);
        }
    }
}

// Initial fetch and set interval for live updates
fetchCoinGeckoData();
setInterval(fetchCoinGeckoData, 60000); // Update every 60 seconds to avoid rate limits
