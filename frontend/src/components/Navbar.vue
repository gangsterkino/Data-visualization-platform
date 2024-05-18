<template>
  <div class="nav">
    <div class="logo"></div>
    <div class="spacer"></div>
   <div class="user" style="display: flex; width: 100%;">
      <!-- 如果 loggedIn 为 true，则显示注销按钮 -->
      <div v-if="loggedIn" @click="handleLogout" style="cursor: pointer; text-decoration: none; font-size: 22px; color: white;">Logout</div>
      <!-- 如果 loggedIn 为 false，则显示登录按钮 -->
      <router-link v-show="!loggedIn" to="/login" style="cursor: pointer; text-decoration: none; font-size: 22px; color: white;">Login</router-link>


      <!-- 如果 loggedIn 为 true，则显示用户头像 -->
      <div class="circle" v-if="loggedIn"><img src="E:\Code\Git\AI4M\platform\platform\frontend\public\head.jpg" style="width: 100%; border-radius: 50%; height: 100%;"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref,} from 'vue'
import { useLogin } from '@/hooks/useLogin.ts'

const { loggedIn, logout } = useLogin()
const router = useRouter()

const loggedInValue = ref(false)

// 登录成功后更新 loggedIn 的值
const handleLogin = async () => {
  await login()
  if (loggedIn.value ) {
      router.push('/cabinet')
  }
}
// 退出登录
const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>
<style scoped>
.nav {
  height: auto;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  background-color: #202020;
  justify-content: center;
}

.spacer {
  min-width: 90%;
  flex-grow: 1;
}

.circle {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #d1d1d1;
  border: 2px solid #d1d1d1;
  margin-left: 2rem;
}
</style>
