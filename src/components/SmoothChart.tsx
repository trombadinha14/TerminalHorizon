import { curveCatmullRom, line, area } from "d3-shape";
import { scaleLinear, scaleBand } from "@visx/scale";
import { ChartDataPoint } from "../types";
import { useState, useEffect, useRef } from "react";

// --------------------------------------------------
// EXEMPLO DE DADOS (FIXO, SEM PROP data)
// --------------------------------------------------
const data: ChartDataPoint[] = [
  { name: "DI26", rate: 0.5, maxVar: 0.78, minVar: -0.15 },
  { name: "DI27", rate: 1.28, maxVar: 1.54, minVar: -0.15 },
  { name: "DI28", rate: 0.8, maxVar: 1.02, minVar: -0.15 },
  { name: "DI29", rate: -0.3, maxVar: 0.15, minVar: -0.15 },
  { name: "DI30", rate: -0.7, maxVar: 0.27, minVar: -0.15 },
  { name: "DI31", rate: 0.2, maxVar: 0.58, minVar: -0.15 },
  { name: "DI32", rate: 0.9, maxVar: 1.12, minVar: -0.15 },
  { name: "DI33", rate: 1.5, maxVar: 1.74, minVar: -0.15 },
  { name: "DI34", rate: 1.2, maxVar: 1.52, minVar: -0.15 },
  { name: "DI35", rate: 0.8, maxVar: 0.96, minVar: -0.15 },
];

interface SmoothChartProps {
  height?: number;
}

interface TooltipData {
  x: number;
  y: number;
  data: ChartDataPoint;
}

// --------------------------------------------------
// FUNÇÃO PARA CRIAR SEGMENTOS + CRUZAMENTOS DE ZERO
// --------------------------------------------------
function prepareLineSegments(
  data: ChartDataPoint[],
  xScale: (name: string) => number | undefined,
  yScale: (val: number) => number
) {
  if (!data.length) return [];

  type XYPoint = { x: number; y: number };
  type SegmentSign = "positive" | "negative";
  type Segment = { points: XYPoint[]; sign: SegmentSign };

  const segments: Segment[] = [];

  function getSign(v: number): SegmentSign {
    return v >= 0 ? "positive" : "negative";
  }

  let prev = data[0];
  let prevX = xScale(prev.name) ?? 0;
  let prevY = yScale(prev.rate);
  let prevSign = getSign(prev.rate);

  let currentSegment: XYPoint[] = [{ x: prevX, y: prevY }];

  for (let i = 1; i < data.length; i++) {
    const curr = data[i];
    const currX = xScale(curr.name) ?? 0;
    const currY = yScale(curr.rate);
    const currSign = getSign(curr.rate);

    // Se houve mudança de sinal entre o ponto anterior e o atual:
    if (prevSign !== currSign) {
      const rateDiff = curr.rate - prev.rate;
      if (rateDiff !== 0) {
        // Fração t em que cruza zero
        const t = -prev.rate / rateDiff;
        const crossX = prevX + t * (currX - prevX);
        const crossY = yScale(0);

        currentSegment.push({ x: crossX, y: crossY });
        segments.push({ points: currentSegment, sign: prevSign });

        currentSegment = [{ x: crossX, y: crossY }, { x: currX, y: currY }];
      } else {
        segments.push({ points: currentSegment, sign: prevSign });
        currentSegment = [{ x: currX, y: currY }];
      }
    } else {
      currentSegment.push({ x: currX, y: currY });
    }

    prev = curr;
    prevX = currX;
    prevY = currY;
    prevSign = currSign;
  }

  // Último segmento
  if (currentSegment.length) {
    segments.push({ points: currentSegment, sign: prevSign });
  }

  return segments;
}

