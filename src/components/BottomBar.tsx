import CircularProgress from './CircularProgress';

const BottomBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-trading-panel/90 backdrop-blur-sm border-t border-trading-border/20">
      <div className="flex justify-between items-center h-full px-4">
        <div className="flex items-center space-x-8">
          <CircularProgress
            buyPercentage={82}
            sellPercentage={18}
            instrument="WDO"
          />
          <div className="text-trading-text">
            <div className="text-sm">Volume Total</div>
            <div className="text-lg font-bold">127.4K</div>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <div className="text-trading-text text-right">
            <div className="text-sm">Último Negócio</div>
            <div className="text-lg font-bold">5781.50</div>
          </div>
          <CircularProgress
            buyPercentage={65}
            sellPercentage={35}
            instrument="WIN"
          />
        </div>
      </div>
    </div>
  );
};

export default BottomBar;