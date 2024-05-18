<template>
    <div class="navigate">
        <RouterLink :to="{ name: 'dash-board' }" class="router-link">
            <DashboardIcon class="icon" />
            Dash Board
        </RouterLink>
        <RouterLink :to="{ name: 'analysis' }" class="router-link">
            <CarIcon class="icon" />
            Analysis
        </RouterLink>
        <RouterLink :to="{ name: 'crawl' }" class="router-link">
            <BookIcon class="icon" />
            Crawl
        </RouterLink>

        <RouterLink :to="{ name: 'personal' }" class="router-link">
            <PersonIcon class="icon" />
            Personal
        </RouterLink>
        <RouterLink :to="{ name: 'setting' }" class="router-link">
            <SettingsIcon class="icon" />
            Setting
        </RouterLink>
        <RouterLink :to="{ name: 'feedback' }" class="router-link">
            <ChatIcon class="icon" />
            Feedback
        </RouterLink>

    </div>
</template>

<script setup lang="ts">
import { CarOutline as CarIcon } from '@vicons/ionicons5';
import { ChatbubbleOutline as ChatIcon } from '@vicons/ionicons5';
import { BookSharp as BookIcon } from '@vicons/ionicons5';
import { AnalyticsOutline as DashboardIcon } from '@vicons/ionicons5';
import { SettingsOutline as SettingsIcon } from '@vicons/ionicons5';
import { PersonOutline as PersonIcon } from '@vicons/ionicons5';
import { RouterLink } from 'vue-router';
</script>
<style scoped>
.navigate {
    width: 15%;

    height: 100%;
    background-color: #262626;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.router-link {
    color: white;
    font-size: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 20px;
    width: 80%;
    justify-content: center;
    height: 50px;
    transition: background-color 0.3s;
    text-decoration: none;
}

.router-link:hover,
.router-link:active,
.router-link.active {
    background-color: white;
    color: black;
}

.icon {
    width: 24px;
    height: 24px;
}
</style>
