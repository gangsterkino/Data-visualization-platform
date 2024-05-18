// chartInteractions.ts
import { Chart, type ChartType } from 'chart.js';

export const handleChartClick = {
    bar: () => {
        alert('点击了柱状图！');
    },
    line: () => {
        alert('点击了折线图！');
    },
    radar: () => {
        alert('点击了雷达图！');
    },
    pie: () => {
        alert('点击了饼图！');
    },
} as Record<ChartType, () => void>;

export function setupChartInteractions(canvas: HTMLCanvasElement, chartInstance: Chart, chartType: ChartType): void {
    // 移除之前的点击事件监听器
    Object.values(handleChartClick).forEach((handler) => {
        canvas.removeEventListener('click', handler);
    });

    // 添加新的点击事件监听器
    canvas.addEventListener('click', handleChartClick[chartType]);
}