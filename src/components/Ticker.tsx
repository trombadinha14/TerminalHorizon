import { useState } from 'react'
import { ReactTicker } from '@guna81/react-ticker'
import { Activity } from 'lucide-react'

interface TickerItem {
  symbol: string
  variation: string
  price: string
}

const leftTickerData: TickerItem[] = [
  { symbol: 'USD/EUR', variation: '+0.55%', price: '1.1025' },
  { symbol: 'USD/GBP', variation: '-0.23%', price: '0.8650' },
  { symbol: 'USD/JPY', variation: '+0.12%', price: '147.35' },
  { symbol: 'USD/CAD', variation: '-0.08%', price: '1.3520' },
  { symbol: 'USD/JPN', variation: '+0.12%', price: '147.35' },
  { symbol: 'USD/CNH', variation: '+0.05%', price: '7.2580' },
  { symbol: 'USD/HDK', variation: '+0.01%', price: '7.8210' },
  { symbol: 'USD/MXN', variation: '-0.32%', price: '17.1500' },
  { symbol: 'DOLPT',   variation: '+0.18%', price: '5.05' },
  { symbol: 'DXY',     variation: '+0.25%', price: '103.20' },
  { symbol: 'OURO',    variation: '-0.45%', price: '1980.50' },
  { symbol: 'S&P 500', variation: '+0.15%', price: '4500.25' },
  { symbol: 'Dow Jones', variation: '+0.08%', price: '34850.75' },
  { symbol: 'Nasdaq 100', variation: '+0.22%', price: '15500.90' },
  { symbol: 'Russell', variation: '+0.12%', price: '1850.60' },
  { symbol: 'S&P VIX', variation: '-0.50%', price: '14.80' },
  { symbol: 'BTC/USD', variation: '+1.20%', price: '27500.30' },
  { symbol: 'BRENT',   variation: '-0.85%', price: '85.20' },
  { symbol: 'WTI',     variation: '-0.92%', price: '80.15' },
]

const rightTickerData: TickerItem[] = [
  { symbol: 'VALE3',  variation: '-1,93%', price: '66,91' },
  { symbol: 'VGIP11', variation: '-1,20%', price: '91,19' },
  { symbol: 'VIIA3',  variation: '+1,83%', price: '3,33'  },
  { symbol: 'VSLH11', variation: '+0,09%', price: '0,00'  },
  { symbol: 'ABEV3',  variation: '-0,38%', price: '15,61' },
  { symbol: 'B3SA3',  variation: '-0,72%', price: '12,34' },
  { symbol: 'BBAS3',  variation: '+2,07%', price: '42,45' },
  { symbol: 'BBDC4',  variation: '+0,36%', price: '19,51' },
  { symbol: 'BRAP4',  variation: '+1,04%', price: '29,20' },
  { symbol: 'CVCB3',  variation: '+2,62%', price: '8,22'  },
  { symbol: 'DOLFUT', variation: '-0,72%', price: '5.033,50' },
  { symbol: 'ECOR3',  variation: '+0,33%', price: '6,09'  },
  { symbol: 'EMBR3',  variation: '-0,96%', price: '14,38' },
  { symbol: 'HCTR11', variation: '-0,31%', price: '106,66' },
  { symbol: 'IBOV',   variation: '+0,02%', price: '23,12' },
  { symbol: 'ITSA4',  variation: '-0,64%', price: '9,29'  },
  { symbol: 'ITUB4',  variation: '-0,34%', price: '26,60' },
  { symbol: 'MGLU3',  variation: '-1,31%', price: '4,52'  },
  { symbol: 'NUBR33', variation: '0,00%',  price: '4,14'  },
  { symbol: 'AGRO3',  variation: '+1,04%', price: '29,20' },
]

// Detecta se a variação é positiva
function isUp(variation: string) {
  return variation.trim().startsWith('+')
}

// Renderiza cada item do ticker
function renderTickerItem(item: TickerItem) {
  const up = isUp(item.variation)
  const arrow = up ? (
    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-green-500" />
  ) : (
    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-red-500" />
  )

  return (
    <div className="flex flex-col items-center px-8 min-w-[70px] text-xs font-semibold">
      <div className="flex items-center space-x-1">
        {arrow}
        {/* Quadradinho "ícone" placeholder */}
        <div className="w-3 h-3 bg-gray-300" />
        <span className="text-white text-base">{item.symbol}</span>
      </div>
      <div className="flex items-center space-x-1 text-sm">
        <span className={up ? 'text-green-400' : 'text-red-400'}>
          {item.variation}
        </span>
        <span className="text-white">{item.price}</span>
      </div>
    </div>
  )
}

