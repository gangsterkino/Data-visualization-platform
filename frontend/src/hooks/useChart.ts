import { ref, onMounted, type Ref, onUnmounted } from 'vue'
import {
    Chart, registerables, type ChartOptions,
    type ChartConfiguration, type ChartType
} from 'chart.js'
import { handleChartClick, setupChartInteractions } from './usechartInteractions'

Chart.register(...registerables)

export function useChart(canvas: Ref<HTMLCanvasElement | null>, chartType: Ref<ChartType>, chartData: Ref<ChartConfiguration['data']>,) {
    let chartInstance: Chart | null = null

    const handleClick = () => {
        // Handle click on the canvas
        alert('点击成功！');
    };
    const renderChart = () => {

        if (canvas.value) {
            const ctx = canvas.value.getContext('2d')
            if (!ctx) return
            if (chartInstance) {
                canvas.value?.removeEventListener('click', handleChartClick[chartType.value]);
                chartInstance.destroy();
            }


            const chartOptions: ChartOptions = {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 12
                            },
                        },
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 12,
                            },
                            padding: 10,
                            callback: function (value: string | number, index: number, ticks: Tick[]) {
                                const label = chartData.value.labels[index] // 获取对应索引的标签值
                                if (label && label.length > 3) {
                                    return label.substring(0, 2) + '...'; // 截断并添加省略号
                                }
                                return label; // 不变的标签
                            },
                        }
                    }
                }
            }
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.value.height || 0);
            gradient.addColorStop(0, 'rgba(181, 184, 216, 1)'); // Start color
            gradient.addColorStop(1, 'rgba(104, 108, 179, 0.5)'); // End color
            const colors = ['#8d90c4', '#ebedfa', '#bcbfdf', '#7679b7', '#5e62a9', '#5e62a9'];

            if (chartType.value === 'bar') {
                chartData.value.datasets[0].backgroundColor = colors;
                chartOptions.plugins = {
                    legend: {
                        display: false
                    }
                }
                chartOptions.elements = {
                    bar: {
                        backgroundColor: ['#8d90c4', '#ebedfa', '#bcbfdf', '#7679b7', '#5e62a9', '#5e62a9'],
                        borderColor: '#5e62a9',

                    }
                }

            }
            else if (chartType.value === 'line') {
                chartData.value.datasets[0].backgroundColor = gradient;

                chartOptions.plugins = {
                    legend: {
                        display: false
                    }
                }
                chartOptions.elements = {
                    point: {
                        radius: 3,
                        hoverRadius: 5,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        hoverBorderColor: 'black',
                    },
                    line: {
                        tension: 0.3,
                        fill: true,
                    }
                }
            }
            else if (chartType.value === 'radar') {
                chartData.value.datasets[0].backgroundColor = gradient;

                chartOptions.plugins = {
                    legend: {
                        display: false
                    }

                }
                chartOptions.elements = {
                    point: {
                        radius: 3,
                        hoverRadius: 5,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        hoverBorderColor: 'black',
                    },
                    line: {
                        tension: 0,
                        fill: true,
                    }
                }

            }
            else if (chartType.value === 'pie') {

                chartData.value.datasets[0].backgroundColor = colors;

            }

            chartInstance = new Chart(ctx, {
                type: chartType.value,
                data: chartData.value,
                options: chartOptions
            });
            setupChartInteractions(canvas.value, chartInstance, chartType.value);


        }
    }

    onMounted(() => {
        //创建图表

        renderChart();

    })

    onUnmounted(() => {

        //销毁图表
        if (chartInstance) {
            canvas.value?.removeEventListener('click', handleChartClick[chartType.value]);

            chartInstance.destroy()
        }
    })

    // update by hand
    const updateChart = () => {

        renderChart()
    }

    return { updateChart }
}