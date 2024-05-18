import { ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/store/LoginStore'
import { type signInData } from '@/types'
import {useSign} from '@/api/useSign'

export function useLogin() {
    const LoginData: Ref<signInData> = ref({
        email: '',
        password: '',
    })

    const router = useRouter()
    const LoginStore = useLoginStore()
    const {SignInUser} = useSign()

    async function handleLogin() {
        const response = await SignInUser(LoginData.value)
        if (response.login == 1){
            LoginStore.login()
            router.push('/cabinet') // 登录成功后跳转到 /cabinet
        }
            
    }
    const logout = () => {
        LoginStore.logout()
    }

    // 导出 loggedIn 变量以及其他方法
    return { LoginData, handleLogin, logout }
}

/*
import { ref } from "vue"
import axios from "axios"

export function useLogin() {
    const username = ref<string>('')
    const password = ref<string>('')
    const message = ref<string>('')
    const loggedIn = ref<boolean>(false)
        // 实际的登录逻辑（使用 axios 或其他方式）
        // try {
        //     const response = await axios.post('http://localhost:8000/appDemo/login/', {
        //         username: username.value,
        //         password: password.value
        //     })
        //     message.value = 'Login successful!'
        //     loggedIn.value = true
        // } catch(error: any) {
        //     if (error.message) {
        //         message.value = error.response.data.message
        //     } else {
        //         message.value = 'Error: Cannot connect to server.'
        //     }
        //     loggedIn.value = false
        // }
    }

    return { username, password, message, loggedIn}
}
*/ 