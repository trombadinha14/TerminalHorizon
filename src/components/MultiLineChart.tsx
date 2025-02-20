import { curveCatmullRom, line } from "d3-shape";
import { scaleLinear, scaleBand } from "@visx/scale";
import { MultiLineChartData } from "../types";
import { useState } from "react";

interface MultiLineChartProps {
  data?: MultiLineChartData[];
  width?: number;
  height?: number;
}

interface TooltipData {
  x: number;
  y: number;
  data: MultiLineChartData;
}

const MultiLineChart = ({ 
  data = [], 
  width = 500, 
  height = 320 
}: MultiLineChartProps) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const margin = { top: 10, right: 20, bottom: 30, left: 40 };

  // Captura todos os valores para definir o domínio Y
  const allValues = data.flatMap(d => [d.estrangeiros, d.bancos, d.preco]);
  const minValue = Math.min(...allValues, 0);
  const maxValue = Math.max(...allValues, 0);
  const maxAbs = Math.max(Math.abs(minValue), Math.abs(maxValue));
  const marginFactor = maxAbs < 0.2 ? 0.5 : maxAbs * 0.2;

  const yMin = -(maxAbs + marginFactor);
  const yMax = maxAbs + marginFactor;

  // Escalas
  const xScale = scaleBand({
    domain: data.map((d) => d.name),
    range: [margin.left, width - margin.right],
    padding: 0.2,
  });

  const yScale = scaleLinear({
    domain: [yMin, yMax],
    range: [height - margin.bottom, margin.top],
  });

  // Função que cria geradores de linha com Catmull Rom
  const createLineGenerator = () =>
    line<MultiLineChartData>()
      .x((d) => xScale(d.name) ?? 0)
      .curve(curveCatmullRom.alpha(0.5)); // Ajuste o alpha conforme desejado

  const estrangeirosLine = createLineGenerator().y((d) => yScale(d.estrangeiros));
  const bancosLine       = createLineGenerator().y((d) => yScale(d.bancos));
  const precoLine        = createLineGenerator().y((d) => yScale(d.preco));

  // Tooltip
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - svgRect.left;
    
    const dataPoint = data.find((d) => {
      const x = xScale(d.name) ?? 0;
      return Math.abs(x - mouseX) < (xScale.bandwidth() / 2);
    });

    if (dataPoint) {
      setTooltip({
        x: xScale(dataPoint.name) ?? 0,
        y: yScale(dataPoint.estrangeiros),
        data: dataPoint,
      });
    } else {
      setTooltip(null);
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="relative bg-trading-panel bg-opacity-90 backdrop-blur-lg p-4 rounded-lg shadow-lg">
      {/* Legenda */}
      <div className="flex justify-end space-x-4 mb-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
          <span className="text-sm text-trading-text">Estrangeiros</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-trading-red mr-2" />
          <span className="text-sm text-trading-text">Bancos</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-trading-text mr-2" />
          <span className="text-sm text-trading-text">Preço</span>
        </div>
      </div>
      
      <svg
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-crosshair"
      >
        {/* Linha horizontal em y=0 */}
        <line
          x1={margin.left}
          x2={width - margin.right}
          y1={yScale(0)}
          y2={yScale(0)}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={1}
          strokeDasharray="3"
        />

        {/* Linhas para Estrangeiros, Bancos e Preço */}
        <path
          d={estrangeirosLine(data) || ""}
          stroke="rgb(59, 130, 246)"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={bancosLine(data) || ""}
          stroke="rgb(210, 136, 111)"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={precoLine(data) || ""}
          stroke="rgb(240, 240, 235)"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />

        {/* Tooltip */}
        {tooltip && (
          <g>
            {/* Linhas de referência (vertical e horizontal) */}
            <line
              x1={tooltip.x}
              x2={tooltip.x}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={tooltip.y}
              y2={tooltip.y}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
            {/* Caixa do tooltip */}
            <rect
              x={tooltip.x + 10}
              y={tooltip.y - 60}
              width={120}
              height={80}
              fill="rgba(4, 10, 6, 0.9)"
              stroke="#605F5B"
              strokeWidth={1}
              rx={4}
            />
            {/* Texto do tooltip */}
            <text x={tooltip.x + 20} y={tooltip.y - 40} fill="#F0F0EB" fontSize={12}>
              <tspan x={tooltip.x + 20} dy="0">
                {tooltip.data.name}
              </tspan>
              <tspan x={tooltip.x + 20} dy="20">
                Est: {tooltip.data.estrangeiros.toFixed(2)}%
              </tspan>
              <tspan x={tooltip.x + 20} dy="20">
                Ban: {tooltip.data.bancos.toFixed(2)}%
              </tspan>
              <tspan x={tooltip.x + 20} dy="20">
                Pre: {tooltip.data.preco.toFixed(2)}%
              </tspan>
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default MultiLineChart;
