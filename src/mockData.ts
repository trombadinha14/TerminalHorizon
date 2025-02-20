import { MarketData, ChartDataPoint, MultiLineChartData } from './types';

export const mockMarketData: MarketData = {
  stocks: {
    "WDOFUT": {
      lastPrice: 5781.50,
      variation: 0.03,
      openGap: -5.0,
      high: 5814.00,
      low: 5770.50
    },
    "PETR4": {
      lastPrice: 35.82,
      variation: 1.25,
      openGap: 0.5,
      high: 36.10,
      low: 35.44
    }
  },
  topBuyers: [
    { name: "Morgan", volume: 22220 },
    { name: "Goldman", volume: 18419 },
    { name: "XP", volume: 13011 },
    { name: "Citigroup", volume: 7388 },
    { name: "BGC", volume: 5434 }
  ],
  topSellers: [
    { name: "Genial", volume: -19816 },
    { name: "UBS", volume: -13540 },
    { name: "Agora", volume: -11660 },
    { name: "BTG", volume: -6866 },
    { name: "Tullett", volume: -6248 }
  ]
};

export const mockInterestRateData: ChartDataPoint[] = [
  { name: "DI26", rate: 0.5, maxVar: 0.8, minVar: 0.2 },
  { name: "DI27", rate: 1.2, maxVar: 1.5, minVar: 0.9 },
  { name: "DI28", rate: 0.8, maxVar: 1.1, minVar: 0.5 },
  { name: "DI29", rate: -0.3, maxVar: 0.1, minVar: -0.5 },
  { name: "DI30", rate: -0.7, maxVar: -0.4, minVar: -1.0 },
  { name: "DI31", rate: 0.2, maxVar: 0.5, minVar: -0.1 },
  { name: "DI32", rate: 0.9, maxVar: 1.2, minVar: 0.6 },
  { name: "DI33", rate: 1.5, maxVar: 1.8, minVar: 1.2 },
  { name: "DI34", rate: 1.2, maxVar: 1.6, minVar: 0.9 },
  { name: "DI35", rate: 0.8, maxVar: 1.1, minVar: 0.5 }
];

export const mockVolumeData1: MultiLineChartData[] = [
  { name: "09:00", estrangeiros: 0.5, bancos: 0.3, preco: 0.4 },
  { name: "10:00", estrangeiros: 1.2, bancos: 0.8, preco: 1.0 },
  { name: "11:00", estrangeiros: 0.8, bancos: 1.1, preco: 0.9 },
  { name: "12:00", estrangeiros: -0.3, bancos: -0.5, preco: -0.4 },
  { name: "13:00", estrangeiros: -0.7, bancos: -0.4, preco: -0.6 },
  { name: "14:00", estrangeiros: 0.2, bancos: 0.4, preco: 0.3 },
  { name: "15:00", estrangeiros: 0.9, bancos: 0.7, preco: 0.8 },
  { name: "16:00", estrangeiros: 1.5, bancos: 1.2, preco: 1.3 }
];

export const mockVolumeData2: MultiLineChartData[] = [
  { name: "09:00", estrangeiros: 0.3, bancos: 0.5, preco: 0.4 },
  { name: "10:00", estrangeiros: 0.8, bancos: 1.2, preco: 1.0 },
  { name: "11:00", estrangeiros: 1.1, bancos: 0.8, preco: 0.9 },
  { name: "12:00", estrangeiros: -0.5, bancos: -0.3, preco: -0.4 },
  { name: "13:00", estrangeiros: -0.4, bancos: -0.7, preco: -0.6 },
  { name: "14:00", estrangeiros: 0.4, bancos: 0.2, preco: 0.3 },
  { name: "15:00", estrangeiros: 0.7, bancos: 0.9, preco: 0.8 },
  { name: "16:00", estrangeiros: 1.2, bancos: 1.5, preco: 1.3 }
];

export const mockTopStocks = [
  { symbol: "VALE3", variation: 1.23 },
  { symbol: "PETR4", variation: -0.45 },
  { symbol: "ITUB4", variation: 0.78 },
  { symbol: "PETR3", variation: -0.32 },
  { symbol: "BBDC4", variation: 1.56 },
  { symbol: "B3SA3", variation: -0.89 },
  { symbol: "ELET3", variation: 2.34 },
  { symbol: "BBAS3", variation: 0.67 },
  { symbol: "ABEV3", variation: -1.23 },
  { symbol: "WEGE3", variation: 1.45 }
];

export const mockStockChartData: ChartDataPoint[] = [
  { name: "VALE3", rate: 1.23, maxVar: 1.5, minVar: 1.0 },
  { name: "PETR4", rate: -0.45, maxVar: -0.2, minVar: -0.7 },
  { name: "ITUB4", rate: 0.78, maxVar: 1.0, minVar: 0.5 },
  { name: "PETR3", rate: -0.32, maxVar: -0.1, minVar: -0.5 },
  { name: "BBDC4", rate: 1.56, maxVar: 1.8, minVar: 1.3 },
  { name: "B3SA3", rate: -0.89, maxVar: -0.6, minVar: -1.1 },
  { name: "ELET3", rate: 2.34, maxVar: 2.6, minVar: 2.1 },
  { name: "BBAS3", rate: 0.67, maxVar: 0.9, minVar: 0.4 },
  { name: "ABEV3", rate: -1.23, maxVar: -1.0, minVar: -1.5 },
  { name: "WEGE3", rate: 1.45, maxVar: 1.7, minVar: 1.2 }
];