import {watch} from 'vue'
import {ref, reactive, toRefs} from 'vue'
import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function(destinationPath: string, delay: number) {
    
    const router = useRouter()
    const route = useRoute()
    const timer = ref(delay)

    onMounted(()=>{
        if (route.path == '/'){ // mask sure only use in home
            const interval = setInterval(()=> {
                timer.value--
                if (timer.value == 0){
                    clearInterval(interval)
                    router.push(destinationPath)
                }
            }, 1000)
        }
    })
    return {timer}
}