// --------------------------------------------------
// COMPONENTE SmoothChart
// --------------------------------------------------
const SmoothChart = ({ height = 400 }: SmoothChartProps) => {
  // 1) HOOKS
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [animatedCursor, setAnimatedCursor] = useState({ x: 0, y: 0 });

  const [width, setWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // 2) EFEITOS
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (containerWidth > 0) {
      setWidth(containerWidth);
    }
  }, [containerWidth]);

  // Animação do crosshair (interpolação)
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setAnimatedCursor((prev) => ({
        x: prev.x + (cursor.x - prev.x) * 0.2,
        y: prev.y + (cursor.y - prev.y) * 0.2,
      }));
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [cursor]);

  // Fade out do tooltip (0.6s)
  useEffect(() => {
    if (!tooltipVisible) {
      const timeout = setTimeout(() => {
        setTooltip(null);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [tooltipVisible]);

  // 3) EARLY RETURN
  if (width === 0) {
    return (
      <div
        ref={containerRef}
        className="relative bg-trading-panel bg-opacity-100 p-2 rounded-lg"
        style={{ width: "100%", height: `${height}px` }}
      />
    );
  }

  // 4) CÁLCULOS DO GRÁFICO
  const margin = { top: 20, right: -39, bottom: 30, left: 20 };

  const minRate = Math.min(...data.map((d) => d.minVar), 0);
  const maxRate = Math.max(...data.map((d) => d.maxVar), 0);
  const maxAbs = Math.max(Math.abs(minRate), Math.abs(maxRate));
  const marginFactor = maxAbs < 0.2 ? 0.5 : maxAbs * 0.2;
  const yMin = -(maxAbs + marginFactor);
  const yMax = maxAbs + marginFactor;

  const xScale = scaleBand({
    domain: data.map((d) => d.name),
    range: [margin.left, width - margin.right],
    paddingInner: 0.2,
    paddingOuter: 0.2,
    align: 0.5,
  });
  const yScale = scaleLinear({
    domain: [yMin, yMax],
    range: [height - margin.bottom, margin.top],
  });

  const alpha = 0.7;
  const segments = prepareLineSegments(data, (name) => xScale(name), (val) => yScale(val));
  const segmentLine = line<{ x: number; y: number }>()
    .x((p) => p.x)
    .y((p) => p.y)
    .curve(curveCatmullRom.alpha(alpha));

  const yTicks = yScale.ticks(7);

  // 5) HANDLERS
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 1) Encontrar o marcador mais próximo
    let nearestDist = Infinity;
    let nearestDP: ChartDataPoint | null = null;
    let nearestX = 0;
    let nearestY = 0;

    data.forEach((d) => {
      const x = xScale(d.name) ?? 0;
      const y = yScale(d.rate);
      const dist = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestDP = d;
        nearestX = x;
        nearestY = y;
      }
    });

    // 2) Definir thresholds
    const magnetThreshold = 90;  // raio para "prender" o crosshair
    const markerThreshold = 120;  // raio para exibir tooltip

    // 3) "Snap" do crosshair se estiver dentro do magnetThreshold
    let finalX = mouseX;
    let finalY = mouseY;
    if (nearestDist < magnetThreshold) {
      finalX = nearestX;
      finalY = nearestY;
    }
    setCursor({ x: finalX, y: finalY });

    // 4) Exibir ou não o tooltip se dentro do markerThreshold
    if (nearestDist < markerThreshold && nearestDP) {
      setTooltip({
        x: nearestX,
        y: nearestY,
        data: nearestDP,
      });
      setTooltipVisible(true);
    } else {
      setTooltipVisible(false);
    }
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  // 6) RENDER
  return (
    <div
      ref={containerRef}
      className="relative bg-trading-panel backdrop-blur-lg bg-opacity-20 p-2 rounded-lg"
      style={{ height: `${height}px` }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="cursor-crosshair"
      >
        {/* Gradientes e filtros */}
        <defs>
          <linearGradient id="positive-area" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(126, 191, 142, 0.6)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="negative-area" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(210, 0, 0, 0.6)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Glow forte para marcador */}
          <filter id="strong-glow">
            <feGaussianBlur stdDeviation="10" result="coloredblur" />
            <feMerge>
              <feMergeNode in="coloredblur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow leve para linha vertical */}
          <filter id="light-glow">
            <feGaussianBlur stdDeviation="2" result="coloredblur" />
            <feMerge>
              <feMergeNode in="coloredblur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Sombra padrão do texto */}
          <filter id="text-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0, 0, 0, 0.8)" />
          </filter>

          {/* Sombra padrão para marcador (quando não hover) */}
          <filter id="marker-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,1)" />
          </filter>
        </defs>

        {/* GRID HORIZONTAL */}
        {yTicks.map((tickValue, i) => {
          const y = yScale(tickValue);
          return (
            <line
              key={`grid-${i}`}
              x1={margin.left}
              x2={width - margin.right}
              y1={y}
              y2={y}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={0.3}
              strokeDasharray="0"
            />
          );
        })}

        {/* ÁREAS + LINHAS (segmentadas) */}
        {segments.map((seg, idx) => {
          const isPositive = seg.sign === "positive";
          const segmentArea = area<{ x: number; y: number }>()
            .x((p) => p.x)
            .y0((p) => (isPositive ? yScale(0) : p.y))
            .y1((p) => (isPositive ? p.y : yScale(0)))
            .curve(curveCatmullRom.alpha(alpha));

          const strokeMain = isPositive
            ? "rgba(126, 191, 142, 0.5)"
            : "rgba(210, 0, 0, 0.8)";
          const fill = isPositive ? "url(#positive-area)" : "url(#negative-area)";

          return (
            <g key={`seg-${idx}`}>
              {/* Área segmentada */}
              <path d={segmentArea(seg.points) || ""} fill={fill} />
              {/* Linha principal */}
              <path
                d={segmentLine(seg.points) || ""}
                stroke={strokeMain}
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
              />
            </g>
          );
        })}

        {/* Linha horizontal do eixo 0 */}
        <line
          x1={margin.left}
          x2={width - margin.right}
          y1={yScale(0)}
          y2={yScale(0)}
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth={0.5}
          strokeDasharray="1"
        />

        {/* Linhas e marcadores de maxVar/minVar */}
        {data.map((d, i) => {
          const x = xScale(d.name) ?? 0;
          const yTop = yScale(d.maxVar);
          const yBottom = yScale(d.minVar);

          const isHovered = tooltip && tooltip.data.name === d.name;
          return (
            <g
              key={`line-${i}`}
              filter={isHovered ? "url(#light-glow)" : "none"}
              style={{
                transition: "all 0.6s ease-in-out",
                opacity: isHovered ? 1 : 0.5,
              }}
            >
              <defs>
                <linearGradient
                  id={`fade-line-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={x}
                  y1={yTop}
                  x2={x}
                  y2={yBottom}
                >
                  <stop offset="0%" stopColor="rgba(170, 170, 170, 0.4)" />
                  <stop offset="50%" stopColor="rgba(170, 170, 170, 0)" />
                  <stop offset="100%" stopColor="rgba(170, 170, 170, 0.4)" />
                </linearGradient>
              </defs>

              {/* Linha "fade" entre maxVar e minVar */}
              <line
                x1={x}
                x2={x}
                y1={yTop}
                y2={yBottom}
                stroke={`url(#fade-line-${i})`}
                strokeWidth={0.5}
              />

              {/* Risco no maxVar */}
              <line
                x1={x - 2}
                x2={x + 2}
                y1={yTop}
                y2={yTop}
                stroke="rgba(200, 200, 200, 0.5)"
                strokeWidth={3}
              />

              {/* Risco no minVar */}
              <line
                x1={x - 2}
                x2={x + 2}
                y1={yBottom}
                y2={yBottom}
                stroke="rgba(200, 200, 200, 0.5)"
                strokeWidth={3}
              />
            </g>
          );
        })}

        {/* Pontos (triângulos) e texto */}
        {data.map((d, i) => {
          const x = xScale(d.name) ?? 0;
          const y = yScale(d.rate);

          // Posição-base do texto
          const labelYPosition = d.rate > 0 ? y - 38 : y + 28;

          const isHovered = tooltip && tooltip.data.name === d.name;
          const textShift = 17; // deslocamento vertical do texto quando hover
          const shiftValue = isHovered
            ? d.rate > 0 
              ? -textShift 
              : textShift  
            : 0;

          const fontSize = isHovered ? 22 : 18;

          // Triângulo: zoom 1.3x quando hover
          const cx = x;
          const cy = d.rate >= 0 ? y + 2 : y - 2;

          return (
            <g key={`point-${i}`}>
              <g
                transform={`translate(${cx}, ${cy}) scale(${
                  isHovered ? 1.3 : 1
                }) translate(${-cx}, ${-cy})`}
                style={{ transition: "transform 0.5s ease-in-out" }}
              >
                <polygon
                  points={
                    d.rate >= 0
                      ? `${x - 6},${y + 6} ${x + 6},${y + 6} ${x},${y - 6}`
                      : `${x - 6},${y - 6} ${x + 6},${y - 6} ${x},${y + 6}`
                  }
                  fill={d.rate >= 0 ? "rgb(126, 191, 142)" : "rgb(210, 0, 0)"}
                  filter={isHovered ? "url(#strong-glow)" : "url(#marker-shadow)"}
                  style={{ transition: "filter 0.3s ease-in-out, fill 0.3s ease-in-out" }}
                />
              </g>

              {/* Texto da taxa, que se move e aumenta a fonte */}
              <text
                x={x}
                y={labelYPosition}
                fontSize={fontSize}
                fontWeight="bold"
                textAnchor="middle"
                fill={d.rate >= 0 ? "rgb(126, 191, 142)" : "rgb(210, 0, 0)"}
                filter="url(#text-shadow)"
                style={{
                  transform: `translateY(${shiftValue}px)`,
                  transition: "transform 0.4s ease-in-out",
                }}
              >
                {d.rate.toFixed(2)}%
              </text>
            </g>
          );
        })}

        {/* Crosshair (posição animada) */}
        <line
          x1={animatedCursor.x}
          x2={animatedCursor.x}
          y1={margin.top}
          y2={height - margin.bottom}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={1}
          strokeDasharray="3,3"
        />
        <line
          x1={margin.left}
          x2={width - margin.right}
          y1={animatedCursor.y}
          y2={animatedCursor.y}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={1}
          strokeDasharray="3,3"
        />

        {/* Tooltip (fade de 0.6s) */}
        <g
          style={{
            transition: "opacity 0.6s ease-in-out",
            opacity: tooltipVisible ? 1 : 0,
          }}
        >
          {tooltip && (
            <>
              <rect
                x={tooltip.x + 10}
                y={tooltip.y - 60}
                width={300}
                height={120}
                fill="rgba(4, 10, 6, 0.5)"
                stroke="#605F5B"
                strokeWidth={0.3}
                rx={4}
              />
              <text x={tooltip.x + 20} y={tooltip.y - 40} fill="#F0F0EB" fontSize={18}>
                <tspan x={tooltip.x + 20} dy="0">
                  {tooltip.data.name}
                </tspan>
                <tspan x={tooltip.x + 20} dy="20">
                  Atual: {tooltip.data.rate.toFixed(2)}%
                </tspan>
                <tspan x={tooltip.x + 20} dy="20">
                  Max: {tooltip.data.maxVar.toFixed(2)}%
                </tspan>
                <tspan x={tooltip.x + 20} dy="20">
                  Min: {tooltip.data.minVar.toFixed(2)}%
                </tspan>
              </text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default SmoothChart;
