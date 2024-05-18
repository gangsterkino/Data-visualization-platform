<template>
    <div class="feedback-container">
        <h2>用户意见反馈</h2>
        <form @submit.prevent="submitFeedback">
            <label for="feedbackType">反馈类型:</label>
            <div class="custom-select">
                <select v-model="feedbackType" required>
                    <option value="" disabled>请选择类型</option>
                    <option value="bug">Bug报告</option>
                    <option value="feature">新功能建议</option>
                    <option value="general">一般反馈</option>
                </select>
                <span class="select-arrow">&#9660;</span>
            </div>

            <label for="feedbackContent">反馈内容:</label>
            <textarea v-model="feedbackContent" maxlength="500" required></textarea>

            <button type="submit">提交反馈</button>
        </form>
    </div>
</template>

<script setup lang="ts" name="Feedback">
import { ref } from 'vue';
import { useFeedback } from '@/hooks/useFeedback'

const { feedbackType, feedbackContent, submitFeedback } = useFeedback()

</script>

<style scoped>
.feedback-container {
  background-color: #d1d1d1;
      width: 80%;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    margin-top: 10%;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-top: 10px;
    color: #555;
}

.custom-select {
    position: relative;
}

select {
    margin-bottom: 15px;
    padding: 8px;
    border: 2px solid #2e2e2e;
    border-radius: 5px;
    background-color: #fff;
    color: #000;
    /* White text for better visibility */
    cursor: pointer;
    -webkit-appearance: none;
}

.select-arrow {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
}

textarea {
    resize: none;
    width: 70%;
    margin: auto;
    min-height: 200px;
}

button {
    padding: 10px;
    background-color: #555;
    color: #fff;
    border: none;
    width: 150px;
    border-radius: 15px;
    margin-top: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #333;
}
</style>
