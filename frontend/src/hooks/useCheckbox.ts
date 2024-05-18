import { ref } from 'vue';

const startDate = ref('');
const endDate = ref('');
const isMonth = ref(false);
const getNovelname = ref('');
const timeData = ref({
    startDate: '',
    endDate: '',
});
const typeData = ref({
    selectedType: '',
    isMonth: false,
    getNovelname: '',
});

const types = [
    { value: '所有', label: '所有' },
    { value: '玄幻', label: '玄幻' },
    { value: '都市', label: '都市' },
    { value: '仙侠', label: '仙侠' },
    { value: '历史', label: '历史' },
    { value: '科幻', label: '科幻' },
    { value: '奇闻逸事', label: '奇闻逸事' },
    { value: '武侠', label: '武侠' },
    { value: '游戏', label: '游戏' },
    { value: '奇幻', label: '奇幻' },
    { value: 'n次元', label: 'n次元' },
    { value: '体育', label: '体育' },
];

const selectedType = ref(types[0].label);

let checkBoxData = ref(
    {
        "typeData": {
            'selectedType': selectedType,
            'isMoth': isMonth,
            'getNovelname': getNovelname,
        },
        "time_range": {
            'startDate': startDate,
            'endDate': endDate,
        },
        "switch": 'genre'
    }
)

const selectedField = ref('小说');


const submitCheckBox = () => {
    if (checkBoxData.value.switch === 'genre') {
        checkBoxData.value.switch = 'novels';
        selectedField.value = '小说';
    } else {
        checkBoxData.value.switch = 'genre';
        selectedField.value = '类型';
    }
}


export {
    startDate,
    endDate,
    isMonth,
    getNovelname,
    timeData,
    typeData,
    selectedType,
    types,
    checkBoxData,
    submitCheckBox,
    selectedField
};