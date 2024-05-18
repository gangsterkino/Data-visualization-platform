<template>
    <div class="contain">
        <sidebar></sidebar>
        <div class="content">
            <RouterView></RouterView>
        </div>
    </div>
</template>
 
<script setup lang="ts" name="cabinet">
import { ref, reactive } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
</script>
 
<style scoped>
.contain {
    height: 100vh;
    width: 100%;
    display: flex;
    background-color: #262626;
    flex-direction: row;
}

.content {
    background-color: #262626;
    width: 100%;
    height: 100vh;

}
</style>
 
 
 