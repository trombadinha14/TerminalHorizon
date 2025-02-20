import { Broker } from '../types';

interface BrokerRankingProps {
  buyers: Broker[];
  sellers: Broker[];
}

const BrokerRanking = ({ buyers, sellers }: BrokerRankingProps) => {
  return (
    <div className="bg-trading-panel/40 backdrop-blur-lg rounded-lg p-2 border-trading-border/20">
      <h2 className="text-xl font-bold mb-4 text-trading-text text-center">
        Ranking de Corretoras
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-trading-green">
            Maiores Compradores
          </h3>
          {buyers.map((broker, index) => (
            <div
              key={`buyer-${index}`}
              className="flex justify-between items-center mb-2"
            >
              <span className="text-trading-muted">{broker.name}</span>
              <span className="text-trading-green">
                +{broker.volume.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2 text-trading-red">
            Maiores Vendedores
          </h3>
          {sellers.map((broker, index) => (
            <div
              key={`seller-${index}`}
              className="flex justify-between items-center mb-2"
            >
              <span className="text-trading-muted">{broker.name}</span>
              <span className="text-trading-red">
                +{broker.volume.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrokerRanking;
