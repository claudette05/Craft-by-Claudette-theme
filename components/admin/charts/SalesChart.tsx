
import * as React from 'react';

interface SalesData {
    name: string;
    sales: number;
}

interface SalesChartProps {
    data: SalesData[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
    const parentWidth = 500;
    const parentHeight = 288; // h-72
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = parentWidth - padding.left - padding.right;
    const height = parentHeight - padding.top - padding.bottom;
    
    const maxSales = Math.max(...data.map(d => d.sales));
    
    const yScale = (sales: number) => {
        if (maxSales === 0) {
            return padding.top + height;
        }
        return padding.top + height - (sales / maxSales) * height;
    };

    const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.sales)}`).join(' ');

    const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
        const value = maxSales > 0 ? (maxSales / 4) * i : 0;
        return { value, y: yScale(value) };
    });
    
    const xScale = (index: number) => {
      if (data.length <= 1) {
        return padding.left + width / 2;
      }
      return padding.left + (index / (data.length - 1)) * width;
    };


    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${parentWidth} ${parentHeight}`} className="text-[var(--text-secondary)]">
            {/* Y-Axis Grid Lines and Labels */}
            {yAxisLabels.map((label, i) => (
                <g key={`y-axis-label-${i}`}>
                    <line x1={padding.left} y1={label.y} x2={parentWidth - padding.right} y2={label.y} stroke="currentColor" strokeDasharray="2,2" strokeOpacity="0.3" />
                    <text x={padding.left - 8} y={label.y + 4} textAnchor="end" fontSize="10" fill="currentColor">
                        GH₵{(label.value / 1000).toFixed(1)}k
                    </text>
                </g>
            ))}

            {/* X-Axis Labels */}
            {data.map((d, i) => (
                <text key={d.name} x={xScale(i)} y={parentHeight - padding.bottom + 15} textAnchor="middle" fontSize="10" fill="currentColor">
                    {d.name}
                </text>
            ))}

            {/* Line Chart Path */}
            {pathData && data.length > 1 && <path d={pathData} fill="none" stroke="#F59E0B" strokeWidth="2" />}

            {/* Data Points */}
            {data.map((d, i) => (
                <circle key={`data-point-${i}`} cx={xScale(i)} cy={yScale(d.sales)} r="4" fill="#F59E0B" className="transition-transform duration-200 hover:scale-150" />
            ))}
        </svg>
    );
};

export default SalesChart;
