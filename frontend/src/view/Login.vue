<template>
  <div class="login-container">
      <h2 style="color:black">Login</h2>
      <form @submit.prevent="handleLogin">
          <div class="form-group">
              <label for="username" style="color:rgb(0, 0, 0)">Account</label>
              <input type="text" id="email" v-model="LoginData.email" required />
          </div>

          <div class="form-group">
              <label for="password" style="color:rgb(4, 4, 4)">Password</label>
              <input type="password" id="password" v-model="LoginData.password" required />
          </div>
          <button type="submit">Sign In</button>
        </form>

        <button @click="beginRegistrate">Sign Up</button>
        <!--Register Dialog-->
        <div v-if="signUp" class="register-dialog">
          <h3>Register</h3>
          <div v-if="signUpStep === 1" >
            <input type="email" v-model="signUpData.email" placeholder="Email">
            <button @click="goToNextStep">Next</button>
          </div>
          <div v-if="signUpStep === 2" >
            <input type="text" v-model="signUpData.verificationCode" placeholder="Verification Code">
            <button @click="goToPreviousStep">Back</button>
            <button @click="goToNextStep">Next</button>
          </div>
          <div v-if="signUpStep === 3" >
            <input type="password" v-model="signUpData.password" placeholder="Password">
            <input type="password" v-model="signUpData.confirmPassword" placeholder="Confirm Password">
            <button @click="goToPreviousStep">Back</button>
            <button @click="goToNextStep">Sign Up</button>
          </div>
          <h3>{{ signUpData.prompt }}</h3>
        </div>
  </div>
</template>

<script setup lang="ts">
  import { useLogin } from '@/hooks/useLogin'
  import { useRegister } from '@/hooks/useRegister'

  const { LoginData,
    handleLogin, logout } = useLogin()

  const {signUp, signUpStep, signUpData,
     beginRegistrate, goToNextStep, goToPreviousStep, resetRegistration} = useRegister()

</script>

<style>
.login-container {
  width: 240px;
  height: 350px;
  margin: auto;
  padding: 1em;
  box-shadow: 0 0 20px #d0cece;
  border-radius: 20px;
}

.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
}

input[type="text"],
input[type="password"] {
  width: 60%;
  padding: 0.5em;
  border-radius: 15px;
  margin-bottom: 0.5em;
}

button {
  padding: 0.5em;
  color: white;
  border: 2px solid black;
  border-radius: 14px;
  width: 40%;
  cursor: pointer;
}

button:hover {
  background-color: white;
  color: black;
}

.register-dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}
</style>
