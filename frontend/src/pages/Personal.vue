<template>
  <div class="personal">
    <div class="profile">
      <div class="avatar">
        <img src="E:\Code\Git\AI4M\platform\platform\frontend\public\head.jpg" alt="Avatar">
      </div>
      <div class="info">
        <h2>{{ userInfo.name }}</h2>
        <p>{{ userInfo.bio }}</p>
      </div>
    </div>
    <div class="settings">
      <h3>账号设置</h3>
      <form @submit.prevent="updateAccount">
        <div class="form-group">
          <label for="username">用户名:</label>
          <input type="text" id="username" v-model="accountInfo.username">
        </div>
        <div class="form-group">
          <label for="email">邮箱:</label>
          <input type="email" id="email" v-model="accountInfo.email">
        </div>
        <button type="submit">保存</button>
      </form>
    </div>
    
  </div>
</template>

<script setup name="Personal">
  import { ref } from 'vue'

  const userInfo = ref({
    name: 'John Doe',
    bio: 'Hello, I am John Doe.'
  })

  const accountInfo = ref({
    username: '大帅哥',
    email: 'xueyangsb@outlook.com'
  })


  const updateAccount = () => {
    // 实现更新账号信息的逻辑
  }
</script>

<style scoped>
.personal {
  background-color: #d1d1d1;
  width:80%;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  margin: auto;
  margin-top:10%;
}

.profile, .settings{
  width: 80%;
  margin-left: 5%;
  text-align: center;
  font-size: 20px;
}

.avatar img {
  width: 150px;
  height:150px;
  border-radius: 50%;
  border: 3px solid #fff;
}

form .form-group {
  margin-bottom: 10px;
}

button {
  background-color: #48494a;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input {
  margin-top: 5px;
  color: #48494a;
  height: 1.5rem;
  color:#fff;
  border-radius:12px;
}
</style>