export default function TickerComponent() {
  const [isExpandedLeft, setIsExpandedLeft] = useState(false)
  const [isExpandedRight, setIsExpandedRight] = useState(false)

  return (
    <div className="w-full">
      {/** BARRA SUPERIOR (Horizon Quant) - fixa no topo */}
      <div 
        className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md flex items-center justify-center z-20"
      >
        <Activity size={32} className="text-trading-accent mr-3" />
        <h1 className="text-white text-2xl font-bold">Horizon Quant</h1>
      </div>

      {/** BARRA DO TICKER (logo abaixo da barra superior), fixa também */}
      <div 
        className="fixed top-16 left-0 right-0 bg-black/10 backdrop-blur-md z-10 overflow-visible"
      >
        {/** Linha que contém os 2 tickers e as gavetas */}
        <div className="flex w-full items-center justify-center relative">
          
          {/** LADO ESQUERDO (ticker + gaveta) */}
          <div 
            className="flex-1 relative h-12 flex items-center"
            onMouseEnter={() => setIsExpandedLeft(true)}
            onMouseLeave={() => setIsExpandedLeft(false)}
          >
            {/** Container do ticker (fade in/out) */}
            <div
              className={`
                absolute inset-0 flex items-center 
                transition-opacity duration-700
                ${isExpandedLeft ? 'opacity-0' : 'opacity-100'}
              `}
              style={{ pointerEvents: 'none' }}
            >
              <ReactTicker
                data={leftTickerData}
                speed={5000}
                loop
                component={renderTickerItem}
              />
            </div>

            {/** Texto "MERCADO INTERNACIONAL" (fade in/out) */}
            <div
              className={`
                absolute inset-0 flex items-center justify-center
                transition-opacity duration-700
                ${isExpandedLeft ? 'opacity-100' : 'opacity-0'}
              `}
              style={{ pointerEvents: 'none' }}
            >
              <span className="text-white text-xl font-bold">
                MERCADO INTERNACIONAL
              </span>
            </div>

            {/** GAVETA (mais escura que o ticker) */}
            <div
              className={`absolute left-0 top-full w-full 
                          bg-black/90 border-b border-trading-border/20
                          overflow-hidden
                          transition-all duration-700
                          ${isExpandedLeft ? 'h-[54rem]' : 'h-0'}
                        `}
            >
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-trading-green"></div>
                    <span className="text-trading-text text-sm">Mercado Aberto</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-trading-accent"></div>
                    <span className="text-trading-text text-sm">Conexão Ativa</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-trading-red"></div>
                    <span className="text-trading-text text-sm">Alta Volatilidade</span>
                  </div>
                  <p className="text-trading-text text-sm">
                    Aqui você pode colocar outras informações, 
                    gráficos pequenos, etc.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/** SEPARADOR AO CENTRO */}
          <div className="w-[1px] mx-4 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-400 h-6 self-center" />

          {/** LADO DIREITO (ticker + gaveta) */}
          <div 
            className="flex-1 relative h-12 flex items-center"
            onMouseEnter={() => setIsExpandedRight(true)}
            onMouseLeave={() => setIsExpandedRight(false)}
          >
            {/** Ticker do lado direito (fade in/out) */}
            <div
              className={`
                absolute inset-0 flex items-center 
                transition-opacity duration-700
                ${isExpandedRight ? 'opacity-0' : 'opacity-100'}
              `}
              style={{ pointerEvents: 'none' }}
            >
              <ReactTicker
                data={rightTickerData}
                speed={5000}
                loop
                component={renderTickerItem}
              />
            </div>

            {/** Texto "MERCADO NACIONAL" (fade in/out) */}
            <div
              className={`
                absolute inset-0 flex items-center justify-center
                transition-opacity duration-700
                ${isExpandedRight ? 'opacity-100' : 'opacity-0'}
              `}
              style={{ pointerEvents: 'none' }}
            >
              <span className="text-white text-xl font-bold">
                MERCADO NACIONAL
              </span>
            </div>

            {/** Gaveta (também mais escura que o ticker) */}
            <div
              className={`absolute left-0 top-full w-full 
                          bg-black/90 border-b border-trading-border/20
                          overflow-hidden
                          transition-all duration-700
                          ${isExpandedRight ? 'h-[54rem]' : 'h-0'}
                        `}
            >
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-trading-green"></div>
                    <span className="text-trading-text text-sm">Mercado Aberto</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-trading-accent"></div>
                    <span className="text-trading-text text-sm">Conexão Ativa</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-trading-red"></div>
                    <span className="text-trading-text text-sm">Alta Volatilidade</span>
                  </div>
                  <p className="text-trading-text text-sm">
                    E aqui outro conteúdo, 
                    dados de mercado ou o que você quiser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/** CONTEÚDO PRINCIPAL (exemplo simples, sem bloco gigante) */}
      <div className="mt-[10rem] p-8 text-white">
        <h2 className="text-xl mb-4">Conteúdo Principal</h2>
        <p>
          As barras superiores (Horizon Quant e Ticker) estão fixas. 
          Passe o mouse no ticker da esquerda ou da direita para abrir a gaveta.
        </p>
      </div>
    </div>
  )
}
