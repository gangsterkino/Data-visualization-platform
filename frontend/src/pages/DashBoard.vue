<template>
    <div class="contain">
        <div class="left">
            <div class="chart1">
                <div class="selects">
                    <select v-model="selected" class="upload1">
                        <option :value="option" v-for="option in options" :key="option.id" style="text-align: c;">
                            {{ option.name }}
                        </option>
                    </select>
                    <button class="upload" @click="interactChart">交互图表</button>
                    <button class="upload" @click="predictTrend">趋势预测</button>
                    <button class="upload" @click="uploadData">上传数据</button>
                </div>
                <div class="chart-img">
                    <h1 style="height: 10%"></h1>
                    <canvas ref="mainCanvas"></canvas>
                </div>
                <div style="flex: 0.3; margin: auto;">
                    <Checkbox :clickedValue ="clickedValue"></Checkbox>
                </div>
            </div>

            <div class="chart3">
                <!-- 定义接收数据中直观展现的可分析得到的数值和标签的键值对 -->
                <div class="card" v-for="chartCaption in chartCaptions" :key="chartCaption.id">
                    {{ chartCaption.chartName }}: {{ chartCaption.caption }}
                </div>

            </div>
        </div>

        <!-- 主图对应的副图可通过交互式来修改 -->
        <div class="chart2">
            <div class="item-1">
                <div>{{ rankData[0].name }}</div>
                <canvas ref="subCanvas"></canvas>
            </div>
            <div class="item2-table" ref="subChartContainer">
                <!-- 页码栏 -->
               <div class="pagination" style="display: flex;">
                <button class="page" @click="prevPage" :disabled="currentPage <= 1"  :class="{ 'disabled-button': currentPage <= 1 }">&laquo; 上一页</button>
                <span style="margin: auto; position: relative;">{{ currentPage }}</span>
                <button class="page" @click="nextPage" :disabled="currentPage >= totalPages"  :class="{ 'disabled-button': currentPage >=totalPages }">下一页 &raquo;</button>
            </div>

                <!--表格-->
                <div class="novel">
                    <table class="novel-table">
                        <thead>
                            <tr>
                                <th>{{ header.header_name[0] }}{{ header.header_tail[0] }}</th>
                                <th @click="votesToday">{{ header.header_name[1] }}{{ header.header_tail[1] }}</th>
                                <th @click="voteRating">{{ header.header_name[2] }}{{ header.header_tail[2] }}</th>
                                <th @click="numClick">{{ header.header_name[3] }}{{ header.header_tail[3] }}</th>
                                <th  @click="clickRating">{{ header.header_name[4] }}{{ header.header_tail[4] }}</th> 
                            </tr>
                        </thead>
                        <tbody v-if="rankData.length > 0">
                            <tr v-for="(novel, index) in rankData" :key="index" class="novel-list"
                                v-show="index >= (currentPage - 1) * 5 && index < currentPage * 5">
                                <td @click="nameClick(novel)" @mouseenter="showTooltip(novel)" @mouseleave="hideTooltip"> {{ novel.name.length > 4 ? novel.name.substring(0, 4) + '...' : novel.name }}
                                    <div v-if="tooltipVisible && tooltipContent === novel.name" class="tooltip">{{ tooltipContent }}</div>
                                </td>                                
                                <td>{{ novel.votes_today }}</td>
                                <td :class="{ 'green-text': novel.votes_growth > 0, 'red-text': novel.votes_growth <= 0 }">{{ novel.votes_growth }}</td>
                                <td>{{ novel.clicks_today }}</td>
                                <td :class="{ 'green-text': novel.clicks_growth > 0, 'red-text': novel.clicks_growth <= 0 }">{{ novel.clicks_growth }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="item2-card" ref="" style="font-size: 90px;">
                    saliency info
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="DashBoard">
import { ref } from 'vue'
import '../styles/dashboard.css'
import { useDashBoard } from '@/hooks/useDashBoard'
import Checkbox from '@/components/Checkbox.vue'

const { selected, options, subCanvas, chartCaptions, mainCanvas, dashTable,
    interactChart, predictTrend, exportChart, uploadData,
} = useDashBoard()

const { header, currentPage, displayedNovels, prevPage, nextPage, totalPages, rankData,
    voteRating, votesToday, numClick, clickRating, nameClick,clickedValue, showTooltip, hideTooltip,
    tooltipVisible,tooltipContent,
} = dashTable


</script>

<style scoped>
.subChart {

    height: 50%;
}
.subChart {
  height: 50%;
}

.green-text {
  color: green;
}

.red-text {
  color: red;
}
.tooltip {
    position: absolute;
    background-color: rgba(255, 255, 255,0.7);
    border: 1px solid black;
    padding: 1rem;
    height: auto;
    color: #000;
    border-radius: 15px;
    margin-right: 20px;
}
</style>