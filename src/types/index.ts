export interface StockData {
  lastPrice: number;
  variation: number;
  openGap: number;
  high: number;
  low: number;
}

export interface Broker {
  name: string;
  volume: number;
}

export interface MarketData {
  stocks: Record<string, StockData>;
  topBuyers: Broker[];
  topSellers: Broker[];
}

export interface ChartDataPoint {
  name: string;
  rate: number;
  maxVar: number;
  minVar: number;
}

export interface MultiLineChartData {
  name: string;
  estrangeiros: number;
  bancos: number;
  preco: number;
}

export interface CircularProgress {
  buyPercentage: number;
  sellPercentage: number;
  instrument: string;
}
