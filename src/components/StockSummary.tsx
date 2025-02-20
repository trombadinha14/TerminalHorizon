import { StockData } from '../types';

interface StockSummaryProps {
  data: StockData;
  symbol: string;
}

const StockSummary = ({ data, symbol }: StockSummaryProps) => {
  const isPositive = data.variation >= 0;
  const range = data.high - data.low;
  const currentPosition = ((data.lastPrice - data.low) / range) * 100;
  const openPosition = ((data.lastPrice + data.openGap - data.low) / range) * 100;
  
  const fillColor = data.lastPrice > (data.lastPrice + data.openGap) ? 
    'bg-trading-green' : 'bg-trading-red';

  return (
    <div className="bg-trading-panel/40 backdrop-blur-lg rounded-lg p-2 border-trading-border/20">
      <h2 className="text-xl font-bold mb-2 text-trading-text font-mono">{symbol}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-trading-muted text-xs">Último Preço</p>
          <p className="text-2xl font-bold text-trading-text font-mono">
            {data.lastPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="text-trading-muted text-xs">Variação</p>
          <p className={`text-2xl font-bold font-mono ${isPositive ? 'text-trading-green' : 'text-trading-red'}`}>
            {isPositive ? '+' : ''}{data.variation.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-trading-muted text-xs">Máxima</p>
          <p className="text-sm text-trading-text font-mono">{data.high.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div>
          <p className="text-trading-muted text-xs">Mínima</p>
          <p className="text-sm text-trading-text font-mono">{data.low.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
      
      {/* Price Range Slider */}
      <div className="mt-4">
        <div className="price-slider">
          {/* Background fill from open to current */}
          <div 
            className={`price-slider-fill ${fillColor}`}
            style={{
              left: `${Math.min(openPosition, currentPosition)}%`,
              width: `${Math.abs(currentPosition - openPosition)}%`
            }}
          />
          
          {/* Current price marker */}
          <div 
            className="price-slider-marker"
            style={{ left: `${currentPosition}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-trading-muted mt-1 font-mono">
          <span>{data.low.toFixed(2)}</span>
          <span>{data.high.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default StockSummary;
