import { CircularProgress as CircularProgressType } from '../types';

const CircularProgress = ({ buyPercentage, sellPercentage, instrument }: CircularProgressType) => {
  return (
    <div className="bg-trading-panel/80 backdrop-blur-xs border border-trading-border/20 rounded-lg p-4">
      <h2 className="text-trading-text font-medium text-sm mb-4">
        FLUXO DE MERCADO - {instrument}
      </h2>
      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-trading-border/20" />
          <div
            className="absolute inset-0 rounded-full border-4 border-trading-green"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
              transform: `rotate(${buyPercentage * 3.6}deg)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-trading-green text-xl font-bold">{buyPercentage}%</span>
            <span className="text-trading-red text-sm">{sellPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;