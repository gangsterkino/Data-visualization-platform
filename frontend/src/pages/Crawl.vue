<template>
    <div class="crawl">
        <div class="upload-container">
            <label class="uploadbutton">
                Choose Folder
                <input type="file" @change="uploadJson" class="uploadbutton">
            </label>


            <button @click="submitJson">Upload</button>
            <button @click="GetViewSort('test')">GetViewSort</button>

        </div>


        <!-- 表格 -->
        <table class="novel-table">
            <thead>
                <tr>
                    <th>书名</th>
                    <th>月票</th>
                    <th>类型</th>
                    <!-- 添加其他列名 ... -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(novel, index) in novels" :key="index" class="novel-item"
                    v-show="index >= (currentPage - 1) * 15 && index < currentPage * 15">
                    <td>{{ novel.name }}</td>
                    <td>{{ novel.rating_votes }}</td>
                    <td>{{ novel.primary_genre }}</td>
                    <!-- 添加其他列 ... -->
                </tr>
            </tbody>
            <p style="margin: auto;">Total Novels: {{ novels.length }}</p>

        </table>

        <!-- 页码栏 -->
        <div class="pagination">
            <button class="prev-page" @click="prevPage">&laquo; 上一页</button>
            <span style="margin: auto;">{{ currentPage }}</span>
            <button class="next-page" @click="nextPage">下一页 &raquo;</button>
        </div>

    </div>
</template>
 
<script setup lang="ts" name="Crawl">
import { useCrawl } from "@/hooks/useCrawl"
import { onMounted } from "vue";
const { novels, currentPage,
    uploadJson, submitJson, GetViewSort, prevPage, nextPage } = useCrawl()


</script>
 
<style scoped>
.crawl {
  background-color: #d1d1d1;  
    width: 80%;
    margin: auto;
    display: grid;
    margin-top: 10%;
    height: auto;
    padding-bottom: 2rem;
        padding-top: 2rem;
  border-radius: 20px;


}

button {
    width: 130px;
    margin: auto;
}

.pagination {
    margin-top: 10px;
    display: flex;
}

input {
    display: none;
}

.upload-container {
    width: 80%;
    margin: auto;
    background-color: rgb(84, 84, 84);
    border-radius: 20px;
    padding: 2rem;
    display: grid;
    height: 250px;
}

.pagination button {
    margin: auto;
}

.uploadbutton {
    width: auto;
    height: 25px;
    color: #fff;
    padding: 5px 10px;
    display: inline-block;
    outline: none;
    border-radius: 8px;
    margin: auto;
    border: 3px solid black;
    margin-bottom: 20px;
    z-index: 0;
    background: #232323;
    color: white;

}

.upload-container :hover {
    background-color: #fff;
    color: #000;
    border: 3px solid black;
}

input {
    position: absolute;
    font-size: 100px;
    right: 0;
    width: 100%;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer
}

.novel-list {
    list-style: none;
    padding: 0;
}

.novel-item {
    background-color: #555;
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 5px;
    transition: background-color 0.3s ease;

}

.novel-item:hover {
    background-color: #777;
}

.novel-table {
    width: 80%;
    border-collapse: collapse;
    margin: auto;
    margin-top: 10px;

}


.novel-table th,
.novel-table td {
    padding: 8px;
    text-align: center;
    margin: auto;
}

.novel-table th {
    background-color: #555;
    color: white;
    position: relative;
}

.novel-table tr:hover {
    background-color: #777;
}
</style>
