import { useState } from 'react';

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

    return (
      <div
        className={`fixed left-0 top-0 h-full bg-trading-panel/90 backdrop-blur-sm border-r border-trading-border/20 transition-all duration-300 z-10 ${ 
          isExpanded ? 'w-[72rem]' : 'w-16'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-trading-green"></div>
            {isExpanded && <span className="text-trading-text text-sm">Mercado Aberto</span>}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-trading-accent"></div>
            {isExpanded && <span className="text-trading-text text-sm">Conexão Ativa</span>}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-trading-red"></div>
            {isExpanded && <span className="text-trading-text text-sm">Alta Volatilidade</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;