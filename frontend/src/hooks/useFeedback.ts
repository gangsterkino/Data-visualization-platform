import { ref } from 'vue'


export function useFeedback() {
    const feedbackType = ref('');
    const feedbackContent = ref('');

    const submitFeedback = () => {
        // 在这里执行将反馈发送到后端的逻辑
        console.log('提交反馈：', feedbackType.value, feedbackContent.value);
    };
    return { feedbackContent, feedbackType, submitFeedback }
}