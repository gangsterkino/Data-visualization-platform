import { ref, computed, onMounted, type Ref } from 'vue';
import { type RankDatas, type RankData} from '@/types'

export function getDashTable() {

    let header = ref(
        {
            header_name: ['书名', '今日投票', '投票涨幅', '今日点击', '点击涨幅'],
            header_tail: ['', '↓', '', '', '']
        }
    )
    let sortName = ref(header.value.header_name[1])
    // 当前页码
    const currentPage = ref(1);

    // 后端数据
    const rankData: Ref<RankDatas> = ref([
        {
            name: 'none',
            votes_today: 0,
            votes_growth: 0,
            clicks_today: 0,
            clicks_growth: 1,
        }
    ]);
    // 悬浮框显示控制
    const tooltipVisible = ref(false);
    const tooltipContent = ref('');

    // 计算总页数
    const totalPages = computed(() => {
        const dataToDisplay = rankData.value 
        return Math.ceil(dataToDisplay.length / 5);
    });
    // 计算当前页应该显示的数据
    const displayedNovels = computed(() => {
        if (rankData.value.length > 0) {
            return rankData.value.slice((currentPage.value - 1) * 5, currentPage.value * 5);
        } 
    });

    // 上一页
    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };


    // 下一页
    const nextPage = () => {
        if (currentPage.value < 100) {
            currentPage.value++;
        }
    };

    //表头点击排序
    const votesToday = () => {
        sortName.value = header.value.header_name[1]
        header.value.header_tail[1] = '↓'
        header.value.header_tail[2] = ''
        header.value.header_tail[3] = ''
        header.value.header_tail[4] = ''
    };

    const voteRating = () => {
        sortName.value = header.value.header_name[2]
        header.value.header_tail[1] = ''
        header.value.header_tail[2] = '↓'
        header.value.header_tail[3] = ''
        header.value.header_tail[4] = ''
    };

    const numClick = () => {
        sortName.value = header.value.header_name[3]
        header.value.header_tail[1] = ''
        header.value.header_tail[2] = ''
        header.value.header_tail[3] = '↓'
        header.value.header_tail[4] = ''
    };

    const clickRating = () => {
        sortName.value = header.value.header_name[4]
        header.value.header_tail[1] = ''
        header.value.header_tail[2] = ''
        header.value.header_tail[3] = ''
        header.value.header_tail[4] = '↓'
    };
    const clickedValue = ref('');

    // 书名点击
    const nameClick = (novel: RankData) => {
        console.log('Clicked on:', novel.name); // 输出原始的书名数据
        clickedValue.value = novel.name; // 设置 clickedValue 的值为书名
    };

    // 悬浮框触发函数
    const showTooltip = (novel: RankData) => {
        tooltipVisible.value = true;
        tooltipContent.value = novel.name;
    };

    // 鼠标移开时隐藏悬浮框
    const hideTooltip = () => {
        tooltipVisible.value = false;
    };


    onMounted(() => {
    });
    return {
        header,
        sortName,
        currentPage,
        rankData,
        displayedNovels,
        prevPage,
        nextPage,
        totalPages,
        voteRating,
        votesToday,
        clickRating,
        numClick,
        nameClick,
        clickedValue,
        showTooltip,
        hideTooltip,
        tooltipVisible,
        tooltipContent
    }
}