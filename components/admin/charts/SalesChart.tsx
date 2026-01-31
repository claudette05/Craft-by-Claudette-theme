
import * as React from 'react';
import { AdminOrder } from '../../../types';

interface SalesData {
    name: string; // e.g., 'Mon'
    sales: number;
}

// This helper processes raw order data into a format the chart can use (sales for the last 7 days)
const processOrdersForChart = (orders: AdminOrder[]): SalesData[] => {
    const last7Days: SalesData[] = [];
    const today = new Date();

    // 1. Initialize the sales data for the last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        last7Days.push({
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            sales: 0,
        });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // Set to the first day of our 7-day window
    sevenDaysAgo.setHours(0, 0, 0, 0); // Start of the day

    // 2. Aggregate sales from orders into the correct day's bucket
    orders.forEach(order => {
        const orderDate = new Date(order.date);
        if (orderDate >= sevenDaysAgo) {
            // Calculate the difference in days from the start of the 7-day window
            const diffTime = orderDate.getTime() - sevenDaysAgo.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

            if (diffDays >= 0 && diffDays < 7) {
                // The order falls within our 7-day window
                last7Days[diffDays].sales += order.total;
            }
        }
    });

    return last7Days;
};


interface SalesChartProps {
    orders: AdminOrder[];
}

const SalesChart: React.FC<SalesChartProps> = ({ orders }) => {
    // Process orders to get chart-ready data
    const data = processOrdersForChart(orders);

    const parentWidth = 500;
    const parentHeight = 288; // h-72
    const padding = { top: 20, right: 20, bottom: 30, left: 50 }; // Increased left padding for labels
    const width = parentWidth - padding.left - padding.right;
    const height = parentHeight - padding.top - padding.bottom;
    
    const maxSales = Math.max(...data.map(d => d.sales), 0); // Ensure it's at least 0
    
    const yScale = (sales: number) => {
        if (maxSales === 0) {
            return padding.top + height; // Position at the bottom if no sales
        }
        return padding.top + height - (sales / maxSales) * height;
    };
    
    const xScale = (index: number) => {
      if (data.length <= 1) {
        return padding.left + width / 2;
      }
      return padding.left + (index / (data.length - 1)) * width;
    };

    const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.sales)}`).join(' ');

    const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
        const value = maxSales > 0 ? (maxSales / 4) * i : 0;
        return { value, y: yScale(value) };
    });

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${parentWidth} ${parentHeight}`} className="text-[var(--text-secondary)]">
            {/* Y-Axis Grid Lines and Labels */}
            {yAxisLabels.map((label, i) => (
                <g key={`y-axis-label-${i}`}>
                    <line x1={padding.left} y1={label.y} x2={parentWidth - padding.right} y2={label.y} stroke="currentColor" strokeDasharray="2,2" strokeOpacity="0.3" />
                    <text x={padding.left - 8} y={label.y + 4} textAnchor="end" fontSize="10" fill="currentColor">
                        GH₵{(label.value / 100).toFixed(2)}
                    </text>
                </g>
            ))}

            {/* X-Axis Labels */}
            {data.map((d, i) => (
                <text key={`${d.name}-${i}`} x={xScale(i)} y={parentHeight - padding.bottom + 15} textAnchor="middle" fontSize="10" fill="currentColor">
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
