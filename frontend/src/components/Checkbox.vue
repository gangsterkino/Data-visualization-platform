<template>
    <div class="container" style="display: grid;">
     <div class="selection" >
         <div >类型：
             <select v-model="selectedType" id="typeSelector" >
                 <option v-for="type in types" :key="type.value" :value="type.value">{{ type.label }}
                 </option>
             </select>
         </div>
 
          <div class="select-group"> 时间:
         <div  style="display: grid;">
             <input v-model="startDate" type="date" id="startDate" />
             <input v-model="endDate" type="date" id="endDate" />
           </div>
     </div>
   <div class="select-group">小说：
  <input class="input-novel" type="text" :value="clickedValue" v-show="selectedField === '小说'"/>
    <!-- 如果 selectedField 不为 '类型'，显示 getNovelname 输入框 -->
    <input class="input-novel" type="input" placeholder="输入小说名" v-model="getNovelname" v-on:input="search"  v-show="selectedField === '类型'"/>
  </div>
       
    <div class="select-group" style="display: flex;"> 月票:
             <input type="checkbox" v-model="isMonth" style="margin: auto;"/>
         </div>
         </div>
 
<div class="toggle-button" @click="submitCheckBox">
    <div v-if="selectedField === '类型'" class="toggle-button__indicator toggle-button__indicator--left"></div>
    <div class="toggle-button__text">{{ selectedField }}</div>
    <div v-if="selectedField === '小说'" class="toggle-button__indicator toggle-button__indicator--right"></div>
  </div>

    </div>
 
 </template>
  
 <script setup lang="ts">
import { defineProps } from 'vue';
import { startDate, endDate, isMonth, getNovelname, selectedType, types, submitCheckBox, selectedField } from '@/hooks/useCheckbox';
import { tooltipContent } from '@/hooks/useDashTable.ts'
const props = defineProps({
  clickedValue: String
});

 </script>
  
 <style scoped>
.container{
     height: auto;
     width:200px;
     background-color: #404040;
 
    }

 div{
     font-size:medium ;
     
 }
.toggle-button {
  background-color: #464646;
  color: white;
  display: flex;
  width: 60px;
  height: auto;
  padding: 0.08rem;
  border: 2px solid black;
  border-radius: 4rem;
  align-items: center;
  cursor: pointer;
  margin: auto;
   
}

.toggle-button__indicator {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 2px solid white;
  margin-right: auto;
  margin-left: auto;
}

.toggle-button__indicator--left {
  background-color: green;
}

.toggle-button__indicator--right {
  background-color: blue;
}

.toggle-button__text {
  font-size: 15px;
}
 
select{
     border-radius: 2px;
     width: 80%;
     background-color: aliceblue;
     color: black;
     font-size: smaller;
     border: 1px solid aliceblue;
     margin: 5%;
    }
input,.input-novel, input[type="text"]{
    border-radius: 2px;
     width: 80%;
     background-color: aliceblue;
     color: black;
     font-size: smaller;
     border: 1px solid aliceblue;
     margin: 5%;
     height: 1rem;
     padding: 0;
 }
 
    </style>
  