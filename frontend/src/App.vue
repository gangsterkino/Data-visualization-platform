<template>
  <navbar></navbar>
  <div class="contain">
    <RouterView>
    </RouterView>
  </div>
</template>
 
<script setup lang="ts" name="app">
import { ref, reactive, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'


</script>
 
<style scoped>
.contain {
  height: 100vh;
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: row;
}
</style>
 
 
 