<template>
    <div class="ring-component">
        <div class="ring" :style="ringStyle"></div>
    </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';

export default {
    props: {
        percentage: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    setup(props) {
        const ringStyle = computed(() => ({
            backgroundImage: `conic-gradient(
            #272727 0% ${props.percentage}%,
        transparent ${props.percentage}% 100%
      )`,
        }));

        return {
            ringStyle,
        };
    },
};
</script>

<style scoped>
.ring-component {
    width: 50px;
    /* Adjust the width as needed */
    height: 50px;
    /* Adjust the height as needed */
    position: relative;
    border-radius: 50%;
    background-color: #dedede;
    border: 2px solid black;
}

.ring {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: cover;
}
</style>
