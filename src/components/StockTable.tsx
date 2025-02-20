interface StockTableProps {
  data: { symbol: string; variation: number }[];
}

const StockTable = ({ data }: StockTableProps) => {
  return (
    <div className="grid grid-cols-10 gap-2 mb-4">
      {data.map((stock) => (
        <div key={stock.symbol} className="text-center">
          <div className="text-trading-text font-mono text-xl mb-0.5">{stock.symbol}</div>
          <div className={`text-lg font-bold font-mono ${stock.variation >= 0 ? 'text-trading-green' : 'text-trading-red'}`}>
            {stock.variation >= 0 ? '+' : ''}{stock.variation.toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockTable;
