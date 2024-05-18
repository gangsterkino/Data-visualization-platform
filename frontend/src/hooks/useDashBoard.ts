import { ref, reactive, onMounted, watch, watchEffect, type Ref, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'
import { type ChartData, type ChartConfiguration, type ChartType } from "chart.js"
import {
    type Option, type Options, type Chart_inf, type Charts_inf,
    type Chart_caption, type Chart_captions, type SubCharts,
}
    from '@/types'

import { getDashTable } from '@/hooks/useDashTable'
import { checkBoxData } from '@/hooks/useCheckbox'

import { useChart } from './useChart'
import { useNovels } from '@/api/useNovels'

Chart.register(...registerables) // Register dependencies

export function useDashBoard() {
    /**
     * Data
     * 所有的数据
     */
    // Select chart
    const options = reactive<Options>([
        { id: '001', name: '柱状图', typeName: 'bar' },
        { id: '002', name: '线性图', typeName: 'line' },
        { id: '003', name: '雷达图', typeName: 'radar' },
        { id: '004', name: '饼图', typeName: 'pie' },
    ])


    // select mainchart
    const selected = ref<Option>(options[0])

    // charts
    const mainCanvas = ref<HTMLCanvasElement | null>(null)
    const subCanvas = ref<HTMLCanvasElement | null>(null)

    // chart caption
    const chartCaptions = reactive<Chart_captions>([
        { id: '001', chartName: selected.value.name, caption: '解释1' },
        { id: '002', chartName: selected.value.name, caption: '解释2' },
    ])


    const mainChartType = ref<ChartType>(selected.value.typeName)
    const mainChartData = ref<ChartConfiguration['data']>({
        labels: [],
        datasets: [{
            data: [],
            borderWidth: 1
        }]
    })

    const subChartType = ref<ChartType>('line')
    const subChartData = ref<ChartConfiguration['data']>({
        labels: [],
        datasets: [{
            data: [],
            borderWidth: 1
        }]
    })

    let novelsRankingPostSetting = reactive({
        novel_name: 'all',
        ranking_target: 'today_votes',
        primary_genre: 'all',
        date_range: '2024-01-10, 2024-01-20',
    })

    let genreRankingPostSetting = reactive({
        ranking_target: 'today_votes',
    })

    const updateMainChart = useChart(mainCanvas, mainChartType, mainChartData).updateChart
    const updateSubChart = useChart(subCanvas, subChartType, subChartData).updateChart
    const { getStatisticsData, check_genre, getNovalRank } = useNovels()

    let dashTable = getDashTable()
    const { header, sortName, currentPage, displayedNovels, prevPage, nextPage, totalPages, rankData,
        voteRating, votesToday, numClick, clickRating
    } = dashTable

    /**
     * function
     * 所有的方法
     */

    async function fetchDataFromBackend() {
        // 模拟从后端获取数据的逻辑，实际情况需要替换成实际的API请求
        // 这里使用字符串模拟静态数据
    }

    function updateChartDescription() {
        // 根据选中的选项更新图表描述
    }

    function interactChart() {
        // 实现交互图表的逻辑
        fetchDataFromBackend()
    }

    async function predictTrend() {
        // get salient
        getNovalRankData()
    }

    function exportChart() {
        // 实现导出图表的逻辑
        updateChartDescription()
        fetchDataFromBackend();
    }

    async function uploadData() {

    }

    // set chart
    async function setMainChart(data: any) {
        mainChartData.value.datasets[0].data = data.map((item: any) => item.total)
        mainChartData.value.labels = data.map((item: any) => item.primary_genre)
        updateMainChart()
    }

    async function getNovalRankData() {
        const salient_data = await getNovalRank(novelsRankingPostSetting.novel_name, novelsRankingPostSetting.ranking_target, novelsRankingPostSetting.primary_genre, novelsRankingPostSetting.date_range)
        const count_salient = salient_data.count.slice(0, 100)
        const growth_salient = salient_data.growth.slice(0, 100)

        console.log(growth_salient[0].daily)
        console.log(salient_data)

        mainChartData.value.labels = count_salient.slice(0, 10).map((item: any) => item.name)
        mainChartData.value.datasets[0].data = count_salient.slice(0, 10).map((item: any) => item.rating_votes)

        subChartData.value.datasets[0].data = growth_salient[0].daily.map((item: any) => item.rating_votes)
        subChartData.value.labels = growth_salient[0].daily.map((item: any) => {
            const date = new Date(item.date)
            return date.toLocaleDateString('zh-CN', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '-')
        })

        rankData.value = growth_salient.map((item: any) => ({
            name: item.name,
            votes_today: item.today_votes,
            votes_growth: item.growth_votes,
            clicks_today: item.today_clicks,
            clicks_growth: item.growth_clicks,
        }))


        updateMainChart()
        updateSubChart()

    }

    /**
     * monitor
     * 所有的监视器
     */
    // change chartCaptions when selected changed
    watch(sortName, (newValue) => {
        if (sortName.value == '今日投票') {
            novelsRankingPostSetting.ranking_target = 'today_votes'
            genreRankingPostSetting.ranking_target = 'today_votes'
        }
        else if (sortName.value == '投票涨幅') {
            novelsRankingPostSetting.ranking_target = 'growth_votes'
            genreRankingPostSetting.ranking_target = 'growth_votes'
        }
        else if (sortName.value == '今日点击') {
            novelsRankingPostSetting.ranking_target = 'today_clicks'
            genreRankingPostSetting.ranking_target = 'today_clicks'
        }
        else if (sortName.value == '点击涨幅') {
            novelsRankingPostSetting.ranking_target = 'growth_clicks'
            genreRankingPostSetting.ranking_target = 'growth_clicks'
        }

        if (checkBoxData.value.switch == 'genre') init_Chart()
        else if (checkBoxData.value.switch == 'novels') getNovalRankData()
    })
    watch(checkBoxData, (newValue) => {
        if (newValue.typeData.selectedType != '') novelsRankingPostSetting.primary_genre = newValue.typeData.selectedType
        if (newValue.typeData.getNovelname != '') novelsRankingPostSetting.novel_name = newValue.typeData.getNovelname
        if (newValue.typeData.isMoth != true) novelsRankingPostSetting.ranking_target = 'today_votes'
        if (newValue.time_range.startDate != '') novelsRankingPostSetting.date_range = `${newValue.time_range.startDate}, ${newValue.time_range.endDate}`

        if (checkBoxData.value.switch == 'genre') init_Chart()
        else if (checkBoxData.value.switch == 'novels') getNovalRankData()
    }, {
        deep: true // allow deep watching
    }
    )

    // change chartType when selected changed
    watch(selected, (newValue) => {
        mainChartType.value = newValue.typeName
        updateMainChart()
    })

    /**
     * Life Cycle
     */

    async function init_Chart() {
        const genre_response = await check_genre(genreRankingPostSetting.ranking_target)

        const count_response = genre_response.count.slice(0, 100)
        const growth_response = genre_response.growth.slice(0, 100)
        mainChartData.value.datasets[0].data = count_response.map((item: any) => item.rating_votes)
        mainChartData.value.labels = count_response.map((item: any) => item.primary_genre)

        const best_growth_daily = growth_response[0].daily
        subChartData.value.datasets[0].data = best_growth_daily.map((item: any) => item.rating_votes)
        subChartData.value.labels = best_growth_daily.map((item: any) => {
            const date = new Date(item.date)
            return date.toLocaleDateString('zh-CN', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '-')
        })

        rankData.value = growth_response.map((item: any) => ({
            name: item.primary_genre,
            votes_today: item.today_votes,
            votes_growth: item.growth_votes,
            clicks_today: item.today_clicks,
            clicks_growth: item.growth_clicks,
        }))

        console.log(rankData.value)

        updateMainChart()
        updateSubChart()
    }


    onMounted(() => {
        init_Chart()
    })

    onBeforeUnmount(() => {

    })

    return {
        selected, options, subCanvas, chartCaptions, mainCanvas, dashTable,
        interactChart, predictTrend, exportChart, uploadData,
    }
}