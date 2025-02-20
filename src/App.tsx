import { useState, useEffect } from 'react';
import SmoothChart from './components/SmoothChart';
import MultiLineChart from './components/MultiLineChart';
import BrokerRanking from './components/BrokerRanking';
import StockSummary from './components/StockSummary';
import StockTable from './components/StockTable';
import SideBar from './components/SideBar';
import BottomBar from './components/BottomBar';

// Imports de mocks (se ainda quiser usá-los para outras partes)
import {
  mockMarketData,
  mockInterestRateData,
  mockVolumeData1,
  mockVolumeData2,
  mockTopStocks,
} from './mockData';

// Importa o Ticker
import TickerComponent from './components/Ticker';

// Se você tem um type Broker definido
import { Broker } from './types';

function App() {
  // Estados para buyers e sellers (do ranking)
  const [buyers, setBuyers] = useState<Broker[]>([]);
  const [sellers, setSellers] = useState<Broker[]>([]);

  // Abre a conexão WebSocket ao montar
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000/ws');

    ws.onopen = () => {
      console.log('WebSocket conectado com sucesso!');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Agora data = { ranking: { buyers: [...], sellers: [...] }, cotacoes: [...] }

      // Se quiser conferir no console:
      console.log('Recebido via WS:', data);

      // Ajuste para acessar "ranking"
      if (data.ranking) {
        setBuyers(data.ranking.buyers || []);
        setSellers(data.ranking.sellers || []);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Ao desmontar, feche a conexão
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-trading-panel text-trading-text pb-20">
      <SideBar />

      {/* Barra superior + Duplo Ticker */}
      <TickerComponent />

      {/* Conteúdo principal da página */}
      <div className="max-w-1400px mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6 mt-4">
          {/* Left Column */}
          <div className="space-y-2">
            <div className="bg-trading-panel/40 backdrop-blur-lg rounded-lg p-2 border-trading-border/20 h-[500px]">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Curva de Juros
              </h2>
              <StockTable
                data={mockInterestRateData.map((d) => ({
                  symbol: d.name,
                  variation: d.rate,
                }))}
              />
              <SmoothChart />
            </div>

            {/* BrokerRanking usando buyers e sellers do WebSocket */}
            <BrokerRanking buyers={buyers} sellers={sellers} />

            <div className="bg-trading-panel/40 backdrop-blur-lg rounded-lg p-2 border-trading-border/20">
              <h2 className="text-xl font-bold mb-4 text-center">
                Volume por Hora
              </h2>
              <MultiLineChart data={mockVolumeData1} />
            </div>
          </div>

          {/* Center Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StockSummary
                data={mockMarketData.stocks.WDOFUT}
                symbol="WDOFUT"
              />
              <StockSummary
                data={mockMarketData.stocks.PETR4}
                symbol="PETR4"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StockSummary
                data={mockMarketData.stocks.WDOFUT}
                symbol="WINJ24"
              />
              <StockSummary
                data={mockMarketData.stocks.PETR4}
                symbol="DOLJ24"
              />
            </div>

            {/* Outro BrokerRanking, mesmo estado */}
            <BrokerRanking buyers={buyers} sellers={sellers} />

            <div className="bg-trading-panel/40 backdrop-blur-lg rounded-lg p-2 border-trading-border/20">
              <h2 className="text-xl font-bold mb-4">Volume por Hora</h2>
              <MultiLineChart data={mockVolumeData2} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-trading-panel/40 backdrop-blur-lg rounded-lg p-2 border-trading-border/20 h-[500px]">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Top 10 Ações
              </h2>
              <StockTable data={mockTopStocks} />
              <SmoothChart />
            </div>

            <BrokerRanking buyers={buyers} sellers={sellers} />

            <div className="bg-trading-panel/40 backdrop-blur-lg rounded-lg p-2 border-trading-border/20">
              <h2 className="text-xl font-bold mb-4">Volume por Hora</h2>
              <MultiLineChart data={mockVolumeData2} />
            </div>
          </div>
        </div>
      </div>

      <BottomBar />
    </div>
  );
}

export default App;
